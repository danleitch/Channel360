import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { Box, Link, Button, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from 'src/auth/hooks';

import { varHover } from 'src/components/animate';
import { CustomAvatar } from 'src/components/custom-avatar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

interface Organization {
  id: string;
  name: string;
}

export default function AccountPopover() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>();
  const router = useRouter();
  const { logout, user } = useAuthContext();
  const popover = usePopover();
  const storedOrganizationsStr = localStorage.getItem('organizations');

  useEffect(() => {
    const segments = window.location.href.split('/');
    const urlId = segments[segments.indexOf('organization') + 1]; // Extracting the OrgID from URL

    if (storedOrganizationsStr) {
      const storedOrganizations = JSON.parse(storedOrganizationsStr) as Organization[];
      setOrganizations(storedOrganizations);

      // Search for the OrgID from URL in the storedOrganizations array and set it as the selectedOrg once found.
      if (urlId) {
        const foundOrg = storedOrganizations.find((org) => org.id === urlId);
        if (foundOrg) {
          setSelectedOrg(foundOrg.name);
        }
      }

      // If no OrgID is found in the URL and storedOrganizations is null, set the first Org in the storedOrganizations array as the selectedOrg.
      if (!selectedOrg && storedOrganizations.length > 0 && !urlId) {
        setSelectedOrg(storedOrganizations[0].name);
      }
    }
  }, [selectedOrg, storedOrganizationsStr]);

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickItem = (label: string) => {
    popover.onClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
      >
        <ApartmentIcon />
        <Typography variant="subtitle2" noWrap padding={1}>
          {selectedOrg || 'Loading...'}
        </Typography>
        <CustomAvatar src={undefined} alt={user?.given_name} name={user?.given_name} />
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 'auto', p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {`${user?.given_name} ${user?.family_name}`}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {organizations?.map((organization) => (
            <Link
              component={RouterLink}
              key={organization.name}
              href={`/organization/${organization.id}/dashboard`}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  textDecoration: 'none',
                  color: 'inherit',
                },
              }}
            >
              <MenuItem key={organization.id} onClick={() => handleClickItem(organization.name)}>
                {organization.name}
              </MenuItem>
            </Link>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
