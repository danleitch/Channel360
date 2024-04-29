export function link() {
  return {
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&:hover': {
            color: 'blue',
          },
        },
      },
    },
  };
}
