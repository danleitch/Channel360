import OrganizationDetailsView from 'src/sections/organization/organization-details/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Admin: Organization Details',
};

export default function Page({ params }: any) {
  return <OrganizationDetailsView orgId={params.id} />;
}
