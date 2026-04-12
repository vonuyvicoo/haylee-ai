import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Subscriber } from 'rxjs';
import { LlmService } from '../llm/llm.service';
import { CreateMessageDto, IHistoryPayload, IRole, } from './dto/create-message.dto';
import { StreamEvent } from './interfaces/stream-response.interface';
import { StreamerFactory } from './factory/streamer.factory';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    private readonly logger = new Logger(MessageService.name, { timestamp: true })
    constructor(
        private llmService: LlmService,
        private readonly streamerFactory: StreamerFactory,
        private readonly prisma: PrismaService
    ) {
    }
    buildSkeleton(role: IRole, content: string): IHistoryPayload {
        return {
            role,
            content
        }
    }
    

    //Internal to message service
    async _create(id: string, payload: CreateMessageDto, session: UserSession) {
        await this.prisma.conversation.create({
            data: {
                id,
                title: payload.message,
                owner_id: session.user.id
            }
        })
    }

    async findOne(thread_id: string, session: UserSession) {
        const conv = await this.prisma.conversation.findUnique({
            where: {
                id_owner_id: {
                    id: thread_id,
                    owner_id: session.user.id
                } 
            }
        });
        if(!conv) throw new ForbiddenException("You don't have access to this resource.");
        return conv;
    }


    async graphInvoke(payload: CreateMessageDto, subscriber: Subscriber<StreamEvent>, session: UserSession, signal: AbortSignal) {
        let thread_id = payload.conversation_id;

        if(thread_id) {
            //assert ownership
            await this.findOne(thread_id, session);
        } else {
            thread_id = crypto.randomUUID();
            this._create(thread_id, payload, session).then(() => {
                this.logger.log("Conversation created.")
            }).catch(err => this.logger.error(err));
        }

        for await (const event of this.llmService.invoke(thread_id, payload.message, session, signal)) {
            //langgraph mode
            const strategy = this.streamerFactory.create(event as any);
            strategy?.emit(event as any, subscriber);
        }
    }

    async findMany(session: UserSession) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                owner_id: session.user.id
            }
        });

        return conversations;
    }
}
