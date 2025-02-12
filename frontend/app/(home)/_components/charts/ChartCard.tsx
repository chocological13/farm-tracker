import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    onRefresh?: () => void;
    className?: string;
}

export const ChartCard = ({ title, children, onRefresh, className }: ChartCardProps) => (
    <Card className={`bg-stone-50/50 border-stone-200 ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-rose-800/90">{title}</CardTitle>
            {onRefresh && (
                <button
                    onClick={onRefresh}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                    title="Refresh data"
                >
                    <RefreshCcw className="h-4 w-4 text-rose-600/80" />
                </button>
            )}
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);