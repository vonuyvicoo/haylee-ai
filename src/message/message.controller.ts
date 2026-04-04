import { Body, Controller, Header, Post, Query, Sse } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Observable } from 'rxjs';
import { StreamEvent } from './interfaces/stream-response.interface';

@Controller('chat')
export class MessageController {
    constructor(
        private messageService: MessageService,
    ) { }
    
    @Post()
    @Sse()
    @Header('Connection', 'keep-alive')
    graphInvoke(
        @Body() createMessageDto: CreateMessageDto,
    ): Observable<StreamEvent>{
        return new Observable<MessageEvent>((subscriber) => {
            this.messageService.graphInvoke(createMessageDto, subscriber).then(_ => {
                subscriber.complete()
            }).catch(err => {
                console.error(err);
                subscriber.error({ error: err })
            })
        });
    }
   
}
