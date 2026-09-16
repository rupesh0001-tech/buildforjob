"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from '@/lib/icons';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary" | "warning";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-red-500 bg-red-500/10",
          button: "bg-red-500 hover:bg-red-600 shadow-red-500/20",
        };
      case "warning":
        return {
          icon: "text-yellow-500 bg-yellow-500/10",
          button: "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20",
        };
      default:
        return {
          icon: "text-primary bg-primary/10",
          button: "bg-primary hover:bg-primary/90 shadow-primary/20",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0c0c0e] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            <div className="p-6 text-center">
              <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${styles.icon}`}>
                <AlertCircle size={28} />
              </div>

              <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-white font-semibold text-sm shadow-lg transition-all active:scale-95 ${styles.button}`}
              >
                {confirmText}
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
