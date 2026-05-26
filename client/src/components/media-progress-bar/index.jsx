import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

function MediaProgressbar({ isMediaUploading }) {
  if (!isMediaUploading) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-4 w-4 text-blue-600" />
      </motion.div>
      <span className="text-sm font-medium text-blue-700">
        Uploading to cloud, please wait…
      </span>
    </div>
  );
}

export default MediaProgressbar;
