import { IApexChart } from "@interfaces/IApexChart";

export interface IChartResponse {
  title: string;
  type: string;
  keyLabel?: string;
  percentageOf?: string;
  colors?: string[];
  description?: string;
  chart: IApexChart
}
