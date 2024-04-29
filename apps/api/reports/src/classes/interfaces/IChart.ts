export interface IChart {
  title: string;
  description?: string;
  type?: string;
  keyLabel?: string;
  percentageOf?: string;
  colors?: string[]
  index?: number;
  strategyKey: string;
}
