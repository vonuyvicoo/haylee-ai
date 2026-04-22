import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface SupabaseStorageResponse {
    data: {
        folders: { name: string; key?: string }[];
        objects: {
            id: string;
            name: string;
            created_at: string;
            updated_at: string;
            last_accessed_at: string;
            key?: string;
            metadata: {
                mimetype: string;
                size: number;
                [key: string]: any;
            } | null;
        }[];
        nextCursor?: string;
    };
    error: null;
}

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient; 
    private bucket: string;
    constructor(){
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
        const supabaseBucket = process.env.SUPABASE_BUCKET_NAME;

        if(!supabaseUrl || !supabaseKey || !supabaseBucket) throw new InternalServerErrorException("Invalid supabase credentials.");
        this.bucket = supabaseBucket;
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    
    /**
    * @param file_name - With extension
    */
    async upload(file_name: string, file_body: Buffer | Blob, contentType?: string) {
        const response = await this.supabase.storage.from(this.bucket).upload(file_name, file_body, {
            contentType,
            upsert: true
        });
        if(response.error) {
            throw new BadRequestException(response.error.message || "Something went wrong uploading the file.")
        }
        return response;
    }

    async getUrl(path: string) {
        const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(path);
        return data.publicUrl;
    }

    async download(path: string) {
        const { data, error } = await this.supabase.storage.from(this.bucket).download(path);
        if (error) throw new BadRequestException(error.message);
        return data;
    }

    async delete(file_names: string[]) {
        const response = await this.supabase.storage.from(this.bucket).remove(file_names);
        if(response.error) {
            throw new BadRequestException("Something went wrong deleting the file.");
        }
        return {
            message: "Deleted successfully"
        };
    }

    async findMany(options?: { cursor?: string, limit?: number }) {
        const response = await this.supabase.storage.from(this.bucket).listV2({
            cursor: options?.cursor,
            limit: options?.limit
        });
        if(response.error) {
            throw new BadRequestException("Error listing files.")
        }

        return response as unknown as SupabaseStorageResponse;
    }
}
