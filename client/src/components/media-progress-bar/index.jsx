import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function MediaProgressbar({ isMediaUploading }) {
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isMediaUploading]);

  if (!showProgress) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-8 space-y-3"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Loader2 className="h-10 w-10 text-blue-600" />
      </motion.div>
      <motion.p
        className="text-sm font-medium text-gray-600"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Uploading media, please wait...
      </motion.p>
    </motion.div>
  );
}

export default MediaProgressbar;
