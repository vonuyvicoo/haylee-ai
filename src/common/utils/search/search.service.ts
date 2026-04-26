import { Injectable, } from "@nestjs/common";
import * as cheerio from "cheerio";
import { GoogleSearchResponse, SearchResult } from "./interfaces/search.interface";
import axios, { AxiosInstance} from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SearchService {
    private searchClient: AxiosInstance;
    constructor(private readonly configService: ConfigService) {

        const GOOGLE_SEARCH_CSE_API_KEY = this.configService.getOrThrow<string>("GOOGLE_APIKEY"); //process.env.GOOGLE_APIKEY;
        const GOOGLE_SEARCH_CSE_CX = this.configService.getOrThrow<string>("GOOGLE_CX"); //process.env.GOOGLE_CX;

        this.searchClient = axios.create({
            baseURL: `https://www.googleapis.com/customsearch`,
            headers: {
                "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)"
            },
            params: {
                cx: GOOGLE_SEARCH_CSE_CX,
                key: GOOGLE_SEARCH_CSE_API_KEY
            },
            timeout: 5000
        });
    }

    async search(query: string): Promise<GoogleSearchResponse> {
        const response = await this.searchClient.get("/v1", {
            params: { q: query },
        });
        const data = response.data as GoogleSearchResponse;

        if (data.items && Array.isArray(data.items)) {
            const enhancedResults = await Promise.all(
                data.items.slice(0, 5).map(async (item: SearchResult) => { 
                    try {
                        const textContent = await this.extractTextFromUrl(item.link);
                        return {
                            ...item,
                            textContent
                        };
                    } catch (error) {
                        return {
                            ...item,
                            error: `Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`
                        };
                    }
                })
            );

            data.items = enhancedResults;
        }

        return data;
    }


    async extractTextFromUrl(url: string): Promise<string> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000); 

            const response = await fetch(url, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            $('script, style, nav, footer, header, aside, .advertisement, .ads, .sidebar').remove();

            let text = '';
            const contentSelectors = ['main', 'article', '.content', '#content', '.post', '.entry'];

            for (const selector of contentSelectors) {
                const content = $(selector).text();
                if (content && content.length > text.length) {
                    text = content;
                }
            }

            if (!text || text.length < 100) {
                text = $('body').text();
            }

            return text
                .replace(/\s+/g, ' ') 
                .replace(/\n\s*\n/g, '\n')
                .trim()
                .substring(0, 5000); 

        } catch (error) {
            console.error(`Error fetching content from ${url}:`, error);
            return `Error fetching content: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}


