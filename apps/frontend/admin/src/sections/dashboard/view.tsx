'use client';

import { Title } from '@channel360/ui-core';

import {  Card, Stack } from '@mui/material';

import ViewLayout from 'src/layouts/common/view-layout';

// ----------------------------------------------------------------------

export default function DashboardView() {
  return (
    <ViewLayout>
      <Stack spacing={3}>
        <Title> Dashboard </Title>
        <Card sx={{ width: '100%', height: '100vh' }}>
          <iframe
            title="Dashboard Charts"
            style={{
              background: '#F1F5F4',
              border: 'none',
              borderRadius: '2px',
              boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
              width: '100%',
              height: '100%',
            }}
            src="https://charts.mongodb.com/charts-channel360-llzgr/embed/dashboards?id=44dc8a4e-cdbf-4ee8-bcb4-ad5dfd2cd9ac&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"
          />
        </Card>
      </Stack>
    </ViewLayout>
  );
}
