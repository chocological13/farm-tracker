export interface PackingRecord {
    datetime: string;
    pic: string;
    gross_wight: number;
    pack_a_qty: number;
    pack_b_qty: number;
    pack_c_qty: number;
    reject_weight: number;
}

export interface HourlyPICMetric {
    hour: string;
    pic: string;
    gross_weight: number;
    total_packs: number;
}

export interface HourlyPackData {
    hour: string;
    pack_a_total: number;
    pack_b_total: number;
    pack_c_total: number;
    pack_a_weight: number;
    pack_b_weight: number;
    pack_c_weight: number;
}

export interface ProductivityMetric {
    pic: string;
    packs_per_minute: number;
    daily_average: number;
}

export interface RejectRatio {
    hour?: string;
    day?: string;
    hourly_reject_ratio?: number;
    daily_reject_ratio?: number;
}

export interface PackDistribution {
    hour?: string;
    day?: string;
    pack_a_ratio: number;
    pack_b_ratio: number;
    pack_c_ratio: number;
    total_packs: number;
}