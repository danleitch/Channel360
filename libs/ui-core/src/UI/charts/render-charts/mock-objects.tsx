export const DonutChartObject = {
  type: "DonutChart",
  percentageOf: "Read",
  title: "Read/Unread",
  keyLabel: "Messages",
  chart: {
    series: [
      { label: "Read", value: 20 },
      { label: "Unread", value: 66 },
    ],
  },
};

export const PieChartObject = {
  type: "PieChart",
  title: "Notification Categories",
  chart: {
    series: [
      { label: "Marketing", value: 5 },
      {
        label: "Authentication",
        value: 10,
      },
      {
        label: "Utility",
        value: 10,
      },
    ],
  },
};

export const ColumnChartObject = {
  type: "ColumnChart",
  title: "Message Stats",
  chart: {
    categories: [
      "Readrerterteryareaergaegreagaegaegraergsaergareraegaergadfgaergarfd",
      "Delivered",
      "Delivered To Channel",
      "Failed",
      "Pending",
    ],

    series: [
      {
        name: "Messages",
        data: [5, 4, 3, 2, 1],
      },
    ],
  },
};

export const LineChartObject = {
  type: "LineChart",
  title: "Message Performance",
  chart: {
    categories: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    series: [
      {
        name: "Read",
        data: [10, 41, 35, 51, 49, 62, 69],
      },
      {
        name: "Delivered",
        data: [10, 34, 13, 56, 77, 88, 99],
      },
      {
        name: "Delivered To Channel",
        data: [10, 23, 33, 86, 27, 84, 69],
      },
      {
        name: "Failed",
        data: [3, 25, 76, 23, 87, 12, 2],
      },
      {
        name: "Pending",
        data: [89, 34, 23, 56, 67, 79, 100],
      },
    ],
  },
};

export const ProgressChartObject = {
  type: "ProgressChart",
  title: "Message Categories",
  chart: {
    series: [
      {
        label: "Pending",
        value: 30,
      },
      {
        label: "Canceled",
        value: 2,
      },
      {
        label: "Completed",
        value: 10,
      },
    ],
  },
};

export const StackedColumnChartObject = {
  type: "StackedColumnChart",
  title: "Campaign Comparison",
  chart: {
    categories: [
      "Campaign 1",
      "Campaign 2",
      "Campaign 3",
      "Campaign 4",
      "Campaign 5",
      "Campaign 6",
    ],

    series: [
      {
        name: "Read",
        data: [10, 41, 35, 51, 49, 62],
      },
      {
        name: "Delivered",
        data: [10, 34, 13, 56, 77, 88],
      },

      {
        name: "Delivered To Channel",
        data: [3, 25, 76, 23, 87, 12],
      },
      {
        name: "Failed",
        data: [3, 25, 76, 23, 87, 12],
      },
      {
        name: "Pending",
        data: [3, 25, 76, 23, 87, 12],
      },
    ],
  },
};
