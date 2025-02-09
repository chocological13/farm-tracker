import { format, parseISO } from 'date-fns';

export const formatDateTime = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM dd, yyyy HH:mm');
    } catch (error) {
        return dateString;
    }
};

export const formatHour = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        return format(date, 'HH:mm');
    } catch (error) {
        return dateString;
    }
};

export const formatDay = (dateString: string): string => {
    try {
        const date = parseISO(dateString);
        return format(date, 'MMM dd, yyyy');
    } catch (error) {
        return dateString;
    }
};

export const getCurrentDateTime = (): string => {
    return new Date().toISOString();
};