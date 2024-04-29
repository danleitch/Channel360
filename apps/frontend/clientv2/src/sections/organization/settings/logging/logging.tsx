import React from 'react';
import {
  orgIdType,
  PaginationModel,
  ServerSideTable,
  withServerSideTable,
} from '@channel360/ui-core';

import { Stack } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { loggingService } from 'src/services/logging.service';

import { ExportLogsForm } from 'src/components/forms/settings/logging';

const Logging = (props: any) => {
  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'createdAt',
        headerName: 'Date and Time',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 3,
        valueGetter: (params: GridRenderCellParams<any>) => {
          const date = new Date(params.value);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        },
      },
      {
        field: 'mobileNumber',
        headerName: 'Mobile Number',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1.5,
      },
      {
        field: 'messageText',
        headerName: 'Message',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 3,
      },
      {
        field: 'direction',
        headerName: 'Direction',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
      {
        field: 'status',
        headerName: 'Status',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
    ],
    []
  );

  return (
    <>
      <Stack sx={{ m: 3 }} spacing={1} direction="row" justifyContent="flex-end">
        <ExportLogsForm />
      </Stack>
      <ServerSideTable columns={columns} {...props} />
    </>
  );
};

const fetchLoggingResponsesData = async (
  orgId: orgIdType,
  paginationModel: PaginationModel,
  searchQuery: string
) => {
  const response = await loggingService.getAll(
    orgId,
    paginationModel.page,
    paginationModel.pageSize,
    searchQuery
  );

  return { items: response.data.logs, total: response.data.totalLogs };
};
// We wrap the component in a HOC to get the data from the server
const EnhancedResponsesTable = withServerSideTable(Logging, fetchLoggingResponsesData);

export default EnhancedResponsesTable;
