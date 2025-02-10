import React from "react";
import { DataStateWrapper } from "@/components/DataStateWrapper";
import { ChartCard } from "@/app/(home)/_components/charts/ChartCard";
import { usePackingData } from "@/hooks/usePackingData";
import { HourlyPackTypeChart } from "@/app/(home)/_components/charts/HourlyPackChart";
import { RejectRatioChart } from "@/app/(home)/_components/charts/RejectRatioChart";
import HourlyPerformanceChart from "@/app/(home)/_components/charts/HourlyPerformanceChart";
import { PackDistributionChart } from "@/app/(home)/_components/charts/PackDistributionChart";
import ProductivityChart from "@/app/(home)/_components/charts/ProductivityChart";

const Dashboard = () => {
  const {
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
    refreshData,
  } = usePackingData();

  return (
    <DataStateWrapper isLoading={isLoading} error={error}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <ChartCard
          title="Hourly Packs Per PIC"
          onRefresh={refreshData}
          className="col-span-1 md:col-span-2"
        >
          <HourlyPerformanceChart data={hourlyPICData} />
        </ChartCard>
        <ChartCard
          title="Hourly Pack Distribution Data"
          onRefresh={refreshData}
          className="col-span-1 md:col-span-2"
        >
          <HourlyPackTypeChart data={hourlyPackData} />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <ChartCard
          title="PIC Productivity (Packs Per Minute)"
          onRefresh={refreshData}
          className="col-span-1 md:col-span-2"
        >
          <ProductivityChart data={productivityData} hourly={true} />
        </ChartCard>
        <ChartCard
          title="PIC Productivity (Daily Average)"
          onRefresh={refreshData}
          className="col-span-1 md:col-span-2"
        >
          <ProductivityChart data={dailyProductivityData} hourly={false} />
        </ChartCard>
        <ChartCard
          title="Hourly Reject Ratio Chart"
          onRefresh={refreshData}
          className="col-span-1 md:col-span-2"
        >
          <RejectRatioChart data={rejectRatios} day={false} />
        </ChartCard>
        <ChartCard
          title="Daily Reject Ratio Chart"
          onRefresh={refreshData}
          className="col-span-1 md:col-span-2"
        >
          <RejectRatioChart data={dailyRejectRatios} day={true} />
        </ChartCard>
        <ChartCard
          title="Hourly Pack Distribution"
          onRefresh={refreshData}
          className="col-span-1 md:col-span-2"
        >
          <PackDistributionChart data={packDistribution} day={false} />
        </ChartCard>
        <ChartCard
          title="Daily Pack Distribution"
          onRefresh={refreshData}
          className="col-span-1 md:col-span-2"
        >
          <PackDistributionChart data={dailyPackDistribution} day={true} />
        </ChartCard>
      </div>
    </DataStateWrapper>
  );
};

export default Dashboard;
