import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="relative flex flex-col items-center justify-center space-y-6">
        {/* Animated Background Circles */}
        <motion.div
          className="absolute -z-10 h-48 w-48 rounded-full bg-blue-200 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Brand Name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.h1
            className="mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            SkillSphere
          </motion.h1>
          <motion.p
            className="text-sm text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Learning Management System
          </motion.p>
        </motion.div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Loading Progress Bar */}
        <div className="relative h-1 w-64 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-xs text-slate-500"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Preparing your learning experience...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
