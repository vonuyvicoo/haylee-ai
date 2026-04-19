import { Injectable } from "@nestjs/common";
import { MetaCredentialService } from "../credentials/credential.service";
import { UserSession } from "@thallesp/nestjs-better-auth";
import { FacebookAdsApi } from "facebook-nodejs-business-sdk";
import { FindManyAdsLibraryDto } from "./dto/find-many-ads-library.dto";

@Injectable()
export class AdLibraryService {
    constructor(
        private readonly creds: MetaCredentialService
    ) {}

    async findMany(query: FindManyAdsLibraryDto, session: UserSession) {
        const token = await this.creds.getToken(session);
        const api = new FacebookAdsApi(token);
        const ads = await api.call("GET", ['ads_archive'], {
            ...query,
            //search_page_ids: [''],
        });
        console.log(ads);
    }

}
