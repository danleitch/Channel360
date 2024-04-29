import { IApexChart } from "@interfaces/IApexChart";
import { DateTimeValue } from "types/DateTimeValue";

export interface IChartStrategy {
  buildChart(params: {
    orgId?: string;
    startDate?: DateTimeValue;
    endDate?: DateTimeValue;
  }): Promise<IApexChart>;
}
