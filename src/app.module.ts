import { Module, Provider } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { PrismaClientExceptionFilter } from '@common/filters/prisma.filter';
import { FacebookRequestErrorFilter } from '@common/filters/facebook.filter';
import { CSRFGuard } from '@common/guards/csrf.guard';
import { auth } from "@core/auth";
import { AdLibraryModule } from '@modules/meta/adlibrary/adlibrary.module';
import { UserModule } from '@modules/user/user.module';
import { PrismaModule } from '@core/prisma/prisma.module';
import { IntegrationModule } from '@modules/integrations/integration.module';
import { AdAccountModule } from '@modules/meta/ad-account/adaccount.module';
import { AdSetModule } from '@modules/meta/adset/adset.module';
import { CampaignModule } from '@modules/meta/campaign/campaign.module';
import { AdModule } from '@modules/meta/ads/ads.module';
import { AdCreativeModule } from '@modules/meta/ad-creative/adcreative.module';
import { MessageModule } from '@modules/message/message.module';
import { ImageGeneratorModule } from '@core/image-generator/image-generator.module';
import { FilesModule } from '@modules/files/files.module';

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
