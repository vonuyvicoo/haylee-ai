export interface SearchResult {
    title: string;
    link: string;
    snippet: string;
    textContent?: string;
    error?: string;
}

export interface GoogleSearchResponse {
    items?: SearchResult[];
    [key: string]: any;
}

