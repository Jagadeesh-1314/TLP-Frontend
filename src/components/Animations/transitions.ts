export const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  ease: [0.6, 0.01, 0.05, 0.95],
};

export const easeTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5,
};

export const bounceTransition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

export const smoothTransition = {
  type: "tween",
  ease: [0.6, 0.01, 0.05, 0.95],
  duration: 0.6,
};
