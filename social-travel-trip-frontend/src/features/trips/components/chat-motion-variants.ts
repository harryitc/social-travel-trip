// Motion variants for chat animations
export const chatMotionVariants = {
  // Message animations
  messageContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },

  message: {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  },

  // New message with special entrance
  newMessage: {
    hidden: { 
      opacity: 0, 
      y: 30, 
      scale: 0.9,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.6
      }
    }
  },

  // Message bubble hover effect
  messageBubble: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    hover: { 
      scale: 1.02, 
      y: -2,
      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  },

  // Typing indicator
  typingIndicator: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  },

  // Typing dots animation
  typingDot: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Reaction picker
  reactionPicker: {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 10 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 10,
      transition: { duration: 0.15 }
    }
  },

  // Individual reaction button
  reactionButton: {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    hover: {
      scale: 1.3,
      transition: { duration: 0.1 }
    },
    tap: {
      scale: 0.9,
      transition: { duration: 0.05 }
    }
  },

  // Group list animations
  groupList: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  groupItem: {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      x: 4,
      transition: { duration: 0.2 }
    }
  },

  // Scroll to bottom button
  scrollButton: {
    hidden: { 
      opacity: 0, 
      scale: 0.5, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: 20,
      transition: { duration: 0.2 }
    },
    bounce: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 }
    }
  },

  // File upload progress
  fileUpload: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    uploading: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    success: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.4 }
    }
  },

  // Input area
  inputArea: {
    focus: {
      boxShadow: "0 0 0 2px rgba(147, 51, 234, 0.2)",
      transition: { duration: 0.2 }
    },
    blur: {
      boxShadow: "0 0 0 0px rgba(147, 51, 234, 0)",
      transition: { duration: 0.2 }
    }
  },

  // Modal animations
  modal: {
    hidden: { 
      opacity: 0, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  },

  // Backdrop
  backdrop: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }
};

// Utility function for stagger animations
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

// Utility function for slide animations
export const slideVariants = (direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
  const directions = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: 20 },
    down: { x: 0, y: -20 }
  };

  return {
    hidden: { 
      opacity: 0, 
      ...directions[direction]
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
};
