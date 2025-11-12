import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center relative">
      {/* Floating Bubbles */}
      <motion.div
        className="absolute w-16 h-16 bg-blue-400 rounded-full opacity-20 blur-xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ left: '20%', top: '30%' }}
      />
      
      <motion.div
        className="absolute w-20 h-20 bg-indigo-400 rounded-full opacity-20 blur-xl"
        animate={{
          y: [0, 40, 0],
          x: [0, -25, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{ right: '25%', top: '40%' }}
      />
      
      <motion.div
        className="absolute w-12 h-12 bg-purple-400 rounded-full opacity-20 blur-xl"
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ left: '50%', bottom: '35%' }}
      />

      <div className="flex flex-col items-center space-y-4 relative z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className="h-12 w-12 text-blue-600" />
        </motion.div>
        <motion.p
          className="text-lg font-medium text-slate-700"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

export default PageLoader;
