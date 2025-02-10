import { useState, useEffect } from 'react';
import {apiService} from "@/services/api";
import {formatHour} from "@/utils/date";
import {HourlyPackData, HourlyPICMetric, PackDistribution, ProductivityMetric, RejectRatio} from "@/types/records";

export const usePackingData = () => {
    const [hourlyPICData, setHourlyPICData] = useState<HourlyPICMetric[]>([]);
    const [hourlyPackData, setHourlyPackData] = useState<HourlyPackData[]>([]);
    const [productivityData, setProductivityData] = useState<ProductivityMetric[]>([]);
    const [rejectRatios, setRejectRatios] = useState<RejectRatio[]>([]);
    const [packDistribution, setPackDistribution] = useState<PackDistribution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [hourlyPIC, hourlyPackData, productivity, rejectRatiosData, distribution] = await Promise.all([
                apiService.getHourlyPICMetrics(),
                apiService.getHourlyPackData(),
                apiService.getProductivity(),
                apiService.getHourlyRejectRatios(),
                apiService.getDailyDistribution(),
            ]);

            setHourlyPICData(hourlyPIC.map(item => ({
                ...item,
                hour: formatHour(item.hour)
            })));

            setHourlyPackData(hourlyPackData.map(item => ({
                ...item,
                hour: formatHour(item.hour)
            })));
            setRejectRatios(rejectRatiosData.map(item => ({
                ...item,
                hour: item.hour ? formatHour(item.hour) : undefined
            })));

            setPackDistribution(distribution);
        } catch (error) {
            setError('Failed to fetch dashboard data. Please try again later.');
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        hourlyPICData,
        productivityData,
        rejectRatios,
        packDistribution,
        isLoading,
        error,
        refreshData: fetchData
    };
};