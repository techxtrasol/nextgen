import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
  Target,
  TrendingUp,
  XCircle
} from 'lucide-react';

interface Milestone {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'achieved' | 'paused' | 'cancelled';
  achieved_date?: string;
  created_by: {
    id: number;
    name: string;
  };
}

interface MilestonesIndexProps {
  milestones: {
    data: Milestone[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  activeMilestones: number;
  achievedMilestones: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Milestones', href: '/milestones' },
];

export default function MilestonesIndex({
  milestones,
  activeMilestones,
  achievedMilestones,
  totalTargetAmount,
  totalCurrentAmount
}: MilestonesIndexProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'low': 'bg-green-100 text-green-800 border-green-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'critical': 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge variant="outline" className={variants[priority as keyof typeof variants]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'bg-blue-100 text-blue-800 border-blue-200',
      'achieved': 'bg-green-100 text-green-800 border-green-200',
      'paused': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
    };

    const icons = {
      'active': Clock,
      'achieved': CheckCircle,
      'paused': AlertCircle,
      'cancelled': XCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Milestones" />

      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Milestones</h1>
            <p className="text-muted-foreground">Track progress towards organizational goals</p>
          </div>
          <Button asChild>
            <Link href="/milestones/create">
              <Plus className="h-4 w-4 mr-2" />
              New Milestone
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Milestones</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeMilestones}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achieved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{achievedMilestones}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Target Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalTargetAmount)}</div>
              <p className="text-xs text-muted-foreground">Total target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalCurrentAmount)}</div>
              <p className="text-xs text-muted-foreground">{overallProgress.toFixed(1)}% complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              Combined progress across all active milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(totalCurrentAmount)} raised</span>
                <span>{formatCurrency(totalTargetAmount)} target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestones Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {milestones.data.map((milestone) => {
            const progress = calculateProgress(milestone.current_amount, milestone.target_amount);
            const isOverdue = new Date(milestone.target_date) < new Date() && milestone.status === 'active';

            return (
              <Card key={milestone.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {milestone.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      {getPriorityBadge(milestone.priority)}
                      {getStatusBadge(milestone.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(milestone.current_amount)}</span>
                      <span>{formatCurrency(milestone.target_amount)}</span>
                    </div>
                  </div>

                  {/* Target Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Target: {new Date(milestone.target_date).toLocaleDateString()}</span>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>

                  {/* Created By */}
                  <div className="text-xs text-muted-foreground">
                    Created by: {milestone.created_by.name}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/milestones/${milestone.id}`}>
                        View Details
                      </Link>
                    </Button>
                    {milestone.status === 'active' && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/milestones/${milestone.id}/edit`}>
                          Update Progress
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {milestones.data.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No milestones found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
