"use client";
import React, { useEffect } from "react";
import { Plus, Sparkles, FileText, Download, Eye, MoreVertical, Trash2, Calendar, FilePlus, Loader2, AlertCircle } from '@/lib/icons';
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button1 } from "@/components/general/buttons/button1";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllResumes, deleteResumeById } from "@/lib/store/features/resume-slice";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ConfirmModal } from "@/components/general/ConfirmModal";

function ResumeCardMenu({ resumeId, onDeleteRequest }: { resumeId: string; onDeleteRequest: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onDeleteRequest();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#12121a] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden"
            >
              <Link 
                href={`/dashboard/resume-builder?id=${resumeId}`}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <Sparkles size={14} className="text-purple-500" /> Edit Project
              </Link>
              <button 
                onClick={handleDeleteClick}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
              >
                <Trash2 size={14} /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResumesPage() {
  const [showModal, setShowModal] = React.useState(false);
  const [isMagic, setIsMagic] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [company, setCompany] = React.useState("");

  const dispatch = useAppDispatch();
  const { resumesList, isLoading } = useAppSelector((state) => state.resume);
  
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllResumes());
  }, [dispatch]);

  const handleStart = (magic: boolean) => {
    setIsMagic(magic);
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ... (keep existing action cards) ... */}
        <motion.div 
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-black/40 rounded-2xl p-6 border border-gray-300 dark:border-white/10 shadow-sm flex flex-col justify-between backdrop-blur-xl"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary">
               <FilePlus size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">Manual Builder</h3>
              <p className="text-sm text-gray-500 mt-1">Start with a blank canvas and build your resume from scratch.</p>
            </div>
          </div>
          <Button1 
            onClick={() => handleStart(false)} 
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold mt-8"
          >
             Create New Resume <Plus size={16} />
          </Button1>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-black/40 rounded-2xl p-6 border border-gray-300 dark:border-white/10 shadow-sm flex flex-col justify-between backdrop-blur-xl"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
               <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">Profile-to-Resume</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Instantly create a professional resume based on your profile data.</p>
            </div>
          </div>
          <Button1 
            onClick={() => handleStart(true)} 
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold mt-8"
          >
             Create via Profile <Plus size={16} />
          </Button1>
        </motion.div>
      </div>

      {/* Past Resumes Section */}
      <div className="space-y-4">
         <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-500 uppercase tracking-wider">Recent Creations</h2>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {isLoading ? (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="animate-spin mb-2" size={32} />
                <p className="text-sm font-medium">Loading your resumes...</p>
             </div>
           ) : resumesList.length === 0 ? (
              <div className="col-span-full text-center py-10 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No resumes created yet.</p>
              </div>
           ) : (
             resumesList.map((resume, idx) => (
               <motion.div 
                 key={resume.id}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.05 }}
                 className="group bg-white dark:bg-black/40 rounded-2xl border border-gray-300 dark:border-white/10 p-5 shadow-xs hover:border-primary/50 transition-all backdrop-blur-xl"
               >
                 <div className="flex items-start justify-between mb-4">
                   <div className="p-3 bg-gray-50 dark:bg-white/10 rounded-xl group-hover:text-primary transition-colors">
                     <FileText size={20} />
                   </div>
                   <ResumeCardMenu 
                     resumeId={resume.id} 
                     onDeleteRequest={() => setDeleteId(resume.id)} 
                   />
                 </div>
                 
                 <div className="space-y-1">
                   <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-black dark:text-white line-clamp-1">{resume.title}</h4>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>Edited {formatDistanceToNow(new Date(resume.updatedAt))} ago</span>
                   </div>
                 </div>

                 <div className="mt-6 flex gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                   <Link 
                    href={`/dashboard/resume-builder?id=${resume.id}`} 
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-50 dark:bg-white/10 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/20 transition-all"
                   >
                      <Eye size={14} /> Edit
                   </Link>
                   <button className="flex-1 flex items-center justify-center gap-2 p-2 bg-primary/5 dark:bg-primary/10 rounded-lg text-xs font-medium text-primary hover:bg-primary hover:text-white transition-all">
                     <Download size={14} /> PDF
                   </button>
                 </div>
               </motion.div>
             ))
           )}

           {/* Add New Mock Card */}
            <div 
              onClick={() => handleStart(false)}
              className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-primary hover:border-primary/50 transition-all bg-gray-50/50 dark:bg-black/40 backdrop-blur-xl cursor-pointer"
            >
                <Plus size={24} />
                <span className="font-semibold uppercase tracking-wider text-xs">New Resume</span>
            </div>
         </div>
      </div>

      {/* New Resume Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white dark:bg-black/80 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-300 dark:border-white/10 space-y-6 backdrop-blur-2xl"
            >
              <div>
                <h3 className="text-xl font-bold text-black dark:text-white">Project Details</h3>
                <p className="text-sm text-gray-500 mt-1">Set a name for your new resume project.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-1">Resume Title *</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-white/10 focus:border-primary outline-none rounded-xl text-sm font-medium transition-all" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-1">Company Name (Optional)</label>
                  <input 
                    type="text" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-white/10 focus:border-primary outline-none rounded-xl text-sm font-medium transition-all" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-3 bg-gray-50 dark:bg-white/5 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <Link 
                  href={`/dashboard/resume-builder?title=${encodeURIComponent(title)}${company ? `&company=${encodeURIComponent(company)}` : ""}${isMagic ? "&magic=true" : ""}`}
                  className={`flex-1 overflow-hidden rounded-xl py-3 bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all text-center ${!title ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    Continue
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await dispatch(deleteResumeById(deleteId)).unwrap();
            toast.success("Resume deleted successfully");
          } catch (error: any) {
            toast.error(error || "Failed to delete resume");
          }
          setDeleteId(null);
        }}
        title="Delete Resume"
        description="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
