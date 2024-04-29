import Link from 'next/link';
import { m } from 'framer-motion';

import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

import { varHover } from 'src/components/animate';

const DocsPopOver = () => (
  <Tooltip title="Documentation">
    <Link href="https://docs.channel360.co.za/" target="_blank" rel="noopener noreferrer">
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        aria-label="settings"
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <HelpCenterIcon />
      </IconButton>
    </Link>
  </Tooltip>
);

export default DocsPopOver;
