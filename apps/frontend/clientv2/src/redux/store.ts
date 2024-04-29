import { configureStore } from '@reduxjs/toolkit';

import chartReducer from 'src/redux/slices/dashboard/chart-id-slice';
import dateRangeReducer from 'src/redux/slices/dashboard/date-range-slice';
import serviceMetricsReducer from 'src/redux/slices/dashboard/card-metric-slice';
import devSettingsReducer from 'src/redux/slices/settings/developer-settings-slice';
import orgSettingsReducer from 'src/redux/slices/settings/organization-settings-slice';

import calendarReducer from './slices/campaigns/campaign-form-slice';

export const store = configureStore({
  reducer: {
    charts: chartReducer,
    dateRange: dateRangeReducer,
    serviceMetrics: serviceMetricsReducer,
    calendar: calendarReducer,
    organizationSettings: orgSettingsReducer,
    developerSettings: devSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
