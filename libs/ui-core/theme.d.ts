import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: {
      dropdown: string;
    };
  }

  interface ThemeOptions {
    customShadows?: {
      dropdown?: string;
    };
  }
  interface PaletteColor {
    darker?: string;
  }
}
declare module "@mui/material/styles/createTypography" {
  interface Typography {
    fontWeightSemiBold?: number;
  }

  interface TypographyOptions {
    fontWeightSemiBold?: number;
  }
}
