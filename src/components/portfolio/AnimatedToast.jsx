import { motion } from "framer-motion";

const AnimatedToast = ({ message }) => (
    <motion.div
        initial={{ scale: 0.6, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
    >
        {message}
    </motion.div>
);

export default AnimatedToast;