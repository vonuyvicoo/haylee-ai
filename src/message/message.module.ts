import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { AgentModule } from '../agent/agent.module';
import { StreamerFactory } from './factory/streamer.factory';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule, AgentModule],
    providers: [MessageService, StreamerFactory],
    controllers: [MessageController]
})
export class MessageModule { }
