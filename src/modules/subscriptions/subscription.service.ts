import { UserService } from "@modules/user/user.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@core/prisma/prisma.service";

export type PlanMetadata = {
    name: string;
    email: string;
    owner_id: string;
    course_id: string;
    enrollment_id: string;
}

@Injectable()
export class SubscriptionService {
    constructor(
        private readonly userService: UserService,
        private readonly prisma: PrismaService
    ) {}
}
