import * as React from "react";

import { Card, Stack, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";

import Iconify from "../iconify";
import { CustomDataGrid } from "../data-grid";

interface ServerSideTableProps {
  rows?: GridRowsProp;
  columns: GridColDef[];
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  handleSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: any;
  onRowClick?: (params: any) => void;
  getRowId?: (row: any) => any;
}

export const ServerSideTable: React.FC<ServerSideTableProps> = ({
  rows,
  columns,
  onSearchChange,
  searchQuery,
  handleSearchChange,
  children,
  getRowId,
  ...other
}: any) => (
  <Card sx={{ pt: 3 }}>
    <Stack spacing={3} direction="column">
      <Stack
        spacing={1}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {" "}
        <TextField
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "99%", pt: 0.5 }}
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
        {children}
      </Stack>

      <CustomDataGrid
        rows={rows}
        getRowId={getRowId}
        columns={columns}
        paginationMode="server"
        toolbar={() => <></>}
        {...other}
      />
    </Stack>
  </Card>
);
