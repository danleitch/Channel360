import * as React from "react";

import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  DataGridProps,
} from "@mui/x-data-grid";

import { CustomToolbar } from "./custom-toolbar";
import { CustomNoRowsOverlay } from "./no-rows-overlay";

interface CustomDataGridProps extends DataGridProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  toolbar?: any;
  enableRowHover?: boolean;
}

export const CustomDataGrid = ({
  rows,
  columns,
  slots,
  toolbar,
  enableRowHover = true,

  ...other
}: CustomDataGridProps) => (
  <DataGrid
    rows={rows}
    columns={columns}
    initialState={{
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
      },
    }}
    sx={{
      '& .MuiDataGrid-toolbarContainer input[type="text"]': {
        height: "90px",
      },
      "& .css-1jbbcbn-MuiDataGrid-columnHeaderTitle": {
        fontWeight: "bold",
      },
      "& .larger-text": {
        fontSize: "20px",
      },
      "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within":
        {
          outline: "none !important",
        },
      "& .MuiDataGrid-columnHeaders": {
        userSelect: "none",
      },
      "& .MuiDataGrid-columnSeparator": {
        display: "none",
      },
      ...(enableRowHover && {
        "& .MuiDataGrid-row:hover": {
          cursor: "pointer",
        },
      }),
      "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: "8px" },
      "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": { py: "15px" },
      "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
        py: "22px",
      },
    }}
    slots={{
      noRowsOverlay: CustomNoRowsOverlay,
      toolbar: toolbar ? toolbar : CustomToolbar,
    }}
    autoHeight
    pageSizeOptions={[5, 10, 20, 50]}
    disableRowSelectionOnClick
    disableColumnMenu
    {...other}
  />
);
