import React from 'react';

import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';


interface StaticNavItemProps {
  title: string;
  icon: JSX.Element; 
  active?: boolean; 
}


const StyledStaticNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active', 
})<Pick<StaticNavItemProps, 'active'>>(({ theme, active }) => ({
  borderRadius: 6,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightMedium,
  ...theme.typography.body2,
  minHeight: 44,
  flexShrink: 0,
  padding: theme.spacing(0, 0.75),
  '& .icon': {
    width: 22,
    height: 22,
    flexShrink: 0,
    marginRight: theme.spacing(1),
  },
  '& .label': {
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
  },
  '& .caption': {
    marginLeft: theme.spacing(0.75),
    color: theme.palette.text.disabled,
  },
  '& .info': {
    display: 'inline-flex',
    marginLeft: theme.spacing(0.75),
  },
  '& .arrow': {
    marginLeft: theme.spacing(0.75),
  },

  ...(active && {
    color:
      theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
  }),
}));

const StaticNavItem = ({ title, icon, active = false }: StaticNavItemProps) => (
    <Link component={RouterLink} href="/" color="inherit" underline="none">
      <StyledStaticNavItem active={active}>
        <Box component="span" className="icon">
          {icon}
        </Box>
        <Box component="span" className="label">
          {title}
        </Box>
      </StyledStaticNavItem>
    </Link>
  );

export default StaticNavItem;
