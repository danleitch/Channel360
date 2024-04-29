import React from 'react';
import { useSelector } from 'react-redux';
import { DynamicChart } from '@channel360/ui-core';

import { Grid } from '@mui/material';

import { RootState } from 'src/redux/store';
import { chartService } from 'src/services';
import { useOrganizationContext } from 'src/context/organization.context';

const RenderDynamicChart = () => {
  const orgId = useOrganizationContext();
  const { data: charts } = useSelector((state: RootState) => state.charts);
  const { startDate, endDate } = useSelector((state: RootState) => state.dateRange);

  const fetchChartData = async (chartId: string) => {
    const data = await chartService.getChart(orgId, chartId, startDate, endDate);
    return data.data;
  };
  return (
    <Grid container spacing={3}>
      {charts.map(({ id, type }) => (
        <DynamicChart key={id} chartId={id} chartType={type} fetchChartData={fetchChartData} />
      ))}
    </Grid>
  );
};

export default RenderDynamicChart;
