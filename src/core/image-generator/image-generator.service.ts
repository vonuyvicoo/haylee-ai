import { Injectable, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable()
export class ImageGeneratorService implements OnModuleDestroy {
    private browser: Browser | null = null;

    private async getBrowser(): Promise<Browser> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        }
        return this.browser;
    }

    async generateImage(html: string, width: number, height: number): Promise<Buffer> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        try {
            await page.setViewport({ width, height });
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const screenshot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width, height } });
            return Buffer.from(screenshot);
        } finally {
            await page.close();
        }
    }

    async onModuleDestroy() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
