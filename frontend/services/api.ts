import axios from "axios";
import {
  HourlyPackData,
  HourlyPICMetric,
  PackDistribution,
  PackingRecord,
  ProductivityMetric,
  RejectRatio,
} from "@/types/records";
import logger from "@/utils/logger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL + `/api/v1/records`,
});

export const apiService = {
  createRecord: async (record: PackingRecord): Promise<PackingRecord> => {
    try {
      const response = await api.post("", record);
      logger.info("Successfully added a new record");
      return response.data;
    } catch (error: any) {
      logger.error("Failed to input record", { error, record });
      throw error;
    }
  },

  getHourlyPICMetrics: async (): Promise<HourlyPICMetric[]> => {
    try {
      const response = await api.get("/metrics/pic/hourly");
      return response.data.metrics;
    } catch (error: any) {
      logger.error("Failed to fetch metrics", { error });
      throw error;
    }
  },

  getHourlyPackData: async (): Promise<HourlyPackData[]> => {
    try {
      const response = await api.get("/metrics/packs/hourly");
      return response.data.metrics;
    } catch (error: any) {
      logger.error("Failed to fetch metrics", { error });
      throw error;
    }
  },

  getProductivity: async (): Promise<ProductivityMetric[]> => {
    try {
      const response = await api.get("/metrics/pic/productivity/hourly");
      return response.data.metrics;
    } catch (error: any) {
      logger.error("Failed to fetch metrics", { error });
      throw error;
    }
  },

  getDailyProductivity: async (): Promise<ProductivityMetric[]> => {
    try {
      const response = await api.get("/metrics/pic/productivity/daily");
      return response.data.metrics;
    } catch (error: any) {
      logger.error("Failed to fetch metrics", { error });
      throw error;
    }
  },

  getHourlyRejectRatios: async (): Promise<RejectRatio[]> => {
    try {
      const response = await api.get("/metrics/rejects/hourly");
      return response.data.metrics;
    } catch (error: any) {
      logger.error("Failed to fetch metrics", { error });
      throw error;
    }
  },

  getDailyRejectRatios: async (): Promise<RejectRatio[]> => {
    try {
      const response = await api.get("/metrics/rejects/daily");
      return response.data.metrics;
    } catch (error: any) {
      logger.error("Failed to fetch metrics", { error });
      throw error;
    }
  },

  getHourlyDistribution: async (): Promise<PackDistribution[]> => {
    try {
      const response = await api.get("/metrics/packs/distribution/hourly");
      return response.data.metrics;
    } catch (error: any) {
      logger.error("Failed to fetch metrics", { error });
      throw error;
    }
  },

  getDailyDistribution: async (): Promise<PackDistribution[]> => {
    try {
      const response = await api.get("/metrics/packs/distribution/daily");
      return response.data.metrics;
    } catch (error: any) {
      logger.error("Failed to fetch metrics", { error });
      throw error;
    }
  },
};
