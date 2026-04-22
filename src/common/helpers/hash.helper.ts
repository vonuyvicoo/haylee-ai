import { createHash } from "crypto";

export function generateIdempotencyHash(text: string){
    return createHash('md5').update(text).digest('hex');
}
