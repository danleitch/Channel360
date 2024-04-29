'use client';

import { UnhandledError } from 'src/sections/error';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Unhandled Error',
};

export default function ErrorPage() {
  return <UnhandledError />;
}
