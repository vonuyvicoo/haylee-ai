import { StructuredTool, tool } from "langchain";
import { RunnableConfig } from "@langchain/core/runnables";
import z from "zod";
import { Injectable } from "@nestjs/common";
import { HayleeTool } from "@modules/agent/common";
import * as cheerio from "cheerio";

export const FetchURLSchema = z.object({
    url: z.string()
});

export type FetchURLParams = z.infer<typeof FetchURLSchema>;

@Injectable()
export class FetchURLTool extends HayleeTool {
    constructor(){
        super();
    }

    getStructuredTool(): StructuredTool {
        return tool(
            async (params: FetchURLParams, _config: RunnableConfig) => {
                const response = await fetch(params.url);

                if (!response.ok) {
                    return `Failed to fetch URL: HTTP ${response.status} ${response.statusText}`;
                }

                const html = await response.text();
                const $ = cheerio.load(html);

                $('script, style, nav, footer, header, aside, noscript, iframe, svg').remove();

                const title = $('title').text().trim();

                let content = '';
                for (const selector of ['main', 'article', '.content', '#content', '.post', 'body']) {
                    const text = $(selector).text();
                    if (text && text.length > content.length) {
                        content = text;
                    }
                }

                const cleaned = content
                    .replace(/\s+/g, ' ')
                    .trim()
                    .substring(0, 8000);

                return `Title: ${title}\n\n${cleaned}`;
            },
            {
                name: 'fetch_url',
                description: "Fetches the text content of a URL, stripping HTML, scripts, and styles. Use this to read a specific page in full.",
                schema: FetchURLSchema
            }
        );
    }
} 



