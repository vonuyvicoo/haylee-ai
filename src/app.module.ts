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
import { FacebookRequestErrorFilter } from './exception-filters/facebook.filter';
import { IntegrationModule } from './integrations/integration.module';
import { AdAccountModule } from './meta/ad-account/adaccount.module';
import { AdSetModule } from './meta/adset/adset.module';
import { CampaignModule } from './meta/campaign/campaign.module';
import { AdModule } from './meta/ads/ads.module';
import { AdCreativeModule } from './meta/ad-creative/adcreative.module';
import { MessageModule } from './message/message.module';
import { ImageGeneratorModule } from './image-generator/image-generator.module';
import { FilesModule } from './files/files.module';

const ErrorProvider: Provider = {
    provide: APP_FILTER,
    useClass: PrismaClientExceptionFilter
}

const FacebookErrorProvider: Provider = {
    provide: APP_FILTER,
    useClass: FacebookRequestErrorFilter
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
        MessageModule,
        ImageGeneratorModule,
        FilesModule
    ],
  controllers: [AppController],
  providers: [AppService, ErrorProvider, FacebookErrorProvider],
})
export class AppModule {}
