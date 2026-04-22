export type Interest = {
    id: string;
    name: string;
    type: string;
    path: string[];
    description: string;
    real_time_cluster: boolean;
    audience_size_lower_bound: number;
    audience_size_upper_bound: number;
}
