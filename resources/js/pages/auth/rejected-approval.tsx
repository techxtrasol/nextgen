import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, Shield, XCircle } from 'lucide-react';

interface User {
  name: string;
  email: string;
  approval_notes: string | null;
  approval_status: string;
  joined_at: string;
}

interface Props {
  user: User;
}

export default function RejectedApproval({ user }: Props) {
  return (
    <>
      <Head title="Application Rejected" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Application Rejected
            </h1>
            <p className="text-muted-foreground">
              We're sorry, but your application was not approved
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Hello, {user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {user.approval_notes && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                      Reason for Rejection
                    </h4>
                    <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                      {user.approval_notes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RefreshCw className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    What can you do?
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    You can address the concerns mentioned above and resubmit your application.
                    We encourage you to provide additional information that might help with the approval process.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Link href={route('approval.resubmit')} method="post" as="button">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resubmit Application
                </Button>
              </Link>

              <Link href={route('login')}>
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Applied on {new Date(user.joined_at).toLocaleDateString()}
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
