/**
 * Codegen: class-validator DTOs → Zod schemas
 * Run: pnpm gen:zod
 *
 * Outputs one *.schema.ts file per DTO file into src/generated/schemas/
 */

import { Project, ClassDeclaration, PropertyDeclaration, Decorator, SourceFile } from 'ts-morph'
import * as path from 'path'
import * as fs from 'fs'

const API_ROOT = path.resolve(__dirname, '..')
const API_SRC  = path.join(API_ROOT, 'src')
const OUT_DIR  = path.join(API_SRC, 'generated', 'schemas')

fs.mkdirSync(OUT_DIR, { recursive: true })

const project = new Project({
  tsConfigFilePath: path.join(API_ROOT, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
})

project.addSourceFilesAtPaths(`${API_SRC}/**/dto/*.ts`)

for (const sourceFile of project.getSourceFiles()) {
  const classes = sourceFile.getClasses()
  if (classes.length === 0) continue

  // Enums/classes defined in THIS file
  const localEnums = new Set(sourceFile.getEnums().map(e => e.getName()!))

  // Enums/classes imported from OTHER project files
  // name → absolute path of the file they live in
  const importedEnums   = new Map<string, string>()
  const importedClasses = new Map<string, string>()

  for (const imp of sourceFile.getImportDeclarations()) {
    const spec = imp.getModuleSpecifierValue()

    // Resolve the import: relative paths OR baseUrl-rooted paths (e.g. "src/meta/...")
    const dir = path.dirname(sourceFile.getFilePath())
    const candidates = spec.startsWith('.')
      ? [path.resolve(dir, spec + '.ts'), path.resolve(dir, spec)]
      : [path.resolve(API_ROOT, spec + '.ts'), path.resolve(API_ROOT, spec)]

    const impFile = candidates.map(c => project.getSourceFile(c)).find(Boolean)
    if (!impFile) continue // truly a node_module or unresolvable

    for (const named of imp.getNamedImports()) {
      const n = named.getName()
      if (impFile.getEnum(n))  importedEnums.set(n, impFile.getFilePath())
      if (impFile.getClass(n)) importedClasses.set(n, impFile.getFilePath())
    }
  }

  // Accumulate what we actually use (to build imports in the output file)
  const usedLocalEnums    = new Set<string>()
  const usedExtEnums      = new Map<string, string>() // name → src file path
  const usedExtSchemas    = new Map<string, string>() // className → src file path
  const partialImports    = new Set<string>()

  const schemaDefs: string[] = []

  for (const cls of classes) {
    const name = cls.getName()
    if (!name) continue

    const partialBase = getPartialTypeBase(cls)
    if (partialBase) {
      partialImports.add(partialBase)
      schemaDefs.push(`export const ${name}Schema = ${partialBase}Schema.partial()`)
      continue
    }

    const propLines: string[] = []
    for (const prop of cls.getProperties()) {
      const zodExpr = buildZodExpr(
        prop, localEnums, importedEnums, importedClasses,
        usedLocalEnums, usedExtEnums, usedExtSchemas,
      )
      propLines.push(`  ${prop.getName()}: ${zodExpr}`)
    }

    schemaDefs.push(`export const ${name}Schema = z.object({\n${propLines.join(',\n')},\n})`)
  }

  // ---- Build import lines ----
  const lines: string[] = [
    `// AUTO-GENERATED — do not edit by hand`,
    `// Source: ${path.relative(API_ROOT, sourceFile.getFilePath())}`,
    `import { z } from 'zod'`,
  ]

  // Local enums (same file)
  if (usedLocalEnums.size > 0) {
    const rel = relativeFromOutDir(sourceFile.getFilePath())
    lines.push(`import { ${[...usedLocalEnums].join(', ')} } from '${rel}'`)
  }

  // External enums (other DTO files) — grouped by source file
  const extEnumByFile = new Map<string, string[]>()
  for (const [name, filePath] of usedExtEnums) {
    const group = extEnumByFile.get(filePath) ?? []
    group.push(name)
    extEnumByFile.set(filePath, group)
  }
  for (const [filePath, names] of extEnumByFile) {
    const rel = relativeFromOutDir(filePath)
    lines.push(`import { ${names.join(', ')} } from '${rel}'`)
  }

  // External nested schemas (other generated schema files)
  const extSchemaByFile = new Map<string, string[]>()
  for (const [className, filePath] of usedExtSchemas) {
    const group = extSchemaByFile.get(filePath) ?? []
    group.push(`${className}Schema`)
    extSchemaByFile.set(filePath, group)
  }
  for (const [filePath, names] of extSchemaByFile) {
    const schemaFile = path.join(OUT_DIR, path.basename(filePath, '.ts') + '.schema')
    const rel = './' + path.relative(OUT_DIR, schemaFile).replace(/\\/g, '/')
    lines.push(`import { ${names.join(', ')} } from '${rel}'`)
  }

  // PartialType base schema imports
  for (const baseName of partialImports) {
    const baseFile = project.getSourceFiles().find(sf =>
      sf.getClasses().some(c => c.getName() === baseName)
    )
    if (baseFile) {
      const schemaFile = path.join(OUT_DIR, path.basename(baseFile.getFilePath(), '.ts') + '.schema')
      const rel = './' + path.relative(OUT_DIR, schemaFile).replace(/\\/g, '/')
      lines.push(`import { ${baseName}Schema } from '${rel}'`)
    }
  }

  lines.push('', ...schemaDefs.map(d => d + '\n'))

  const outFile = path.join(OUT_DIR, path.basename(sourceFile.getFilePath(), '.ts') + '.schema.ts')
  fs.writeFileSync(outFile, lines.join('\n'))
  console.log(`✓  ${path.relative(API_ROOT, outFile)}`)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeFromOutDir(filePath: string): string {
  return './' + path.relative(OUT_DIR, filePath.replace(/\.ts$/, '')).replace(/\\/g, '/')
}

function getPartialTypeBase(cls: ClassDeclaration): string | null {
  for (const clause of cls.getHeritageClauses()) {
    for (const typeNode of clause.getTypeNodes()) {
      const m = typeNode.getText().match(/^PartialType\((\w+)\)/)
      if (m) return m[1]
    }
  }
  return null
}

function buildZodExpr(
  prop: PropertyDeclaration,
  localEnums: Set<string>,
  importedEnums: Map<string, string>,
  importedClasses: Map<string, string>,
  usedLocalEnums: Set<string>,
  usedExtEnums: Map<string, string>,
  usedExtSchemas: Map<string, string>,
): string {
  const decs  = prop.getDecorators()
  const names = new Set(decs.map(d => d.getName()))

  const isOptional = names.has('IsOptional') || names.has('ValidateIf')
  const isArray    = names.has('IsArray')
  const hasNested  = names.has('ValidateNested')

  // --- @ValidateNested + @Type(() => SomeClass) ---
  if (hasNested) {
    const className = extractTypeArg(decs)
    if (className) {
      // If the class comes from another file, track the schema import
      if (importedClasses.has(className)) {
        usedExtSchemas.set(className, importedClasses.get(className)!)
      }
      // (If local, the schema is defined earlier in the same generated file)
    }
    const inner = className ? `${className}Schema` : 'z.object({})'
    const type  = isArray ? `z.array(${inner})` : inner
    return isOptional ? `${type}.optional()` : type
  }

  // --- @IsEnum ---
  const enumDec = decs.find(d => d.getName() === 'IsEnum')
  if (enumDec) {
    const arg = enumDec.getArguments()[0]?.getText() ?? ''
    let inner: string
    if (localEnums.has(arg)) {
      usedLocalEnums.add(arg)
      inner = `z.enum(${arg})`
    } else if (importedEnums.has(arg)) {
      usedExtEnums.set(arg, importedEnums.get(arg)!)
      inner = `z.enum(${arg})`
    } else {
      inner = `z.string() /* ${arg} */`
    }
    const type = isArray ? `z.array(${inner})` : inner
    return isOptional ? `${type}.optional()` : type
  }

  // --- @IsIn([...]) ---
  const isInDec = decs.find(d => d.getName() === 'IsIn')
  if (isInDec) {
    const arg  = isInDec.getArguments()[0]?.getText() ?? '[]'
    const type = `z.enum(${arg} as [string, ...string[]])`
    return isOptional ? `${type}.optional()` : type
  }

  // --- string-family ---
  if (names.has('IsEmail')) {
    return maybeOpt(isArray ? 'z.array(z.string().email())' : 'z.string().email()', isOptional)
  }
  if (names.has('IsUUID')) {
    return maybeOpt(isArray ? 'z.array(z.string().uuid())' : 'z.string().uuid()', isOptional)
  }
  if (names.has('IsDateString')) {
    return maybeOpt(isArray ? 'z.array(z.string())' : 'z.string() /* ISO datetime */', isOptional)
  }
  if (names.has('IsISO31661Alpha2')) {
    return maybeOpt(isArray ? 'z.array(z.string().length(2))' : 'z.string().length(2)', isOptional)
  }
  if (names.has('IsString')) {
    return maybeOpt(isArray ? 'z.array(z.string())' : 'z.string()', isOptional)
  }

  // --- number-family ---
  if (names.has('IsInt') || names.has('IsNumber')) {
    let base = names.has('IsInt') ? 'z.number().int()' : 'z.number()'
    base = applyMinMax(base, decs)
    return maybeOpt(isArray ? `z.array(${base})` : base, isOptional)
  }

  // --- boolean ---
  if (names.has('IsBoolean')) return maybeOpt('z.boolean()', isOptional)

  // --- object / record ---
  if (names.has('IsObject')) return maybeOpt('z.record(z.string(), z.unknown())', isOptional)

  return maybeOpt('z.unknown()', isOptional)
}

function extractTypeArg(decs: Decorator[]): string | null {
  const typeDec = decs.find(d => d.getName() === 'Type')
  if (!typeDec) return null
  const m = typeDec.getArguments()[0]?.getText().match(/\(\)\s*=>\s*(\w+)/)
  return m ? m[1] : null
}

function applyMinMax(base: string, decs: Decorator[]): string {
  const minDec = decs.find(d => d.getName() === 'Min')
  const maxDec = decs.find(d => d.getName() === 'Max')
  if (minDec) base += `.min(${minDec.getArguments()[0]?.getText() ?? ''})`
  if (maxDec) base += `.max(${maxDec.getArguments()[0]?.getText() ?? ''})`
  return base
}

function maybeOpt(expr: string, optional: boolean): string {
  return optional ? `${expr}.optional()` : expr
}
