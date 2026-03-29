import { SubscriptionCycleStatus, SubscriptionPlanStatus, SubscriptionType } from "prisma/generated/prisma";

import Stripe from "stripe";

export const INVOICE_SUCCEEDED = 'invoice.paid';
export const INVOICE_FAILED = 'invoice.failed';
export const INVOICE_SCHEDULED = 'invoice.scheduled';
export const INVOICE_RETRYING = 'invoice.retrying';

