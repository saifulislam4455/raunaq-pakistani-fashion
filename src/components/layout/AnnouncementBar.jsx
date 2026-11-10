
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="relative flex min-h-[34px] items-center justify-center overflow-hidden bg-[#32151f] px-3 text-[#ead2a5]">
      {/* Animated golden light */}
      <motion.div
        initial={{ x: "-120%" }}
        animate={{ x: "220%" }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-25deg] bg-gradient-to-r from-transparent via-[#d9b879]/15 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-wrap items-center justify-center gap-2 text-center"
      >
        <Sparkles size={11} className="text-[#d9b879]" />

        <span className="text-[8px] font-semibold tracking-[2px] sm:text-[9px] sm:tracking-[3px]">
          ROOTED IN HERITAGE
        </span>

        <motion.span
          animate={{ rotate: [0, 180, 360], scale: [1, 1.25, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="text-[11px] text-[#d9b879]"
        >
          ✦
        </motion.span>

        <span className="text-[8px] font-semibold tracking-[2px] sm:text-[9px] sm:tracking-[3px]">
          REIMAGINED FOR TODAY
        </span>

        <Sparkles size={11} className="text-[#d9b879]" />
      </motion.div>
    </div>
  );
}
