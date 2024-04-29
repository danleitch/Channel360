'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Stack } from '@mui/material';

import ViewLayout from 'src/layouts/common/view-layout';
import { RootState, AppDispatch } from 'src/redux/store';
import { useOrganizationContext } from 'src/context/organization.context';
import { fetchChartIds } from 'src/redux/thunks/dashboard/fetch-chart-ids';

import { LoadingScreen } from 'src/components/loading-screen';
import DashboardCards from 'src/components/custom/dashboard/cards';
import DateSelector from 'src/components/custom/dashboard/date-range-seletor';
import RenderDynamicChart from 'src/components/custom/dashboard/dynamic-chart';

export default function DashboardView() {
  const orgId = useOrganizationContext();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.charts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchChartIds(orgId));
      } catch (error) {
        console.error('Failed to fetch chart ids', error);
      }
    };

    fetchData();
  }, [dispatch, orgId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ViewLayout>
      <Stack spacing={3}>
        <DashboardCards />
        <DateSelector />
        <RenderDynamicChart />
      </Stack>
    </ViewLayout>
  );
}
