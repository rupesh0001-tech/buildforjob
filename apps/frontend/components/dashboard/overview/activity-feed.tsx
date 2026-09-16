import { FileText, Mail, ShieldCheck, UserCircle } from '@/lib/icons';

const activities = [
  {
    id: 1,
    type: 'resume',
    title: 'Resume Version 3.0 Generated',
    desc: 'Targeted for Senior Frontend Role at Google',
    time: '2 hours ago',
    icon: <FileText size={16} />,
    color: 'purple'
  },
  {
    id: 2,
    type: 'cover-letter',
    title: 'Cover Letter Written',
    desc: 'Application for Meta Fullstack Engineer',
    time: 'Yesterday',
    icon: <Mail size={16} />,
    color: 'blue'
  },
  {
    id: 3,
    type: 'ats',
    title: 'ATS Scan Completed',
    desc: 'Resume Score: 92/100',
    time: 'Yesterday',
    icon: <ShieldCheck size={16} />,
    color: 'emerald'
  },
  {
    id: 4,
    type: 'profile',
    title: 'Profile Updated',
    desc: 'Added 3 new skills to your profile',
    time: '3 days ago',
    icon: <UserCircle size={16} />,
    color: 'orange'
  }
];

export function ActivityFeed() {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 p-6 shadow-sm flex flex-col h-full relative overflow-hidden backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider">Recent Activity</h3>
      </div>
      
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 relative">
            {activity.id !== activities.length && (
              <div className="absolute left-[19px] top-8 bottom-[-24px] w-[2px] bg-gray-100 dark:bg-white/5" />
            )}
            
            <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center
              ${activity.color === 'purple' ? 'bg-primary/5 dark:bg-primary/20 text-primary' : ''}
              ${activity.color === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
              ${activity.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
              ${activity.color === 'orange' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : ''}
            `}>
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-sm font-semibold text-black dark:text-white truncate">
                  {activity.title}
                </h4>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-500 whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {activity.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-8 text-xs font-semibold text-center text-primary hover:brightness-125 transition-colors">
        View All Activity
      </button>
    </div>
  );
}
