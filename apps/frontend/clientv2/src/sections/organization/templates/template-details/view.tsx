'use client';

import { Header, CustomDataGrid } from '@channel360/ui-core';
import React, { useState, useEffect, useCallback } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridColDef, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Card,
  Grid,
  Link,
  Stack,
  CardMedia,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';

import { templateService } from 'src/services';
import ViewLayout from 'src/layouts/common/view-layout';
import { Tag, Template, SelectedTag, ButtonsObject } from 'src/models';
import { useOrganizationContext } from 'src/context/organization.context';

import { LoadingScreen } from 'src/components/loading-screen';
import { MessagePreview } from 'src/components/message-preview';
import {
  EditTagForm,
  CreateTagForm,
  DeleteTagForm,
  UploadImageForm,
  UploadVideoForm,
} from 'src/components/forms/templates/template-details';

const TemplateDetailsView = ({ ...props }) => {
  const { modelId } = props;
  const [template, setTemplate] = useState<Template>();
  const [loading, setLoading] = useState(true);
  const orgId = useOrganizationContext();
  const [gridData, setGridData] = useState<Tag[]>([]);
  const [tagList, setTaglist] = useState<number[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState<SelectedTag | null>(null);
  const headerUrl = template?.tags?.head?.[0]?.url;

  const getRowId = (row: any) => `${row.contentType}-${row.index}`;

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'contentType',
        headerName: 'Content Type',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
      {
        field: 'index',
        headerName: 'Index',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 2,
        renderCell: (params) => <>{params.value ?? 'None'}</>,
      },

      {
        field: 'type',
        headerName: 'Type',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
      },
      {
        field: 'valueOrFields',
        headerName: 'Value',
        headerClassName: 'larger-text',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        renderCell: (params) => {
          const displayText = params.row.fields ?? params.row.value ?? 'N/A';
          return <div>{displayText}</div>;
        },
      },

      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            onClick={() => {
              setSelectedTag(params.row);
              setOpenEditForm(true);
            }}
            icon={<EditIcon style={{ fontSize: 30 }} color="primary" />}
            label="Edit"
          />,
          <GridActionsCellItem
            onClick={() => {
              setSelectedTag(params.row);
              setOpenDeleteForm(true);
            }}
            icon={<DeleteIcon style={{ fontSize: 30 }} color="error" />}
            label="Delete"
          />,
        ],
      },
    ],
    []
  );

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const regex = /{{(\d+)}}/g;
      const response = await templateService.getTemplate(orgId, modelId);
      const fetchedTemplate = response.data;
      setTemplate(fetchedTemplate);

      const newTagList: number[] = [];
      fetchedTemplate.components.forEach((component) => {
        if (component.text) {
          let match = regex.exec(component.text);
          while (match !== null) {
            const number = parseInt(match[1], 10);
            if (!newTagList.includes(number)) {
              newTagList.push(number);
            }
            match = regex.exec(component.text);
          }
        }

        if (component.type === 'BUTTONS' && component.buttons) {
          component.buttons.forEach((button) => {
            if (button.url) {
              let match = regex.exec(button.url);
              while (match !== null) {
                const number = parseInt(match[1], 10);
                if (!newTagList.includes(number)) {
                  newTagList.push(number);
                }
                match = regex.exec(button.url);
              }
            }
          });
        }
      });

      setTaglist(newTagList.sort((a, b) => a - b));

      const filteredHeadTags = response.data.tags.head.filter(
        (tag) => tag.type !== 'image' && tag.type !== 'document' && tag.type !== 'video'
      );

      const combinedTags: Tag[] = [
        ...filteredHeadTags.map((tag) => ({ ...tag, contentType: 'Head' })),
        ...response.data.tags.body.map((tag) => ({ ...tag, contentType: 'Body' })),
        ...response.data.tags.buttons.map((tag) => ({ ...tag, contentType: 'Buttons' })),
      ];

      setGridData(combinedTags);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setInitialLoad(false);
      setLoading(false);
    }
  }, [orgId, modelId]);

  useEffect(() => {
    if (orgId) {
      refresh();
    }
  }, [orgId, refresh]);

  const findComponentByType = (type: string) =>
    template?.components.find((component) => component.type === type);

  const headerComponent = findComponentByType('HEADER');
  const buttonsComponent = findComponentByType('BUTTONS');

  const renderButtons = (buttonsObject: ButtonsObject) => (
    <Stack spacing={1}>
      {buttonsObject.buttons.map((button, index) => {
        switch (button.type) {
          case 'PHONE_NUMBER':
            return <Typography key={index}>Phone: {button.phoneNumber}</Typography>;
          case 'URL':
            return (
              <Typography key={index}>
                URL: <Link href={button.url}>{button.url}</Link>
              </Typography>
            );
          case 'QUICK_REPLY':
            return <Typography key={index}>Quick Reply: {button.text}</Typography>;
          default:
            return <Typography key={index}>Unknown Button Type</Typography>;
        }
      })}
    </Stack>
  );

  return (
    <>
      {initialLoad ? (
        <LoadingScreen />
      ) : (
        template && (
          <ViewLayout>
            <Grid spacing={3} container>
              <Grid item md={8}>
                <Stack spacing={3} direction="column">
                  <Card sx={{ p: 2 }} variant="outlined">
                    <CardHeader title="Name" subheader={template.name} />
                    <CardHeader title="Category" subheader={template.category} />
                    <CardHeader title="Description" subheader={template.description} />
                    <CardHeader title="Language" subheader={template.language} />
                    <CardHeader title="Enabled" subheader={template.enabled.toString()} />
                    {headerComponent && (
                      <CardHeader title="Header" subheader={headerComponent.format} />
                    )}
                    {buttonsComponent && (
                      <CardHeader title="Buttons" subheader={renderButtons(buttonsComponent)} />
                    )}
                  </Card>
                  {template && tagList && tagList.length > 0 && (
                    <Card variant="outlined">
                      <Stack
                        sx={{ m: 3 }}
                        spacing={1}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Header>Tags</Header>
                        <CreateTagForm tagList={tagList} template={template} refresh={refresh} />
                      </Stack>

                      <CustomDataGrid
                        loading={loading}
                        rows={gridData}
                        columns={columns}
                        getRowId={getRowId}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 10,
                            },
                          },
                        }}
                      />
                    </Card>
                  )}
                </Stack>
              </Grid>
              <Grid item md={4}>
                <Card variant="outlined">
                  {headerUrl && headerComponent!.format === 'IMAGE' && (
                    <CardMedia
                      sx={{ maxHeight: '300px' }}
                      component="img"
                      image={headerUrl}
                      title="Template Image"
                    />
                  )}
                  {headerComponent && headerComponent.format === 'VIDEO' && (
                    <CardMedia
                      component="video"
                      sx={{ maxHeight: '300px' }}
                      src={headerUrl}
                      title="Template Video"
                      controls
                    />
                  )}

                  <CardContent>
                    <Stack spacing={3}>
                      {headerComponent && headerComponent.format === 'IMAGE' && (
                        <UploadImageForm template={template} refresh={refresh} />
                      )}
                      {headerComponent && headerComponent.format === 'VIDEO' && (
                        <UploadVideoForm template={template} refresh={refresh} />
                      )}

                      <MessagePreview template={template} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {selectedTag && template && (
              <>
                <DeleteTagForm
                  template={template}
                  refresh={refresh}
                  open={openDeleteForm}
                  setOpen={setOpenDeleteForm}
                  selectedTag={selectedTag}
                />

                <EditTagForm
                  template={template}
                  refresh={refresh}
                  open={openEditForm}
                  setOpen={setOpenEditForm}
                  selectedTag={selectedTag}
                />
              </>
            )}
          </ViewLayout>
        )
      )}
    </>
  );
};

export default TemplateDetailsView;
