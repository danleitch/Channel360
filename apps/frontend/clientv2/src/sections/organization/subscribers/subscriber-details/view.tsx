'use client';

import { CustomDataGrid } from '@channel360/ui-core';
import React, { useState, useEffect, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import { Card, Stack, Container, CardHeader } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { SubscriberType } from 'src/models';
import { subscriberService } from 'src/services/subscriber.service';
import { useOrganizationContext } from 'src/context/organization.context';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import { MessageSubscriberForm } from 'src/components/forms/subscribers/subscriber-details';

const SubscriberDetailsView = (props: any) => {
  const { modelId } = props;
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(true);
  const [subscriber, setSubscriber] = useState<SubscriberType>();
  const [subscriberHistory, setSubscriberHistory] = useState([]);

  const orgId = useOrganizationContext();
  const settings = useSettingsContext();

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'avatarUrl',
        headerName: 'Avatar',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 0.5,
        sortable: false,
        renderCell: (params) => <Avatar src={params.row.avatarUrl} />,
      },
      {
        field: 'text',
        headerName: 'Message',
        headerClassName: 'larger-text',
        flex: 2,
      },
      {
        field: 'received',
        headerName: 'Received',
        headerClassName: 'larger-text',
        flex: 1.5,
        valueGetter: (params: GridRenderCellParams<any>) => new Date(params.row.received * 1000),
      },
    ],
    []
  );
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await subscriberService.getSubscriber(modelId, orgId);
      setSubscriber(response.data);

      const historyResponse = await subscriberService.getSubscriberHistory(
        orgId,
        response.data.mobileNumber
      );
      const messages = historyResponse.data.conversation.messages.reverse();
      setSubscriberHistory(messages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [orgId, modelId]);

  useEffect(() => {
    setInitialLoad(true);
    refresh().then(() => setInitialLoad(false));
  }, [refresh, orgId]);

  return (
    <>
      {initialLoad ? (
        <LoadingScreen />
      ) : (
        subscriber && (
          <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Stack spacing={3}>
              <Card sx={{ p: 2 }} variant="outlined">
                <CardHeader
                  title="Name"
                  subheader={`${subscriber.firstName} ${subscriber.lastName}`}
                  action={<MessageSubscriberForm refresh={refresh} subscriber={subscriber} />}
                />
                <CardHeader title="Number" subheader={subscriber.mobileNumber} />
                <CardHeader title="Opt In Status" subheader={subscriber.optInStatus.toString()} />
              </Card>
              <Card variant="outlined" sx={{ height: 565, width: '100%' }}>
                <CustomDataGrid
                  autoHeight={false}
                  loading={loading}
                  rows={subscriberHistory}
                  columns={columns}
                  getRowId={(row) => row._id}
                  getRowHeight={() => 'auto'}
                />
              </Card>
            </Stack>
          </Container>
        )
      )}
    </>
  );
};

export default SubscriberDetailsView;
