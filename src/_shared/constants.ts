// Meta Ads — valid billing events per optimization goal (buying_type=AUCTION)
// Source: https://developers.facebook.com/docs/marketing-api/bidding/billing-events
export const GOAL_TO_BILLING: Record<string, string[]> = {
    APP_INSTALLS:                       ['IMPRESSIONS'],
    AD_RECALL_LIFT:                     ['IMPRESSIONS'],
    ENGAGED_USERS:                      ['IMPRESSIONS'],
    EVENT_RESPONSES:                    ['IMPRESSIONS'],
    IMPRESSIONS:                        ['IMPRESSIONS'],
    LEAD_GENERATION:                    ['IMPRESSIONS'],
    LINK_CLICKS:                        ['LINK_CLICKS', 'IMPRESSIONS'],
    OFFSITE_CONVERSIONS:                ['IMPRESSIONS'],
    PAGE_LIKES:                         ['IMPRESSIONS'],
    POST_ENGAGEMENT:                    ['IMPRESSIONS'],
    REACH:                              ['IMPRESSIONS'],
    THRUPLAY:                           ['IMPRESSIONS', 'THRUPLAY'],
    TWO_SECOND_CONTINUOUS_VIDEO_VIEWS:  ['IMPRESSIONS', 'TWO_SECOND_CONTINUOUS_VIDEO_VIEWS'],
    VALUE:                              ['IMPRESSIONS'],
    LANDING_PAGE_VIEWS:                 ['IMPRESSIONS'],
};

export const INVOICE_SUCCEEDED = 'invoice.paid';
export const INVOICE_FAILED = 'invoice.failed';
export const INVOICE_SCHEDULED = 'invoice.scheduled';
export const INVOICE_RETRYING = 'invoice.retrying';


export const HAYLEE_TOOL_TOKEN = "HAYLEE_TOOL";
export const MAIN_LLM_TOKEN = "MAIN_LLM";
export const HAYLEE_SUBAGENT_TOKEN = "HAYLEE_SUBAGENT";
