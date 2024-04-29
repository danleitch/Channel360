import { useMemo } from 'react';

import { useOrganizationContext } from 'src/context/organization.context';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  dashboard: icon('ic_dashboard'),
  templates: icon('ic_templates'),
  lock: icon('ic_lock'),
  campaigns: icon('ic_campaigns'),
  subs: icon('ic_subs'),
  groups: icon('ic_groups'),
  settings: icon('ic_settings'),
  calendar: icon('ic_calendar'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const id = useOrganizationContext();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Admin',
        items: [
          { title: 'Dashboard', path: `/organization/${id}/dashboard`, icon: ICONS.dashboard },
        ],
      },

      // Broacaster
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          { title: 'Templates', path: `/organization/${id}/templates`, icon: ICONS.templates },
          {
            title: 'Campaigns',
            path: `/organization/${id}/campaigns`,
            icon: ICONS.campaigns,
            children: [
              {
                title: 'List',
                path: `/organization/${id}/campaigns/list`,
              },
              {
                title: 'Calendar',
                path: `/organization/${id}/campaigns/calendar`,
              },
            ],
          },

          { title: 'Subscribers', path: `/organization/${id}/subscribers`, icon: ICONS.subs },
          { title: 'Groups', path: `/organization/${id}/groups`, icon: ICONS.groups },
        ],
      },
      {
        subheader: 'Settings',
        items: [{ title: 'Settings', path: `/organization/${id}/settings`, icon: ICONS.settings }],
      },
    ],
    [id]
  );

  return data;
}
