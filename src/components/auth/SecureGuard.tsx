'use client';

import React from 'react';
import AuthGuard from './AuthGuard';
import ForcePasswordChangeGuard from './ForcePasswordChangeGuard';

interface SecureGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function SecureGuard({ children, requireAuth = true, redirectTo }: SecureGuardProps) {
  return (
    <AuthGuard requireAuth={requireAuth} redirectTo={redirectTo}>
      <ForcePasswordChangeGuard>
        {children}
      </ForcePasswordChangeGuard>
    </AuthGuard>
  );
} 