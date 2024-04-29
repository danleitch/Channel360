import * as React from "react";

import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import {
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

import Iconify from "../iconify";

// ----------------------------------------------------------------------

export const CustomToolbar = () => (
  <Stack
      spacing={2}
      alignItems={{ xs: "flex-end", md: "center" }}
      direction={{
        xs: "column",
        md: "row",
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: 1 }}>
        <GridToolbarExport />
        <GridToolbarFilterButton />
        <GridToolbarQuickFilter
          variant="outlined"
          sx={{ width: "100%", pt: 0.5 }}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
);
