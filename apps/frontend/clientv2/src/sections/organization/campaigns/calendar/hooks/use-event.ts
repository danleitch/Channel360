import { useMemo } from 'react';
import merge from 'lodash/merge';

import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

import { ICalendarRange, ICalendarEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

export default function useEvent(
  events: ICalendarEvent[],
  selectEventId: string,
  selectedRange: ICalendarRange,
  openForm: boolean
) {
  const currentEvent = events.find((event) => event.id === selectEventId);
  const defaultValues: any = useMemo(
    () => ({
      id: '',
      reference: '',
      template: '',
      subscriberGroup: '',
      color: CALENDAR_COLOR_OPTIONS[1],
      scheduled: selectedRange ? selectedRange.start : new Date().getTime(),
    }),
    [selectedRange]
  );

  if (!openForm) {
    return undefined;
  }

  if (currentEvent || selectedRange) {
    return merge({}, defaultValues, currentEvent);
  }

  return defaultValues;
}
