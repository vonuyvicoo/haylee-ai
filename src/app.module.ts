import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './exception-filters/prisma.filter';
import { IntegrationModule } from './integrations/integration.module';
import { AdAccountModule } from './meta/ad-account/adaccount.module';
import { AdSetModule } from './meta/adset/adset.module';
import { CampaignModule } from './meta/campaign/campaign.module';
import { AdModule } from './meta/ads/ads.module';
import { AdCreativeModule } from './meta/ad-creative/adcreative.module';
import { MessageModule } from './message/message.module';

const ErrorProvider: Provider = {
    provide: APP_FILTER,
    useClass: PrismaClientExceptionFilter
}

@Module({
  imports: [
        AuthModule.forRoot({ auth }), 
        UserModule,
        PrismaModule,
        EventEmitterModule.forRoot(),
        IntegrationModule,
        AdAccountModule,
        AdSetModule,
        CampaignModule,
        AdModule,
        AdCreativeModule,
        MessageModule
    ],
  controllers: [AppController],
  providers: [AppService, ErrorProvider],
})
export class AppModule {}
