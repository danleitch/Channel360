'use client';

import { useOrganizationContext } from 'src/context/organization.context';

import GroupsView from 'src/sections/organization/groups/view';

// ----------------------------------------------------------------------

export default function Page() {
  const orgId = useOrganizationContext();
  return <GroupsView orgId={orgId} />;
}
