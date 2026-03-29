export type GraphEdgeResponse<T> = {
    data: T[];
    paging?: { next?: string; previous?: string };
};

export type AdAccountBase = {
    id: string;
    name?: string;
}

export type AdSetBase = {

}
