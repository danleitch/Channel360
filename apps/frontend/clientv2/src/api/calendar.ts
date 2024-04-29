import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import { publicRuntimeConfig } from 'next.config';

import axios, { endpoints } from 'src/utils/axios';

import { ICalendarEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

import { orgIdType } from '@channel360/ui-core';

import { Campaign } from 'src/models';
import { campaignService } from 'src/services';
import { useOrganizationContext } from 'src/context/organization.context';

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const BASE_URL: string = publicRuntimeConfig.apiUrl;

export function useGetEvents() {
  const orgId = useOrganizationContext();

  const URL = `${BASE_URL}/${endpoints.campaigns(orgId)}?page=1&limit=50&search=`;

  const fetcher = (url: string) => axios.get(url).then((res) => ({ events: res.data.data }));

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);
  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event: any) => ({
      ...event,
      id: event.id,
      title: event.reference,
      start: event.scheduled,
      description: event.description,
      allDay: false,
      textColor: event.color,
    }));
    return {
      events: (events as ICalendarEvent[]) || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events?.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: Campaign, orgId: orgIdType) {
  const URL = `${BASE_URL}/${endpoints.campaigns(orgId)}?page=1&limit=50&search=`;
  const newEvent = await campaignService.create(orgId, eventData);
  mutate(
    URL,
    (currentData: any) => {
      const newCalendarEvent: Campaign = {
        ...eventData,
        id: newEvent.data.data.id,
      };

      const events: ICalendarEvent[] = [...currentData.events, newCalendarEvent];

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------
type UpdateCalendarEvent = Partial<ICalendarEvent> & { id: string };

export async function updateEvent(eventData: UpdateCalendarEvent, orgId: orgIdType) {
  const URL = `${BASE_URL}/${endpoints.campaigns(orgId)}?page=1&limit=50&search=`;
  campaignService.update(orgId, eventData.id, eventData);

  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.map((event: ICalendarEvent) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}

// ----------------------------------------------------------------------

export function deleteEvent(orgId: orgIdType, eventId: string) {
  const URL = `${BASE_URL}/${endpoints.campaigns(orgId)}?page=1&limit=50&search=`;
  campaignService.deleteCampaign(orgId, eventId);

  mutate(
    URL,
    (currentData: any) => {
      const events: ICalendarEvent[] = currentData.events.filter(
        (event: ICalendarEvent) => event.id !== eventId
      );

      return {
        ...currentData,
        events,
      };
    },
    false
  );
}
