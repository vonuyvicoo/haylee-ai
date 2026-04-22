import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { StreamerFactory } from './factory/streamer.factory';
import { PrismaModule } from '@core/prisma/prisma.module';
import { AgentModule } from '@modules/agent/agent.module';

@Module({
    imports: [PrismaModule, AgentModule],
    providers: [MessageService, StreamerFactory],
    controllers: [MessageController]
})
export class MessageModule { }
