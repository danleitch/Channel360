'use client';

// ----------------------------------------------------------------------
import { useOrganizationContext } from 'src/context/organization.context';

import SubscriberView from 'src/sections/organization/subscribers/view';

export default function Page() {
  const orgId = useOrganizationContext();
  return <SubscriberView orgId={orgId} />;
}
