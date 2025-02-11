export const labelFormat = ({ _, payload }: { _: any; payload: any }) => {
  if (payload && payload.length > 0) {
    const dataPoint = payload[0].payload;
    return `${dataPoint.dateDisplay}, ${dataPoint.hourDisplay}`;
  }
  return "";
};
