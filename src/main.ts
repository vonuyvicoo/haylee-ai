import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true,
        bodyParser: true
    });

    app.enableCors({
        origin: process.env.TRUSTED_ORIGINS?.split(',') ?? ["http://localhost:3001"],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-pm-pin'],
    });

    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(
        new ValidationPipe(
            { 
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
                // restrict props
                whitelist: true,
                forbidNonWhitelisted: true
            }, 
        )
    );
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
