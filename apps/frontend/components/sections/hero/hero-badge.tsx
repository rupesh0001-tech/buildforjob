"use client";
import { motion } from "framer-motion";
import { Sparkles } from '@/lib/icons';
import { Badge } from "@/components/ui/badge";

export function HeroBadge() {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
      }} 
      className="flex justify-center mb-6"
    >
      <Badge variant="purple">
        <Sparkles size={14} />
        <span> New templates added </span>
      </Badge>
    </motion.div>
  );
}
