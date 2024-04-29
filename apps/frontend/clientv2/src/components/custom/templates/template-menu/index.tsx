import * as React from 'react';
import { useState } from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Link, ListItemIcon, CircularProgress } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { templateService } from 'src/services';
import { useOrganizationContext } from 'src/context/organization.context';

const ITEM_HEIGHT = 48;

export const TemplateMenu = ({ row, refresh }: any) => {
  const [loading, setLoading] = useState(false);

  const orgId = useOrganizationContext();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEnable = React.useCallback(
    async (data?: any) => {
      setLoading(true);
      try {
        const updatedStatus = {
          enabled: data.status,
        };
        await templateService.updateTemplate(orgId, row.id, updatedStatus);
        refresh(row.enabled);
      } catch (error) {
        console.error('Failed to update template:', error);
      } finally {
        setAnchorEl(null);
        setLoading(false);
      }
    },
    [orgId, refresh, row.enabled, row.id]
  );

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '15ch',
          },
        }}
      >
        <Link color="inherit" underline="none" component={RouterLink} href={row.name}>
          <MenuItem key="1">
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
        </Link>
        {row.enabled ? (
          <MenuItem key="2" onClick={() => handleEnable({ status: false })}>
            <ListItemIcon>
              <VisibilityOffIcon fontSize="small" />
            </ListItemIcon>
            {loading ? (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              'Disable'
            )}
          </MenuItem>
        ) : (
          <MenuItem key="2" onClick={() => handleEnable({ status: true })}>
            <ListItemIcon>
              <RemoveRedEyeIcon fontSize="small" />
            </ListItemIcon>
            {loading ? (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              'Enable'
            )}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
