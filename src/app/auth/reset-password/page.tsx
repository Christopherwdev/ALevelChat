import ResetPasswordForm from './reset-password-form';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ResetPasswordPage() {
  return (
    <ProtectedRoute currentPath='/auth/reset-password'>
      <ResetPasswordForm />
    </ProtectedRoute>
  );
}