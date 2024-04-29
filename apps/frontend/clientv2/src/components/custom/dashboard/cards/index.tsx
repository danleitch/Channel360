import Link from 'next/link';
import React, { useEffect } from 'react';
import { CardSummary } from '@channel360/ui-core';
import { useSelector, useDispatch } from 'react-redux';

import { Grid } from '@mui/material';

import { RootState, AppDispatch } from 'src/redux/store';
import { useOrganizationContext } from 'src/context/organization.context';
import CampaignIllustration from 'src/assets/illustrations/campaign-illustration';
import TemplateIllustration from 'src/assets/illustrations/template-illustration';
import SubscriberIllustration from 'src/assets/illustrations/subscriber-illustration';
import {
  fetchCampaignsData,
  fetchTemplatesData,
  fetchSubscribersData,
} from 'src/redux/thunks/dashboard/fetch-service-metrics';

const DashboardCards = () => {
  const orgId = useOrganizationContext();
  const dispatch = useDispatch<AppDispatch>();
  const { campaigns, subscribers, templates } = useSelector(
    (state: RootState) => state.serviceMetrics
  );

  useEffect(() => {
    if (orgId) {
      dispatch(fetchCampaignsData(orgId));
      dispatch(fetchSubscribersData(orgId));
      dispatch(fetchTemplatesData(orgId));
    }
  }, [orgId, dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Link href={`/organization/${orgId}/campaigns`} passHref style={{ textDecoration: 'none' }}>
          <CardSummary
            status={campaigns.status}
            title={campaigns.data.title}
            total={campaigns.data.count}
            icon={<CampaignIllustration />}
          />
        </Link>
      </Grid>
      <Grid item xs={12} md={4}>
        <Link
          href={`/organization/${orgId}/subscribers`}
          passHref
          style={{ textDecoration: 'none' }}
        >
          <CardSummary
            status={subscribers.status}
            title={subscribers.data.title}
            total={subscribers.data.count}
            icon={<SubscriberIllustration />}
          />
        </Link>
      </Grid>
      <Grid item xs={12} md={4}>
        <Link href={`/organization/${orgId}/templates`} passHref style={{ textDecoration: 'none' }}>
          <CardSummary
            status={templates.status}
            title={templates.data.title}
            total={templates.data.count}
            icon={<TemplateIllustration />}
          />
        </Link>
      </Grid>
    </Grid>
  );
};

export default DashboardCards;
