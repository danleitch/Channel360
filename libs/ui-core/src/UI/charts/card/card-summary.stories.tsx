import React from "react";

import { CardSummary } from "./index";
import CampaignIllustration from "./campaign-illustration";
import { Grid } from "@mui/material";

export default {
  title: "Charts/Card Summary",
  component: CardSummary,
};

const Template = () => (
  <Grid container>
    <CardSummary
      status="success"
      title="Subscribers"
      total={20453}
      icon={<CampaignIllustration />}
    />
  </Grid>
);

export const Default = Template.bind({});
