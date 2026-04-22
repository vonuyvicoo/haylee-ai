import { SetMetadata } from "@nestjs/common";

export const ALLOW_MULTIPART = "allow_multipart";
export const AllowMultipart = () => SetMetadata(ALLOW_MULTIPART, true);
