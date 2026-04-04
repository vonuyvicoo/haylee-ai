import { Injectable } from '@nestjs/common';
import { Subscriber } from 'rxjs';
import { LlmService } from '../llm/llm.service';
import { CreateMessageDto, IHistoryPayload, IRole, } from './dto/create-message.dto';
import { StreamEvent } from './interfaces/stream-response.interface';
import { StreamerFactory } from './factory/streamer.factory';

@Injectable()
export class MessageService {
    constructor(
        private llmService: LlmService,
        private readonly streamerFactory: StreamerFactory
    ) {
    }
    buildSkeleton(role: IRole, content: string): IHistoryPayload {
        return {
            role,
            content
        }
    }

    buildHistory(payload: CreateMessageDto) {
        const conversation_history = payload.conversation_history || [];
        const message_payload: IHistoryPayload[] = [];

        for (let convo of conversation_history) {
            message_payload.push(convo);
        }

        message_payload.push(this.buildSkeleton(IRole.HUMAN, payload.message));
        // Add document state if exists
        return message_payload;
    };

    async graphInvoke(payload: CreateMessageDto, subscriber: Subscriber<StreamEvent>) {
        for await (const event of this.llmService.invoke(this.buildHistory(payload))) {
            //langgraph mode
            const strategy = this.streamerFactory.create(event as any);
            strategy?.emit(event as any, subscriber);
        }
    }
}
