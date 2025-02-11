import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { formatDay, formatHour } from "@/utils/date";
import {
  HourlyPackData,
  HourlyPICMetric,
  PackDistribution,
  ProductivityMetric,
  RejectRatio,
} from "@/types/records";

export const usePackingData = () => {
  const [hourlyPICData, setHourlyPICData] = useState<HourlyPICMetric[]>([]);
  const [hourlyPackData, setHourlyPackData] = useState<HourlyPackData[]>([]);
  const [productivityData, setProductivityData] = useState<
    ProductivityMetric[]
  >([]);
  const [dailyProductivityData, setDailyProductivityData] = useState<
    ProductivityMetric[]
  >([]);
  const [rejectRatios, setRejectRatios] = useState<RejectRatio[]>([]);
  const [dailyRejectRatios, setDailyRejectRatios] = useState<RejectRatio[]>([]);
  const [packDistribution, setPackDistribution] = useState<PackDistribution[]>(
    [],
  );
  const [dailyPackDistribution, setDailyPackDistribution] = useState<
    PackDistribution[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        hourlyPIC,
        hourlyPackData,
        productivity,
        dailyProductivity,
        rejectRatiosData,
        dailyRejectRatiosData,
        distribution,
        dailyDistribution,
      ] = await Promise.all([
        apiService.getHourlyPICMetrics(),
        apiService.getHourlyPackData(),
        apiService.getProductivity(),
        apiService.getDailyProductivity(),
        apiService.getHourlyRejectRatios(),
        apiService.getDailyRejectRatios(),
        apiService.getHourlyDistribution(),
        apiService.getDailyDistribution(),
      ]);

      setHourlyPICData(
        hourlyPIC.map((item) => ({
          ...item,
        })),
      );

      setHourlyPackData(
        hourlyPackData.map((item) => ({
          ...item,
        })),
      );

      setProductivityData(
        productivity.map((item) => ({
          ...item,
        })),
      );

      setDailyProductivityData(
        dailyProductivity.map((item) => ({
          ...item,
        })),
      );
      setRejectRatios(
        rejectRatiosData.map((item) => ({
          ...item,
        })),
      );

      setDailyRejectRatios(
        dailyRejectRatiosData.map((item) => ({
          ...item,
        })),
      );

      setPackDistribution(
        distribution.map((item) => ({
          ...item,
        })),
      );

      setDailyPackDistribution(
        dailyDistribution.map((item) => ({
          ...item,
        })),
      );
    } catch (error) {
      setError("Failed to fetch dashboard data. Please try again later.");
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    hourlyPICData,
    hourlyPackData,
    productivityData,
    dailyProductivityData,
    rejectRatios,
    dailyRejectRatios,
    packDistribution,
    dailyPackDistribution,
    isLoading,
    error,
    refreshData: fetchData,
  };
};
