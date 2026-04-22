import { Module } from '@nestjs/common';
import { ImageGeneratorService } from './image-generator.service';

@Module({
    providers: [ImageGeneratorService],
    exports: [ImageGeneratorService],
})
export class ImageGeneratorModule {}
