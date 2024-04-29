'use client';

import { GuestGuard } from "src/auth/guard";
import Header from "src/layouts/auth/auth-header";
import AuthClassicLayout from "src/layouts/auth/classic-auth-layout";

import LandingView from "src/sections/landing/landing-view";

// ----------------------------------------------------------------------

export default function LandingPage() {
  return (
    <GuestGuard>
      <Header />
      <AuthClassicLayout>
        <LandingView />
      </AuthClassicLayout>
    </GuestGuard>
  );
}
