import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { IntegrationModule } from './integrations/integration.module';
import { AdAccountModule } from './meta/ad-account/adaccount.module';
import { AdSetModule } from './meta/adset/adset.module';
import { CampaignModule } from './meta/campaign/campaign.module';
import { AdModule } from './meta/ads/ads.module';
import { AdCreativeModule } from './meta/ad-creative/adcreative.module';
import { MessageModule } from './message/message.module';
import { ImageGeneratorModule } from './image-generator/image-generator.module';
import { FilesModule } from './files/files.module';
import { PrismaClientExceptionFilter } from './_shared/filters/prisma.filter';
import { FacebookRequestErrorFilter } from './_shared/filters/facebook.filter';
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { CSRFGuard } from './_shared/guards/csrf.guard';
import { AdLibraryModule } from './meta/adlibrary/adlibrary.module';

const ErrorProvider: Provider = {
    provide: APP_FILTER,
    useClass: PrismaClientExceptionFilter
}

const FacebookErrorProvider: Provider = {
    provide: APP_FILTER,
    useClass: FacebookRequestErrorFilter
}

const CsrfGuardProvider: Provider = {
    provide: APP_GUARD,
    useClass: CSRFGuard
}

@Module({
  imports: [
        AuthModule.forRoot({ auth }), 
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                TRUSTED_ORIGINS: Joi.string(),
                DATABASE_URL: Joi.string(),
                DOMAIN: Joi.string(),
            })
        }),
        AdLibraryModule,
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
  providers: [AppService, ErrorProvider, FacebookErrorProvider, CsrfGuardProvider],
})
export class AppModule {}
