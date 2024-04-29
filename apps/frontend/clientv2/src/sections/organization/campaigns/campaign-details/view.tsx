'use client';

import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  Title,
  PieChart,
  SubHeader,
  orgIdType,
  DonutChart,
  handleExport,
  PaginationModel,
  ServerSideTable,
  ProgressLineChart,
  withServerSideTable,
  createProgressLineChartArray,
} from '@channel360/ui-core';

import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Tab,
  Card,
  Grid,
  Tabs,
  Link,
  Stack,
  Button,
  Container,
  CardMedia,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { campaignService } from 'src/services';
import { Campaign, Template } from 'src/models';
import { metricService } from 'src/services/metric.service';
import { useOrganizationContext } from 'src/context/organization.context';

import { ProgressBar } from 'src/components/ProgressBar';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import { MessagePreview } from 'src/components/message-preview';

import EnhancedResponsesTable from './responses-table';

const initialState = {
  messages: { read: 0, delivered: 0, pending: 0, failed: 0, totalSent: 0 },
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_MESSAGE_METRICS':
      return {
        ...state,
        messages: action.payload,
      };
    default:
      throw new Error();
  }
};

const CampaignDetailsView = ({ ...props }: any) => {
  const theme = useTheme();
  const orgId = useOrganizationContext();
  const settings = useSettingsContext();
  const { modelId } = props;
  const [campaign, setCampaign] = useState<Campaign>();
  const [template, setTemplate] = useState<Template>();
  const [buttonLoad, setButtonLoad] = useState(false);
  const [messageStats, setMessageStats] = useState<any[]>([]);
  const router = useRouter();

  const [tableValue, setTableValue] = React.useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [initialLoad, setInitialLoad] = useState(true);
  const imageHeader = campaign?.tags?.head?.[0]?.url;
  const linkHeader = campaign?.tags?.head?.[0]?.document?.link;

  createProgressLineChartArray(state.messages, messageStats, setMessageStats);

  const fetchExportData = async () => {
    try {
      setButtonLoad(true);
      // 0 = "Details" Tab
      if (tableValue === 0) {
        const csvData = await campaignService.exportRecipients(orgId, modelId);
        handleExport(csvData?.data, 'recipients');
      }
      // 1 = "Responses" Tab
      if (tableValue === 1) {
        const csvData = await campaignService.exportCampaignResponses(orgId, modelId);
        handleExport(csvData?.data, 'responses');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setButtonLoad(false);
    }
  };

  const fetchCampaign = useCallback(async () => {
    try {
      const response = await campaignService.getCampaign(orgId, modelId);
      setCampaign(response.data);
      setTemplate(response.data.template);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  }, [orgId, modelId]);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await metricService.getMessages(orgId, 'ALL', modelId);
      dispatch({ type: 'SET_MESSAGE_METRICS', payload: response.data });
    } catch (error) {
      console.error('Error fetching message metrics:', error);
    }
  }, [orgId, modelId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCampaign();
        await fetchMetrics();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setInitialLoad(false);
      }
    };

    fetchData();
  }, [fetchCampaign, fetchMetrics]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'mobileNumber',
        headerName: 'Mobile Number',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        valueGetter: (params: any) => params.row.mobileNumber || params.row.subscriber.mobileNumber,
      },
      {
        field: 'fullName',
        headerName: 'Full Name',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 2,
        valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      },

      {
        field: 'status',
        headerName: 'Status',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        valueGetter: (params: any) => params.row.status,
      },
    ],
    []
  );

  const navigate = async (subId: string) => {
    const ref = paths.dashboard.subscribers(orgId, subId);

    router.push(ref);
  };

  return (
    <>
      {initialLoad ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
          <Stack spacing={3}>
            <Title color="primary">{campaign!.reference}</Title>
            <ProgressBar
              percentage={state.messages.totalSent + state.messages.failed}
              total={state.messages.totalSent + state.messages.pending + state.messages.failed}
              label="Campaign Progress"
            />
            <Grid container spacing={3}>
              {/* Charts and Table */}
              <Grid item xs={12} lg={8} container spacing={3}>
                {/* Chart 1 */}
                <Grid item xs={12}>
                  <ProgressLineChart data={messageStats} title="Message Stats" />
                </Grid>
                {/* Chart 2 */}
                <Grid item xs={12} lg={6}>
                  <PieChart
                    useGridWrapper={false}
                    status="success"
                    title="Campaign Performance"
                    chart={{
                      series: [
                        { label: 'Failed', value: state.messages.failed },
                        {
                          label: 'Success',
                          value: state.messages.delivered + state.messages.read,
                        },
                      ],
                      colors: [theme.palette.error.main, theme.palette.primary.light],
                    }}
                  />
                </Grid>

                {/* Chart 3 */}
                <Grid item xs={12} lg={6}>
                  <DonutChart
                    useGridWrapper={false}
                    status="success"
                    data-cy="campaign-details-pie-chart-delivered"
                    percentageOf="Read"
                    title="Read vs Unread Messages"
                    keyLabel="Messages"
                    chart={{
                      series: [
                        { label: 'Read', value: state.messages.read },
                        { label: 'Unread', value: state.messages.delivered },
                      ],
                    }}
                  />
                </Grid>
                {/* Table Row */}
                <Grid item xs={12}>
                  <Card>
                    <Stack sx={{ m: 3 }} spacing={3} direction="column">
                      <Stack direction="row" justifyContent="space-between">
                        <Tabs
                          value={tableValue}
                          onChange={(event, newValue) => setTableValue(newValue)}
                        >
                          <Tab data-cy="campaign-tab-details" label="Details" />
                          <Tab data-cy="campaign-tab-responses" label="Responses" />
                        </Tabs>
                        <LoadingButton
                          loading={buttonLoad}
                          onClick={fetchExportData}
                          variant="text"
                          startIcon={<SaveAltIcon />}
                        >
                          Export
                        </LoadingButton>
                      </Stack>
                      {tableValue === 0 ? (
                        <ServerSideTable
                          getRowId={(row: any) => row.id}
                          onRowClick={(params: GridRowParams) => navigate(params.row.subscriber)}
                          columns={columns}
                          {...props}
                        />
                      ) : (
                        <EnhancedResponsesTable orgId={orgId} modelId={modelId} />
                      )}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
              {/* Details Column */}
              <Grid item xs={12} md={12} lg={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  {campaign?.tags?.head?.[0]?.type === 'image' && (
                    <CardMedia
                      sx={{ maxHeight: '300px' }}
                      component="img"
                      image={imageHeader}
                      title="Template Image"
                    />
                  )}

                  {campaign?.tags?.head?.[0]?.type === 'video' && (
                    <CardMedia
                      component="video"
                      sx={{ maxHeight: '300px' }}
                      src={imageHeader}
                      title="Template Video"
                      controls
                    />
                  )}

                  {linkHeader && (
                    <CardHeader
                      title="Document Link"
                      subheader={
                        <Typography>
                          <Link target="_blank" href={linkHeader}>
                            Open Link
                          </Link>
                        </Typography>
                      }
                    />
                  )}

                  <CardHeader title="Details" subheader="Further insights into your campaign" />
                  <CardContent>
                    <SubHeader>Scheduled</SubHeader>
                    <Typography sx={{ mb: 3 }}>
                      {new Date(campaign!.scheduled).toLocaleString()}
                    </Typography>

                    <SubHeader>Status</SubHeader>
                    <Typography sx={{ mb: 3 }}>{campaign!.status}</Typography>

                    <SubHeader>Template</SubHeader>
                    <Link
                      component={RouterLink}
                      href={paths.dashboard.templates(orgId, template!.name)}
                      color="inherit"
                      underline="none"
                    >
                      <Button
                        endIcon={<ChevronRightIcon />}
                        variant="contained"
                        sx={{ mb: 3, mt: 1 }}
                      >
                        {template!.name}
                      </Button>
                    </Link>
                    <MessagePreview template={template} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      )}
    </>
  );
};

const fetchCampaignDetailsData = async (
  orgId: orgIdType,
  paginationModel: PaginationModel,
  searchQuery: string,
  campaignId: string
) => {
  const response = await campaignService.getRecipients(
    orgId,
    paginationModel.page + 1,
    paginationModel.pageSize,
    searchQuery,
    campaignId
  );

  const { data, totalDocuments } = response.data;

  return { items: data, total: totalDocuments };
};

const EnhancedCampaignDetails = withServerSideTable(CampaignDetailsView, fetchCampaignDetailsData);

export default EnhancedCampaignDetails;
