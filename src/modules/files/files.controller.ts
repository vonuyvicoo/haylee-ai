import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    Res,
    StreamableFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { Session, UserSession } from "@thallesp/nestjs-better-auth";
import { FilesService } from "./files.service";
import { AllowMultipart } from "@common/decorators/allow-multipart.decorator";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";

@Controller("files")
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post()
    @AllowMultipart()
    @UseInterceptors(FileInterceptor("file"))
    async create(
        @Body() createFileDto: CreateFileDto,
        @UploadedFile() file: Express.Multer.File,
        @Session() session: UserSession
    ) {
        const data = await this.filesService.create(createFileDto, file, session);
        return { data };
    }

    @Get()
    async findAll(
        @Session() session: UserSession
    ) {
        const data = await this.filesService.findAll(session);
        return { data };
    }

    @Get(":id")
    async findOne(
        @Param("id") id: string,
        @Session() session: UserSession
    ) {
        const data = await this.filesService.findOne(id, session);
        return { data };
    }

    @Get(":id/content")
    async getContent(
        @Param("id") id: string, 
        @Res({ passthrough: true }) res: Response,
        @Session() session: UserSession
    ) {
        const file = await this.filesService.findOne(id, session);
        const blob = await this.filesService.getFileContent(id, session);
        res.set({
            "Content-Type": file.type,
            "Content-Disposition": `inline; filename="${file.file_name}"`,
        });

        return new StreamableFile(Buffer.from(await blob.arrayBuffer()));
    }

    @Patch(":id/content")
    @AllowMultipart()
    @UseInterceptors(FileInterceptor("file"))
    async updateContent(
        @Param("id") id: string,
        @UploadedFile() file: Express.Multer.File,
        @Session() session: UserSession
    ) {
        const data = await this.filesService.updateContent(id, file, session);
        return { data };
    }

    @Patch(":id")
    async update(
        @Param("id") id: string, 
        @Body() updateFileDto: UpdateFileDto,
        @Session() session: UserSession
    ) {
        const data = await this.filesService.update(id, updateFileDto, session);
        return { data };
    }

    @Delete(":id")
    async remove(
        @Param("id") id: string,
        @Session() session: UserSession
    ) {
        const data = await this.filesService.remove(id, session);
        return { data };
    }
}
