import {LoadingSpinner} from "@/components/LoadingSpinner";
import {ErrorAlert} from "@/components/ErrorAlert";

export const DataStateWrapper = ({isLoading, error, children
}: {
    isLoading: boolean;
    error: string | null;
    children: React.ReactNode;
}) => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;
    return <>{children}</>;
};