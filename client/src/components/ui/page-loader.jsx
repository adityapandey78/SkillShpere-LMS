import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
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
          className="text-sm text-slate-600"
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
