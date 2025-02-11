import { format, parseISO } from "date-fns";

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy HH:mm");
  } catch (error) {
    return dateString;
  }
};

export const formatHour = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "HH:mm");
  } catch (error) {
    return dateString;
  }
};

export const formatDay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

export const groupDataByDate = (data: any[]) => {
  const groups: { [key: string]: string[] } = {};
  data.forEach((item) => {
    const date = formatDay(item.hour);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item.hour);
  });
  return groups;
};

export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};
