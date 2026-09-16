"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Building2, ChevronDown, Loader2 } from '@/lib/icons';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CompanyPickerModal } from "./CompanyPickerModal";

interface OptimizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptimize: (companyName: string, roles: string[]) => Promise<void>;
  isOptimizing: boolean;
  title?: string;
  description?: string;
}

const POPULAR_ROLES = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Engineer",
  "Mobile Engineer",
  "DevOps Engineer",
  "Machine Learning Engineer"
];

export function OptimizeModal({
  isOpen,
  onClose,
  onOptimize,
  isOptimizing,
  title = "Optimize for Company",
  description = "Tailor and optimize your content for a specific target company and role."
}: OptimizeModalProps) {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyPickerOpen, setCompanyPickerOpen] = useState(false);

  // Role Selection (Max 3)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [customRoleInput, setCustomRoleInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedCompany("");
      setSelectedRoles([]);
      setCustomRoleInput("");
      setCompanyPickerOpen(false);
    }
  }, [isOpen]);

  const handleRoleCheckboxChange = (role: string, checked: boolean) => {
    if (checked) {
      if (selectedRoles.length >= 3) {
        toast.warning("You can select up to 3 roles maximum.");
        return;
      }
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    }
  };

  const handleAddCustomRole = () => {
    const trimmed = customRoleInput.trim();
    if (!trimmed) return;
    if (selectedRoles.includes(trimmed)) {
      toast.warning("This role is already selected.");
      return;
    }
    if (selectedRoles.length >= 3) {
      toast.warning("You can select up to 3 roles maximum.");
      return;
    }
    setSelectedRoles([...selectedRoles, trimmed]);
    setCustomRoleInput("");
  };

  const handleRemoveRole = (role: string) => {
    setSelectedRoles(selectedRoles.filter(r => r !== role));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) {
      toast.error("Please select a target company");
      return;
    }
    if (selectedRoles.length === 0) {
      toast.error("Please select or add at least one role");
      return;
    }
    onOptimize(selectedCompany, selectedRoles);
  };

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <div key="optimize-modal-overlay" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 15 }}
            className="bg-white dark:bg-[#08080a] rounded-2xl p-7 max-w-xl w-full shadow-2xl border border-gray-200 dark:border-white/10 relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-7 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#001BB7]/8 dark:bg-blue-500/10 rounded-xl text-[#001BB7] dark:text-blue-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">{title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0 ml-4"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-y-auto space-y-5">
              
              {/* Company Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 px-1">Target Company *</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                  <button
                    type="button"
                    onClick={() => setCompanyPickerOpen(true)}
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all text-left flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{selectedCompany || <span className="text-gray-400">Select Target Company...</span>}</span>
                    <ChevronDown size={15} className="text-gray-400 shrink-0 ml-2" />
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 px-1">
                  Target Roles * (up to 3)
                </label>

                {/* Popular Roles Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_ROLES.map(role => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <label
                        key={role}
                        className={`flex items-center gap-2.5 px-3 py-3 border rounded-xl cursor-pointer transition-all select-none ${
                          isSelected
                            ? "border-[#001BB7]/30 bg-[#001BB7]/5 dark:bg-blue-500/5"
                            : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRoleCheckboxChange(role, e.target.checked)}
                          className="rounded border-gray-300 dark:border-white/20 text-[#001BB7] focus:ring-[#001BB7]/30 w-3.5 h-3.5 shrink-0"
                        />
                        <span className={`text-xs font-medium truncate ${isSelected ? "text-[#001BB7] dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>{role}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Custom Role Input */}
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Add custom role..."
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomRole())}
                    className="flex-1 px-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomRole}
                    className="px-4 py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-all cursor-pointer border border-gray-200 dark:border-white/10 shrink-0"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Roles Tags */}
                {selectedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRoles.map(role => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-medium"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(role)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Form buttons */}
              <div className="flex gap-3 pt-5 border-t border-gray-100 dark:border-white/5 shrink-0">
                <button
                  type="button"
                  disabled={isOptimizing}
                  onClick={onClose}
                  className="flex-1 py-4 bg-gray-100 dark:bg-white/5 rounded-xl font-medium text-sm transition-colors text-gray-700 dark:text-gray-400 disabled:opacity-50 cursor-pointer border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOptimizing}
                  className="flex-1 py-4 bg-[#001BB7] text-white rounded-xl font-medium text-sm hover:bg-[#0020d4] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#001BB7]/20"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Run Optimization
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    <CompanyPickerModal
      isOpen={companyPickerOpen}
      onClose={() => setCompanyPickerOpen(false)}
      onSelect={(companyName) => setSelectedCompany(companyName)}
      selectedValue={selectedCompany}
    />
    </>
  );
}
