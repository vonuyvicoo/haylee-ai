import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Subscriber } from 'rxjs';
import { AgentService } from '../agent/agent.service';
import { CreateMessageDto, IHistoryPayload, IRole, } from './dto/create-message.dto';
import { ConversationInfoPayload, EventKind, StreamEvent } from './interfaces/stream-response.interface';
import { StreamerFactory } from './factory/streamer.factory';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindManyConversationsDto } from './dto/find-many-messages.dto';

@Injectable()
export class MessageService {
    private readonly logger = new Logger(MessageService.name, { timestamp: true })
    constructor(
        private agentService: AgentService,
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
        return await this.prisma.conversation.create({
            data: {
                id,
                title: payload.message,
                owner_id: session.user.id
            }
        })
    }
    
    // Internal findOne for assertion
    async _findOneDB(thread_id: string, session: UserSession) {
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

    async findOne(thread_id: string, session: UserSession) {
        const conv = await this._findOneDB(thread_id, session);
        const messages = await this.agentService._findManyMessages(conv.id);
        return messages;
    }


    async graphInvoke(payload: CreateMessageDto, subscriber: Subscriber<StreamEvent>, session: UserSession, signal: AbortSignal) {
        let thread_id = payload.conversation_id;

        if(thread_id) {
            //assert ownership
            await this._findOneDB(thread_id, session);
        } else {
            thread_id = crypto.randomUUID();
            this._create(thread_id, payload, session).then((c) => {
                this.logger.log("Conversation created.");

                // TODO: have better separation of concerns for this.
                // Could have been in StreamerFactory but that only handles langchain stuff
                subscriber.next(new MessageEvent<ConversationInfoPayload>("json", {
                    data: {
                        kind: EventKind.CONVERSATION_INFO,
                        node: "conversation_info",
                        content: {
                            type: "created",
                            subject: c.id
                        }
                    }
                }));

            }).catch(err => {
                    // TODO: have better separation of concerns for this.
                    // Could have been in StreamerFactory but that only handles langchain stuff
                    this.logger.error(err);
                    subscriber.next(new MessageEvent<ConversationInfoPayload>("json", {
                        data: {
                            kind: EventKind.CONVERSATION_INFO,
                            node: "conversation_info",
                            content: {
                                type: "error",
                                subject: "Failed to create conversation"
                            }
                        }
                    }));
                });
        }

        for await (const event of this.agentService.invoke(thread_id, payload.message, session, signal)) {
            const strategy = this.streamerFactory.create(event as any);
            strategy?.emit(event as any, subscriber);
        }
    }

    async findMany(query: FindManyConversationsDto, session: UserSession) {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                owner_id: session.user.id
            },
            orderBy: {
                [query.sort_field]: query.sort_order
            },
            take: query.size,
            skip: (query.page - 1) * query.size
        });

        return conversations;
    }
}
