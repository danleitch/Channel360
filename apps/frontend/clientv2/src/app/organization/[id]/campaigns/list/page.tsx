'use client';

import { useOrganizationContext } from 'src/context/organization.context';

import CampaignView from 'src/sections/organization/campaigns/list/view';

// ----------------------------------------------------------------------

export default function Page() {
  const orgId = useOrganizationContext();

  return <CampaignView orgId={orgId} />;
}
