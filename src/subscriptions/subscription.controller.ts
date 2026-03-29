import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { AuthGuard, Session, UserSession } from "@thallesp/nestjs-better-auth";
import { RequireAdminGuard } from "src/guards/require-admin.guard";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";

@Controller('subscriptions')
export class SubscriptionController {
    constructor(
        private readonly subscriptionService: SubscriptionService
    ) {}

  }
