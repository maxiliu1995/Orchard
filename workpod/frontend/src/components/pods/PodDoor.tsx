import { motion } from 'framer-motion';

interface PodDoorProps {
  isOpen: boolean;
  isUnlocking: boolean;
}

export const PodDoor = ({ isOpen, isUnlocking }: PodDoorProps) => {
  return (
    <div className="relative w-full h-48 perspective-1000">
      <div className="relative w-full h-full preserve-3d">
        {/* Door Frame */}
        <div className="absolute inset-0 border-8 border-gray-300 rounded-lg bg-gray-100" />
        
        {/* Left Door */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2 origin-left bg-white shadow-lg"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isOpen ? -90 : 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-8 bg-gray-300 rounded" />
        </motion.div>

        {/* Right Door */}
        <motion.div
          className="absolute top-0 bottom-0 right-0 w-1/2 origin-right bg-white shadow-lg"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isOpen ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-8 bg-gray-300 rounded" />
        </motion.div>

        {/* Status Light */}
        <motion.div
          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
            isOpen ? 'bg-green-500' : isUnlocking ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          animate={{
            scale: isUnlocking ? [1, 1.2, 1] : 1,
          }}
          transition={{ repeat: isUnlocking ? Infinity : 0, duration: 1 }}
        />

        {/* Interior */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
        >
          Welcome to your pod
        </motion.div>
      </div>
    </div>
  );
}; 