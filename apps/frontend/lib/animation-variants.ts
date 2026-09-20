import { Variants } from "framer-motion";

// Custom smooth deceleration cubic-bezier curve for premium SaaS motion
export const gentleEase = [0.16, 1, 0.3, 1] as const;

// Default viewport reveal settings for non-repeating scroll entrance
export const defaultViewport = {
  once: true,
  margin: "-60px",
};

// Staggered Container Variant
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Fade Up Variant
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: gentleEase,
    },
  },
};

// Fade Scale Up Variant
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: gentleEase,
    },
  },
};

// Slide In Left Variant (for floating cards)
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -28, y: 8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.65,
      ease: gentleEase,
    },
  },
};

// Slide In Right Variant (for floating cards)
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 28, y: 8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.65,
      ease: gentleEase,
    },
  },
};

// Restrained Icon Entrance Variant
export const iconScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: gentleEase,
    },
  },
};
