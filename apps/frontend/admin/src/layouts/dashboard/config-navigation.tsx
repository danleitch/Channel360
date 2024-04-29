import { useMemo } from 'react';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/admin/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  organization: icon('ic_360BRorgsettings'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Admin',
        items: [
          { title: 'Dashboard', path: '/dashboard', icon: ICONS.dashboard },
          { title: 'Organizations', path: '/organizations', icon: ICONS.organization },
        ],
      },
    ],
    []
  );

  return data;
}
