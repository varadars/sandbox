import { CircleNotch } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function Loading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
      >
        <CircleNotch
          size={32}
          color="var(--primary)"
        />
      </motion.div>
    </div>
  );
}
