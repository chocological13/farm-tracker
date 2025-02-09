import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

export const ErrorAlert = ({title = 'Error', message}: {
    title?: string;
    message: string;
}) => (
    <Alert variant="destructive" className="mb-4">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
    </Alert>
);