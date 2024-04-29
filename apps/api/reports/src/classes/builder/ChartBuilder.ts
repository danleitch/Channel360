export class ChartBuilder {
  private chart: any = {};

  constructor(title: string, type: string) {
    this.chart.title = title;
    this.chart.type = type;
    this.chart.chart = {}; // Initialize the chart property
  }

  setDescription(description?: string) {
    if (description !== undefined) {
      this.chart.description = description;
    }
    return this; // Return the builder for chaining
  }

  setKeyLabel(keyLabel?: string) {
    if (keyLabel !== undefined) {
      this.chart.keyLabel = keyLabel;
    }
    return this;
  }

  setPercentageOf(percentageOf?: number) {
    if (percentageOf !== undefined) {
      this.chart.percentageOf = percentageOf;
    }
    return this;
  }

  setColors(colors?: string[]) {
    // check if colors is undefined or null or empty array

    if (colors !== undefined && colors.length > 0) {
      this.chart.chart.colors = colors;
    }
    return this;
  }

  setChartData(chartData: any) {
    this.chart.chart = { ...this.chart.chart, ...chartData };
    return this;
  }

  build() {
    return this.chart;
  }
}
