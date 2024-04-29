import { FC } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, InputLabel, Typography } from '@mui/material';

import { Template } from 'src/models';

interface MessagePreviewProps {
  template?: Template | undefined;
}

export const MessagePreview: FC<MessagePreviewProps> = ({ template }) => {
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Stack spacing={3}>
      <InputLabel id="template-label">Message Preview</InputLabel>
      <Box
        sx={{
          background: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[300],

          border: '1px solid #ccc',
          padding: theme.spacing(2),
          borderRadius: theme.spacing(1),
        }}
      >
        {template?.components ? (
          <Box>
            {template.components.map((component, index) => (
              <Typography key={index} sx={{ margin: 3 }}>
                {component.text}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography align="center">Select a Message Template</Typography>
        )}
      </Box>
    </Stack>
  );
};
