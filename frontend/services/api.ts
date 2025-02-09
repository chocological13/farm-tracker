import axios from "axios";
import {HourlyPICMetric, PackDistribution, PackingRecord, ProductivityMetric, RejectRatio} from "@/types/records";
import logger from "@/utils/logger";

const api = axios.create({
    baseURL: 'api/v1',
})

export const apiService = {
    createRecord: async (record: PackingRecord) => {
        try {
            const response = await api.post('/records', record);
            logger.info("Successfully added a new record");
            return response.data;
        } catch (error: any) {
            logger.error("Failed to input record", {error, record});
            throw error;
        }
    },

    getHourlyPICMetrics: async (): Promise<HourlyPICMetric[]> => {
        try {
            const response = await api.get('/records/hourly-pic');
            return response.data.metrics;
        } catch (error: any) {
            logger.error("Failed to fetch metrics", {error});
            throw error;
        }
    },

    getHourlyPackData: async () => {
        try {
            const response = await api.get('recors/hourly-pack-data');
            return response.data.metrics;
        } catch (error: any) {
            logger.error("Failed to fetch metrics", {error})
            throw error
        }
    },

    getProductivity: async (): Promise<ProductivityMetric[]> => {
        try {
            const response = await api.get('/records/productivity');
            return response.data.metrics;
        } catch (error: any) {
            logger.error("Failed to fetch metrics", {error})
            throw error
        }
    },

    getHourlyRejectRatios: async (): Promise<RejectRatio[]> => {
        try {
            const response = await api.get('records/reject-ratios/hourly');
            return response.data.metrics;
        } catch (error: any) {
            logger.error("Failed to fetch metrics", {error})
            throw error
        }
    },

    getDailyRejectRatios: async (): Promise<RejectRatio[]> => {
        try {
            const response = await api.get('records/reject-ratios/daily');
            return response.data.metrics;
        } catch (error: any) {
            logger.error("Failed to fetch metrics", {error})
            throw error
        }
    },

    getHourlyDistribution: async (): Promise<PackDistribution[]> => {
        try {
            const response = await api.get('records/distributions/hourly');
            return response.data.metrics;
        } catch (error: any) {
            logger.error("Failed to fetch metrics", {error})
            throw error
        }
    },

    getDailyDistribution: async (): Promise<PackDistribution[]> => {
        try {
            const response = await api.get('records/distributions/daily');
            return response.data.metrics;
        } catch (error: any) {
            logger.error("Failed to fetch metrics", {error})
            throw error
        }
    },
}

