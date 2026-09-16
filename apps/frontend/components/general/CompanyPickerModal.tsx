"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Building2, Plus, Check, Loader2 } from '@/lib/icons';
import { motion, AnimatePresence } from "framer-motion";
import { getCompanies, createCompany } from "@/apis/companies.api";
import { toast } from "sonner";

interface CompanyPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (companyName: string) => void;
  selectedValue?: string;
  userOnly?: boolean;
}

export function CompanyPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedValue = "",
  userOnly = false
}: CompanyPickerModalProps) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(selectedValue);
  const [isCreating, setIsCreating] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCompaniesList();
      setSelectedItem(selectedValue);
      setSearchQuery("");
      setIsCreating(false);
      setNewCompanyName("");
    }
  }, [isOpen, selectedValue]);

  const fetchCompaniesList = async () => {
    try {
      setLoading(true);
      const response = await getCompanies(userOnly);
      if (response.success) {
        // Filter based on context:
        // - userOnly = true (Versions Page): only show user-created custom companies (isCustom === true)
        // - userOnly = false (Optimize Page): only show global predefined companies (isCustom === false)
        const filtered = response.data.filter((c: any) => userOnly ? c.isCustom : !c.isCustom);
        setCompanies(filtered);
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
      toast.error("Failed to load companies list");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCompany = async () => {
    if (!newCompanyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }
    try {
      setCreating(true);
      const response = await createCompany(newCompanyName);
      if (response.success) {
        toast.success(`Company "${response.data.name}" added successfully!`);
        await fetchCompaniesList();
        setSelectedItem(response.data.name);
        setIsCreating(false);
        setNewCompanyName("");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to create company";
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedItem) {
      toast.error("Please select a target company");
      return;
    }
    onSelect(selectedItem);
    onClose();
  };

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            className="bg-white dark:bg-[#08080a] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col max-h-[80vh] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5 shrink-0 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white tracking-tight">Select Target Company</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-sans">Choose a target company for your application.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-4 shrink-0 relative z-10">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search target companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:border-primary text-black dark:text-white font-sans"
                />
              </div>
            </div>

            {/* Inline Company Creator */}
            {userOnly && (
              <div className="mt-3 shrink-0 relative z-10">
                {isCreating ? (
                  <div className="flex gap-2 items-center w-full p-2 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-xl">
                    <input
                      type="text"
                      placeholder="Enter custom company name..."
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="flex-1 px-4 py-3.5 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-lg text-sm font-semibold outline-none focus:border-primary text-black dark:text-white"
                    />
                    <button
                      type="button"
                      disabled={creating}
                      onClick={handleAddNewCompany}
                      className="px-4 py-3.5 bg-primary text-white rounded-lg text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {creating ? <Loader2 size={12} className="animate-spin" /> : "Create"}
                    </button>
                    <button
                      type="button"
                      disabled={creating}
                      onClick={() => setIsCreating(false)}
                      className="px-3.5 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCreating(true)}
                    className="w-full py-2.5 px-4 text-left text-xs font-bold text-primary hover:bg-primary/5 hover:underline border border-dashed border-primary/20 bg-primary/5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> + Create New Custom Company
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Company List */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-1 pr-1 scrollbar-thin scrollbar-thumb-gray-200">
              {loading ? (
                <div className="py-12 flex justify-center items-center gap-2 text-xs text-gray-500 font-sans">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  Loading company profiles...
                </div>
              ) : filteredCompanies.length > 0 ? (
                filteredCompanies.map(c => {
                  const isSelected = selectedItem === c.name;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedItem(c.name)}
                      className={`w-full px-4 py-3 text-left rounded-xl transition-all flex items-center justify-between group border cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-black dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-4">
                        <Building2 size={16} className={isSelected ? "text-primary" : "text-gray-400 group-hover:text-black dark:group-hover:text-white"} />
                        <span className="font-semibold text-sm truncate">{c.name}</span>
                      </div>
                      {isSelected ? (
                        <Check size={16} className="text-primary shrink-0" />
                      ) : (
                        c.isCustom && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
                            Custom
                          </span>
                        )
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-gray-500 italic font-sans">
                  No company profiles match your search
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-4 shrink-0 flex gap-3 relative z-10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 dark:bg-white/5 rounded-xl font-semibold text-xs transition-colors text-gray-800 dark:text-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedItem}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-semibold text-xs hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                Confirm Selection
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
