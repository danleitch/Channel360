'use client';

import { useState } from 'react';

import FeedIcon from '@mui/icons-material/Feed';
import SettingsIcon from '@mui/icons-material/Settings';
import { Tab, Box, Tabs, Stack, Container, Typography } from '@mui/material';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

import { useOrganizationContext } from 'src/context/organization.context';

import { useSettingsContext } from 'src/components/settings';

import Logging from 'src/sections/organization/settings/logging/logging';
import { IntegrationSettingsView } from 'src/sections/organization/settings/integration-settings/view';
import { OrganizationSettingsView } from 'src/sections/organization/settings/organization-settings/view';

// ----------------------------------------------------------------------

export default function SettingsView() {
  const [currentTab, setCurrentTab] = useState('logs');
  const orgId = useOrganizationContext();
  const settings = useSettingsContext();

  const TABS = [
    {
      value: 'logs',
      label: 'Logs',
      icon: <FeedIcon />,
      component: <Logging orgId={orgId} />,
      disabled: false,
    },
    {
      value: 'orgSettings',
      label: 'Organization Settings',
      icon: <SettingsIcon />,
      component: <OrganizationSettingsView />,
      disabled: false,
    },
    {
      value: 'integrations',
      label: 'Developer Settings',
      icon: <IntegrationInstructionsIcon />,
      component: <IntegrationSettingsView />,
      disabled: false,
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h3">
          Settings
        </Typography>

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab
              disabled={tab?.disabled}
              key={tab.value}
              label={tab.label}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {TABS.map((tab) => tab.value === currentTab && <Box key={tab.value}>{tab.component}</Box>)}
      </Stack>
    </Container>
  );
}
