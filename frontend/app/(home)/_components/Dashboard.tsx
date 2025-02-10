import React from "react";
import {DataStateWrapper} from "@/components/DataStateWrapper";
import {ChartCard} from "@/app/(home)/_components/charts/ChartCard";
import {HourlyPerformanceChart} from "@/app/(home)/_components/charts/HourlyPerformanceChart";
import ProductivityChart from "@/app/(home)/_components/charts/ProductivityChart";
import {usePackingData} from "@/hooks/usePackingData";

const Dashboard = () => {
    const {
        hourlyPICData,
        productivityData,
        rejectRatios,
        packDistribution,
        isLoading,
        error,
        refreshData
    } = usePackingData();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <DataStateWrapper isLoading={isLoading} error={error}>
                <ChartCard
                    title="Hourly PIC Performance"
                    onRefresh={refreshData}
                    className="col-span-1 md:col-span-2"
                >
                    <HourlyPerformanceChart data={hourlyPICData}/>
                </ChartCard>
            </DataStateWrapper>
        </div>
    );
};

export default Dashboard;