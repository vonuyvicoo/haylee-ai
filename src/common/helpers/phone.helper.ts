export interface ParsedZenotiPhone {
    country_id: number;
    number: string;
}

const COUNTRY_MAP: Record<string, { phone: string, id: number }> = {
    "US": { phone: "+1", id: 225 },
    "PH": { phone: "+63", id: 174 },
};

export function parsePhone(input: string, defaultCountry: keyof typeof COUNTRY_MAP = "US"): ParsedZenotiPhone {
    let cleaned = input.replace(/[^\d+]/g, ""); 

    if (cleaned.startsWith("+")) {
        for (const key in COUNTRY_MAP) {
            const c = COUNTRY_MAP[key];
            if (cleaned.startsWith(c.phone)) {
                const remaining = cleaned.replace(c.phone, "");
                return {
                    country_id: c.id,
                    number: remaining
                };
            }
        }
    }

    if (/^09\d{9}$/.test(cleaned)) {
        const c = COUNTRY_MAP["PH"];
        return {
            country_id: c.id,
            number: cleaned.slice(1) // strip leading 0
        };
    }

    const fallback = COUNTRY_MAP[defaultCountry];
    return {
        country_id: fallback.id,
        number: cleaned.replace(/^0+/, "") // remove leading zeros
    };
}

