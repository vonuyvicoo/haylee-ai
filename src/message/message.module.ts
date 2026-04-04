import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { LlmModule } from '../llm/llm.module';
import { StreamerFactory } from './factory/streamer.factory';

@Module({
    imports: [LlmModule],
    providers: [MessageService, StreamerFactory],
    controllers: [MessageController]
})
export class MessageModule { }
