import React from "react";

import { PieChart } from "./index";

import Grid from "@mui/material/Grid";

export default {
  title: "Charts/Pie Chart",
  component: PieChart,
};

const Template = () => {
  return (
    <Grid container>
      <PieChart
        status="success"
        title="Notification Categories"
        chart={{
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
        }}
      />
    </Grid>
  );
};

export const Default = Template.bind({});
