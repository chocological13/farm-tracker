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
          hour: formatHour(item.hour),
        })),
      );

      setHourlyPackData(
        hourlyPackData.map((item) => ({
          ...item,
          hour: formatHour(item.hour),
        })),
      );

      setProductivityData(
        productivity.map((item) => ({
          ...item,
          hour: item.hour ? formatHour(item.hour) : undefined,
        })),
      );

      setDailyProductivityData(
        dailyProductivity.map((item) => ({
          ...item,
          day: item.day ? formatHour(item.day) : undefined,
        })),
      );
      setRejectRatios(
        rejectRatiosData.map((item) => ({
          ...item,
          hour: item.hour ? formatHour(item.hour) : undefined,
        })),
      );

      setDailyRejectRatios(
        dailyRejectRatiosData.map((item) => ({
          ...item,
          day: item.day ? formatDay(item.day) : undefined,
        })),
      );
      setPackDistribution(
        distribution.map((item) => ({
          ...item,
          hour: item.hour ? formatHour(item.hour) : undefined,
        })),
      );

      setDailyPackDistribution(
        dailyDistribution.map((item) => ({
          ...item,
          day: item.day ? formatHour(item.day) : undefined,
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
