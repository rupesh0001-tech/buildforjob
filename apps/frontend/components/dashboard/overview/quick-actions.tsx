import { FilePlus, Edit, Search, Github } from '@/lib/icons';
import Link from 'next/link';

const actions = [
  {
    title: "Create Resume",
    desc: "Build a new targeted ATS-friendly resume from scratch.",
    icon: <FilePlus size={20} />,
    color: "primary",
    href: "/dashboard/resume-builder"
  },
  {
    title: "Write Cover Letter",
    desc: "Generate a custom AI cover letter for your next job.",
    icon: <Edit size={20} />,
    color: "blue",
    href: "/dashboard/cover-letter"
  },
  {
    title: "ATS Checker",
    desc: "Check your resume score and get improvement tips.",
    icon: <Search size={20} />,
    color: "emerald",
    href: "/dashboard/resumes/ats"
  },
  {
    title: "Fetch GitHub",
    desc: "Import projects and skills directly from your GitHub.",
    icon: <Github size={20} />,
    color: "orange",
    href: "/dashboard/connect/github"
  }
];

export function QuickActions() {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link 
            key={action.title}
            href={action.href}
            className="text-left flex flex-col items-start p-6 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-black/40 hover:border-primary/50 dark:hover:border-primary/50 transition-all group shadow-sm backdrop-blur-xl"
          >
            <div className={`p-3 rounded-xl transition-all group-hover:scale-110
              ${action.color === 'primary' ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' : ''}
              ${action.color === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
              ${action.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
              ${action.color === 'orange' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : ''}
              mb-4`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-black dark:text-white mb-1">{action.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-left line-clamp-2">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
