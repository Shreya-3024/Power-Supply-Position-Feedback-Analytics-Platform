import { Clock, Activity, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const configs: any = {
      'Pending': {
        icon: Clock,
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
        pulse: true
      },
      'In Progress': {
        icon: Activity,
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        pulse: true
      },
      'Resolved': {
        icon: CheckCircle,
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        pulse: false
      },
      'Closed': {
        icon: XCircle,
        color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
        pulse: false
      }
    };
    return configs[status] || configs['Pending'];
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${config.color}`}>
      <Icon className={`w-4 h-4 ${config.pulse ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
}
