import { IsEnum, IsOptional, IsString, ValidateIf } from "class-validator";

export enum CallToActionType {
    LEARN_MORE = "LEARN_MORE",
    SHOP_NOW = "SHOP_NOW",
    SIGN_UP = "SIGN_UP",
    BOOK_TRAVEL = "BOOK_TRAVEL",
    CONTACT_US = "CONTACT_US",
    DOWNLOAD = "DOWNLOAD",
    GET_OFFER = "GET_OFFER",
    GET_QUOTE = "GET_QUOTE",
    SUBSCRIBE = "SUBSCRIBE",
    WATCH_MORE = "WATCH_MORE",
    NO_BUTTON = "NO_BUTTON",
    APPLY_NOW = "APPLY_NOW",
    BUY_NOW = "BUY_NOW",
    GET_DIRECTIONS = "GET_DIRECTIONS",
    MESSAGE_PAGE = "MESSAGE_PAGE",
    CALL_NOW = "CALL_NOW",
}

export class CreateAdCreativeDto {
    @IsString()
    name: string;

    @IsString()
    page_id: string;

    @IsString()
    @IsOptional()
    message?: string;

    @IsString()
    @IsOptional()
    headline?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    link_url?: string;

    // Image source — use one of: picture (external URL) or image_hash (uploaded)
    @IsString()
    @IsOptional()
    picture?: string;

    @IsString()
    @IsOptional()
    image_hash?: string;

    // Video creative
    @IsString()
    @IsOptional()
    video_id?: string;

    @IsEnum(CallToActionType)
    @IsOptional()
    call_to_action_type?: CallToActionType;

    @IsString()
    @IsOptional()
    instagram_actor_id?: string;
}

export class QueryAdCreativeDto {
    @IsString()
    ad_account_id: string;

    @IsString()
    @IsOptional()
    after?: string;
}
