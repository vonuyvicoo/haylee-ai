import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { LlmModule } from '../llm/llm.module';
import { StreamerFactory } from './factory/streamer.factory';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule, LlmModule],
    providers: [MessageService, StreamerFactory],
    controllers: [MessageController]
})
export class MessageModule { }
