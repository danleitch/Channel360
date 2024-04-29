import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Skeleton } from '@mui/material';

import { RootState, AppDispatch } from 'src/redux/store';
import { useOrganizationContext } from 'src/context/organization.context';
import { fetchSettings } from 'src/redux/thunks/settings/fetch-organization-settings';

import OrganizationSettingsForm from '../form';

export default function OrganizationSettingsView() {
  const dispatch = useDispatch<AppDispatch>();
  const orgId = useOrganizationContext();
  const { orgSettings, loading } = useSelector((state: RootState) => state.organizationSettings);

  useEffect(() => {
    if (!orgSettings || Object.keys(orgSettings).length === 0) {
      dispatch(fetchSettings(orgId));
    }
  }, [dispatch, orgId, orgSettings]);

  if (loading) {
    return (
      <>
        <Skeleton variant="text" height={50} width={250} />
        <Skeleton variant="text" height={120} />
        <Skeleton variant="text" height={120} />
        <Skeleton variant="text" height={50} width={150} sx={{ ml: 'auto' }} />
      </>
    );
  }
  return <OrganizationSettingsForm />;
}
