import LoginForm from '@/components/auth/LoginForm'
import AuthGuard from '@/components/auth/AuthGuard'

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <LoginForm />
    </AuthGuard>
  )
} 