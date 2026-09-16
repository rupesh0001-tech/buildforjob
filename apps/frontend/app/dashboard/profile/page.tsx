"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import { Mail, User as UserIcon, Calendar, ShieldCheck } from '@/lib/icons';
import { motion } from "framer-motion";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [hasFetched, setHasFetched] = React.useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      await dispatch(fetchProfile());
      setHasFetched(true);
    };
    fetchInfo();
  }, [dispatch]);

  if (isLoading || !hasFetched) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-10 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10">
        <p className="text-gray-500 dark:text-gray-400">Unable to load profile information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-black dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information and security.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Basic Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1 space-y-6"
        >
          <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-8 text-center shadow-sm">
            <div className="w-24 h-24 mx-auto rounded-full bg-linear-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl shadow-purple-500/20">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{user.email}</p>
            <div className="flex justify-center">
              <span className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${user.isVerified ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'}`}>
                {user.isVerified ? <ShieldCheck size={14} /> : null}
                {user.isVerified ? 'Verified Account' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Detailed Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-black dark:text-white mb-6">Account Details</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">First Name</p>
                  <p className="text-black dark:text-white font-medium">{user.firstName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                  <UserIcon size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Last Name</p>
                  <p className="text-black dark:text-white font-medium">{user.lastName || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Email Address</p>
                  <p className="text-black dark:text-white font-medium">{user.email}</p>
                </div>
              </div>

              {user.createdAt && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Member Since</p>
                    <p className="text-black dark:text-white font-medium">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
