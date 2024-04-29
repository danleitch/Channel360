import React, { FC } from 'react';
import { PaginationModel, ServerSideTable, withServerSideTable } from '@channel360/ui-core';

import { GridColDef } from '@mui/x-data-grid';

import { useRouter } from 'src/routes/hooks';

import { campaignService } from 'src/services';
import { orgIdType, useOrganizationContext } from 'src/context/organization.context';

const ResponsesTable: FC = ({ ...props }) => {
  const router = useRouter();
  const orgId = useOrganizationContext();

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'mobileNumber',
        headerName: 'Mobile Number',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        valueGetter: (params: any) => params.row?.recipient?.mobileNumber,
      },
      {
        field: 'fullName',
        headerName: 'Full Name',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 2,
        valueGetter: (params: any) =>
          `${params.row?.recipient?.firstName || ''} ${params.row?.recipient?.lastName || ''}`,
      },

      {
        field: 'text',
        headerName: 'Response',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        valueGetter: (params: any) => params.row.text,
      },
    ],
    []
  );

  return (
    <ServerSideTable
      onRowClick={(params: any) =>
        router.push(`/organization/${orgId}/subscribers/${params.row.recipient.subscriber}`)
      }
      getRowId={(row) => row.id}
      columns={columns}
      {...props}
    />
  );
};

const fetchCampaignResponsesData = async (
  orgId: orgIdType,
  paginationModel: PaginationModel,
  searchQuery: string,
  campaignId: string
) => {
  const response = await campaignService.listCampaignResponses(
    orgId,
    paginationModel.page + 1,
    paginationModel.pageSize,
    searchQuery,
    campaignId
  );

  return { items: response.data.data, total: response.data.totalDocuments };
};
// We wrap the component in a HOC to get the data from the server
const EnhancedResponsesTable = withServerSideTable(ResponsesTable, fetchCampaignResponsesData);

export default EnhancedResponsesTable;
