import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const cardFlip: Variants = {
  hidden: { rotateY: 0 },
  visible: {
    rotateY: 180,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export const cardEntry = (i: number): Variants => ({
  hidden: {
    x: (Math.random() - 0.5) * 800,
    y: (Math.random() - 0.5) * 600,
    rotate: (Math.random() - 0.5) * 360,
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      delay: i * 0.02,
    },
  },
});

export const glowBurst: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: [0, 1, 0],
    scale: [0.5, 2.5, 3.5],
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const springButton = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};
