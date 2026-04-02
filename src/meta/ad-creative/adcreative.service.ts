import { BadRequestException, Injectable } from "@nestjs/common";
import { AdAccount, AdCreative, FacebookAdsApi } from "facebook-nodejs-business-sdk";
import FormData from "form-data";
import axios from "axios";
import { MetaCredentialService } from "../credentials/credential.service";
import { CreateAdCreativeDto, QueryAdCreativeDto } from "./dto/create-adcreative.dto";
import { UpdateAdCreativeDto } from "./dto/update-adcreative.dto";

const META_API_VERSION = "v23.0";

@Injectable()
export class AdCreativeService {
    constructor(private readonly creds: MetaCredentialService) {}

    async findMany(query: QueryAdCreativeDto) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const adAccount = new AdAccount(query.ad_account_id, {}, null, api);

        const fields = [
            AdCreative.Fields.id,
            AdCreative.Fields.name,
            AdCreative.Fields.title,
            AdCreative.Fields.body,
            AdCreative.Fields.image_url,
            AdCreative.Fields.video_id,
            AdCreative.Fields.call_to_action_type,
            AdCreative.Fields.object_story_spec,
            AdCreative.Fields.thumbnail_url,
            AdCreative.Fields.status,
            AdCreative.Fields.effective_object_story_id,
        ];

        const params = {
            limit: 10,
            ...(query.after ? { after: query.after } : {}),
        };

        const creatives = await adAccount.getAdCreatives(fields, params);
        const data = creatives.map(c => c.exportData());
        const hasNext = creatives.hasNext();
        const hasPrev = creatives.hasPrevious();
        const paging_cursors = {
            before: hasPrev ? creatives.paging.cursors.before : null,
            after: hasNext ? creatives.paging.cursors.after : null,
        };

        return { data, paging_cursors };
    }

    async create(payload: CreateAdCreativeDto, query: QueryAdCreativeDto) {
        if (payload.picture && payload.image_hash) {
            throw new BadRequestException("Cannot use both picture and image_hash. Choose one.");
        }
        if (!payload.picture && !payload.image_hash && !payload.video_id) {
            throw new BadRequestException("Either picture, image_hash, or video_id must be provided.");
        }

        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const adAccount = new AdAccount(query.ad_account_id, {}, null, api);

        const object_story_spec: Record<string, any> = {
            page_id: payload.page_id,
        };

        if (payload.video_id) {
            object_story_spec.video_data = {
                video_id: payload.video_id,
                ...(payload.message ? { message: payload.message } : {}),
                ...(payload.headline ? { title: payload.headline } : {}),
                ...(payload.call_to_action_type ? {
                    call_to_action: {
                        type: payload.call_to_action_type,
                        value: { link: payload.link_url, link_format: "WEBSITE_LINK" },
                    }
                } : {}),
            };
        } else {
            object_story_spec.link_data = {
                ...(payload.picture ? { picture: payload.picture } : {}),
                ...(payload.image_hash ? { image_hash: payload.image_hash } : {}),
                ...(payload.link_url ? { link: payload.link_url } : {}),
                ...(payload.message ? { message: payload.message } : {}),
                ...(payload.headline ? { name: payload.headline } : {}),
                ...(payload.description ? { description: payload.description } : {}),
                ...(payload.call_to_action_type ? {
                    call_to_action: {
                        type: payload.call_to_action_type,
                        value: { link: payload.link_url, link_format: "WEBSITE_LINK" },
                    }
                } : {}),
            };
        }

        if (payload.instagram_actor_id) {
            object_story_spec.instagram_actor_id = payload.instagram_actor_id;
        }

        const creative = await adAccount.createAdCreative([], {
            [AdCreative.Fields.name]: payload.name,
            object_story_spec,
        });

        return creative;
    }

    async update(id: string, payload: UpdateAdCreativeDto) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const creative = new AdCreative(id, {}, null, api);
        const updated = await creative.update([], {
            ...(payload.name ? { [AdCreative.Fields.name]: payload.name } : {}),
            ...(payload.status ? { [AdCreative.Fields.status]: payload.status } : {}),
        });
        return updated;
    }

    async delete(id: string) {
        const token = await this.creds.getToken();
        const api = new FacebookAdsApi(token);
        const creative = new AdCreative(id, {}, null, api);
        await creative.delete([]);
        return { message: "Deleted successfully." };
    }

    async uploadImage(ad_account_id: string, file: Express.Multer.File) {
        const token = await this.creds.getToken();

        const form = new FormData();
        form.append("filename", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        form.append("access_token", token);

        const response = await axios.post<{ images: Record<string, { hash: string; url: string }> }>(
            `https://graph.facebook.com/${META_API_VERSION}/${ad_account_id}/adimages`,
            form,
            { headers: form.getHeaders() }
        );

        const images = response.data.images;
        const [imageResult] = Object.values(images);

        return {
            hash: imageResult.hash,
            url: imageResult.url,
            name: file.originalname,
        };
    }
}
