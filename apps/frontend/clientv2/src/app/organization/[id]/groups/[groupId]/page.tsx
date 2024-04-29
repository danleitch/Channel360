'use client';

import { useOrganizationContext } from 'src/context/organization.context';

import GroupDetails from 'src/sections/organization/groups/group-details/view';

// ----------------------------------------------------------------------

export default function Page({ params: { groupId } }: any) {
  const orgId = useOrganizationContext();
  return <GroupDetails modelId={groupId} orgId={orgId} />;
}
