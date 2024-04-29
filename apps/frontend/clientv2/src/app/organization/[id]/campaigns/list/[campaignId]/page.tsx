'use client';

import { useOrganizationContext } from 'src/context/organization.context';

import CampaignsDetailsView from 'src/sections/organization/campaigns/campaign-details/view';

export default function Page({ params: { campaignId } }: any) {
  const orgId = useOrganizationContext();

  return <CampaignsDetailsView modelId={campaignId} orgId={orgId} />;
}
