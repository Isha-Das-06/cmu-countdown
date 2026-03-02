/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Rocket, Sparkles, ShieldCheck, GraduationCap } from 'lucide-react';

// --- CONFIGURATION ---
const TARGET_DATE = "2026-03-12T05:00:00Z";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

// ---------------- CUSTOM CURSOR ----------------
const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-cyan/50 pointer-events-none z-[100] mix-blend-screen will-change-transform"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      >
        <div className="absolute inset-0 bg-neon-cyan/10 blur-sm rounded-full" />
      </motion.div>

      {/* Inner cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[101] shadow-[0_0_10px_#fff] translate-z-0 will-change-transform"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Cursor trails */}
      <div className="fixed inset-0 pointer-events-none z-[99]">
        {Array.from({ length: 3 }).map((_, i) => (
          <CursorTrail key={i} mouseX={mouseX} mouseY={mouseY} index={i} />
        ))}
      </div>
    </>
  );
};

const CursorTrail = ({ mouseX, mouseY, index }: { mouseX: any; mouseY: any; index: number }) => {
  const springX = useSpring(mouseX, { damping: 20 + index * 2, stiffness: 200 - index * 20, mass: 0.8 });
  const springY = useSpring(mouseY, { damping: 20 + index * 2, stiffness: 200 - index * 20, mass: 0.8 });

  return (
    <motion.div
      className="absolute w-1 h-1 bg-neon-purple/40 rounded-full blur-[1px] will-change-transform"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    />
  );
};

// ---------------- PARTICLE BACKGROUND ----------------
const ParticleBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-white rounded-full opacity-20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -1000], opacity: [0.2, 0.5, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

// ---------------- COUNTDOWN CARD ----------------
const CountdownBlock = ({ value, label, colorClass }: { value: number; label: string; colorClass: string }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl min-w-[100px] sm:min-w-[140px] transition-all duration-300 relative overflow-hidden group"
  >
    <div className="relative h-12 sm:h-16 flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`text-4xl sm:text-6xl font-display font-bold ${colorClass} tracking-tighter block`}
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] opacity-50 mt-2 sm:mt-4">
      {label}
    </span>
  </motion.div>
);

// ---------------- APP COMPONENT ----------------
export default function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 1 });
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(TARGET_DATE) - +new Date();
      if (difference <= 0) {
        setIsReleased(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference,
      };
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      <CustomCursor />

      {/* Background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <ParticleBackground />

      <main className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isReleased ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full"
            >
              <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl">
                <CountdownBlock value={timeLeft.days} label="Days" colorClass="text-white neon-glow-cyan" />
                <CountdownBlock value={timeLeft.hours} label="Hours" colorClass="text-white neon-glow-cyan" />
                <CountdownBlock value={timeLeft.minutes} label="Minutes" colorClass="text-white neon-glow-purple" />
                <CountdownBlock value={timeLeft.seconds} label="Seconds" colorClass="text-white neon-glow-purple" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="released"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-8 p-6 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 shadow-[0_0_50px_rgba(0,243,255,0.2)]"
              >
                <ShieldCheck className="w-16 h-16 text-neon-cyan" />
              </motion.div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black mb-6 tracking-tighter neon-glow-cyan">
                DECISION <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple">
                  RELEASED
                </span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
