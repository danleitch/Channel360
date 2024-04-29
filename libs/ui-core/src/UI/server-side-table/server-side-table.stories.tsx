import React from "react";

import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import { ServerSideTable } from "./server-side-table";
import { orgIdType, PaginationModel, withServerSideTable } from "./wrapper";

export default {
  title: "ServerSideTable",
  component: ServerSideTable,
};

function getFullName(params: any) {
  return `${params.row.firstName || ""} ${params.row.lastName || ""}`;
}

const columns: GridColDef[] = [
  {
    field: "mobileNumber",
    headerName: "Mobile Number",
    headerClassName: "larger-text",
    headerAlign: "center",
    align: "center",
    flex: 1,
    valueGetter: (params: any) => params.row.mobileNumber,
  },
  {
    field: "fullName",
    headerName: "Full Name",
    headerClassName: "larger-text",
    headerAlign: "center",
    align: "center",
    flex: 2,
    valueGetter: getFullName,
  },
  {
    field: "optInStatus",
    headerName: "Opted In",
    headerClassName: "larger-text",
    headerAlign: "center",
    align: "center",
    type: "boolean",
    flex: 2,
    valueGetter: (params: any) => params.row.optInStatus,
  },
];

const mockResponse = {
  subscribers: [
    {
      optInStatus: true,
      mobileNumber: "27631337008",
      firstName: "Bryn",
      lastName: "Watson",
      organization: "6424439655cf37a8df0ce20b",
      createdAt: "2023-11-29T17:58:21.984Z",
      updatedAt: "2023-11-29T17:58:21.984Z",
      __v: 0,
      id: "65677bbdf1d01a44f96be43d",
    },
    {
      optInStatus: true,
      mobileNumber: "27631344350",
      firstName: "Mitchell",
      lastName: "Yuen",
      organization: "6424439655cf37a8df0ce20b",
      createdAt: "2023-11-29T17:58:21.984Z",
      updatedAt: "2023-11-29T17:58:21.984Z",
      __v: 0,
      id: "65677bbdf1d01a44f96be43e",
    },
  ],
  page: 1,
  limit: 15,
  total: 2,
};

const mockGroupService = {
  getGroupSubscribers: async (groupId, orgId, page, pageSize, searchQuery) => Promise.resolve({ data: mockResponse }),
};

const fetchViewData = async (
  orgId: orgIdType,
  paginationModel: PaginationModel,
  searchQuery: string,
  groupId: any
) => {
  const response = await mockGroupService.getGroupSubscribers(
    orgId,
    paginationModel.page + 1,
    paginationModel.pageSize,
    searchQuery,
    groupId
  );
  const { subscribers } = response.data;
  const { total } = response.data;

  return { items: subscribers, total };
};

const ViewComponent = (props: any) => {
  const buttons = (
    <>
      <Button color="warning" variant="contained">
        Export
      </Button>
      <Button color="success" variant="contained">
        Import
      </Button>
      <Button color="primary" variant="contained">
        Create
      </Button>
    </>
  );
  return (
    <ServerSideTable children={buttons} columns={columns} {...props} />
  );
};

const EnhancedView = withServerSideTable(ViewComponent, fetchViewData);

const mockOrgId = "wefewfwefewfwef" as unknown as orgIdType;
const Template = () => <EnhancedView orgId={mockOrgId} />;

export const Default = Template.bind({});
