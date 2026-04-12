import { Body, Controller, Header, Logger, Post, Query, Req, Res, Sse } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Observable } from 'rxjs';
import { StreamEvent } from './interfaces/stream-response.interface';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { Request, Response } from 'express';

@Controller('chat')
export class MessageController {
    private readonly logger = new Logger(MessageController.name, { timestamp: true })
    constructor(
        private messageService: MessageService,
    ) { }
    
    @Post()
    @Sse()
    @Header('Connection', 'keep-alive')
    graphInvoke(
        @Body() createMessageDto: CreateMessageDto,
        @Session() session: UserSession,
        @Res({ passthrough: true }) res: Response 
    ): Observable<StreamEvent>{
        return new Observable<MessageEvent>((subscriber) => {
            const controller = new AbortController();

            res.on('close', () => {
                this.logger.log(`HTTP con closed.`);
                controller.abort();
                subscriber.complete();
            })

            this.messageService.graphInvoke(createMessageDto, subscriber, session, controller.signal).then(_ => {
                subscriber.complete()
            }).catch(err => {
                    console.log(err.name);
                    if(err.name === 'AbortError') { 
                        this.logger.log('AbortError caught LangChain stopped');
                        return;
                    }
                    console.error(err);
                    subscriber.error({ error: err })
                });

            return () => { 
                this.logger.log('Observable teardown fired');
                controller.abort()
            }
        });
    }

}
