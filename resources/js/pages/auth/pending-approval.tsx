import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, Mail, Shield } from 'lucide-react';

interface User {
  name: string;
  email: string;
  email_verified: boolean;
  admin_approved: boolean;
  approval_status: string;
  joined_at: string;
}

interface Props {
  user: User;
}

export default function PendingApproval({ user }: Props) {
  return (
    <>
      <Head title="Pending Approval" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Clock className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Pending Approval
            </h1>
            <p className="text-muted-foreground">
              Your account is being reviewed by our administrators
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Welcome, {user.name}!</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user.email_verified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">Verified</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-yellow-600">Pending</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Admin Approval</span>
                </div>
                <div className="flex items-center space-x-2">
                  {user.admin_approved ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600">Approved</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs text-yellow-600">Pending</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    What happens next?
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Our administrators will review your application and approve your membership.
                    You'll receive an email notification once your account is approved.
                    This usually takes 24-48 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Joined on {new Date(user.joined_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
