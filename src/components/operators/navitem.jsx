import { motion, AnimatePresence } from "framer-motion";

export const NavItem = ({ icon, label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center textSecondary cursor-pointer hover:opacity-80"
    >
      {/* Icon with color transition */}
      <motion.div
        className=""
        // animate={{ color: active ? "#f5d000" : "#4b5563" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className=" text-icon">{icon}</div>
      </motion.div>

      <div className="relative flex flex-col items-center">
        {/* Label with color & fontWeight animation */}
        <motion.span
          animate={{
            color: active ? "#f5d000" : "#4b5563",
            fontWeight: active ? 600 : 500,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="textPrimary mb-1"
        >
        <div className="textPrimary">{label}</div>  
        </motion.span>

        {/* Animated underline */}
        <AnimatePresence>
          {active && (
            <motion.span
              layoutId="nav-underline"
              className="absolute bottom-0 h-1 bg-primary rounded-full "
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
