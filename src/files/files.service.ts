import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SupabaseService } from "src/lib/supabase/supabase.service";
import { UserSession } from "@thallesp/nestjs-better-auth";

export const SELECT = {
    id: true,
    title: true,
    type: true,
    file_name: true,
    owner_id: true
};


@Injectable()
export class FilesService {
    constructor(
        private prisma: PrismaService,
        private supabase: SupabaseService,
    ) {}

    async create(
        createFileDto: CreateFileDto, 
        file: Express.Multer.File,
        session: UserSession
    ) {
        const fileId = crypto.randomUUID();
        const extension = file.originalname.split(".").pop();
        const seed = Date.now().toString();
        const fileName = `${seed}${fileId}.${extension}`;
        const internalPath = `public/files/${fileName}`;

        await this.supabase.upload(internalPath, file.buffer, file.mimetype);

        return this.prisma.file.create({
            select: SELECT,
            data: {
                id: fileId,
                title: createFileDto.title,
                type: createFileDto.type || file.mimetype,
                internal_path: internalPath,
                file_name: file.originalname,
                owner_id: session.user.id
            },
        });
    }

    async findAll(session: UserSession) {
        return this.prisma.file.findMany({
            select: SELECT,
            orderBy: { created_at: "desc" },
            where: {
                owner_id: session.user.id
            }
        });
    }

    async findOne(id: string, session: UserSession) {
        if(!id || typeof id === 'undefined') throw new BadRequestException("Invalid ID.");
        return this.prisma.file.findFirstOrThrow({
            select: SELECT,
            where: { id, owner_id: session.user.id },
        });
    }

    private async findOneWithPath(id: string, session: UserSession) {
        if(!id || typeof id === 'undefined') throw new BadRequestException("Invalid ID.");
        return this.prisma.file.findFirstOrThrow({
            select: { ...SELECT, internal_path: true },
            where: { id, owner_id: session.user.id },
        });
    }

    async getFileContent(id: string, session: UserSession) {
        const file = await this.findOneWithPath(id, session);
        return this.supabase.download(file.internal_path);
    }

    async updateContent(id: string, file: Express.Multer.File, session: UserSession) {
        const existing = await this.findOneWithPath(id, session);

        await this.supabase.upload(existing.internal_path, file.buffer, file.mimetype);

        return this.prisma.file.update({
            where: { id },
            select: SELECT,
            data: {
                file_name: file.originalname,
                type: file.mimetype,
            },
        });
    }

    async update(id: string, updateFileDto: UpdateFileDto, session: UserSession) {
        await this.findOne(id, session);

        return this.prisma.file.update({
            select: SELECT,
            where: { id },
            data: updateFileDto,
        });
    }

    async remove(id: string, session: UserSession) {
        const file = await this.findOneWithPath(id, session);

        // Delete from Supabase
        await this.supabase.delete([file.internal_path]);

        // Delete from Database
        return this.prisma.file.delete({
            select: SELECT,
            where: { id },
        });
    }
}
