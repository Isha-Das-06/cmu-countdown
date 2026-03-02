import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';

const TARGET_DATE = "2026-03-12T05:00:00Z";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

// --- Custom cursor ---
const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const cursorX = useSpring(mouseX, { damping: 20, stiffness: 300 });
  const cursorY = useSpring(mouseY, { damping: 20, stiffness: 300 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-cyan/50 pointer-events-none z-[100] mix-blend-screen"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      >
        <div className="absolute inset-0 bg-neon-cyan/10 blur-sm rounded-full" />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[101] shadow-[0_0_10px_#fff]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
};

// --- Countdown block ---
const CountdownBlock = ({ value, label, colorClass }: { value: number; label: string; colorClass: string }) => (
  <motion.div whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl min-w-[100px] sm:min-w-[140px] relative overflow-hidden group">
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
    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] opacity-50 mt-2 sm:mt-4">{label}</span>
  </motion.div>
);

// --- Main App ---
export default function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 1 });
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = +new Date(TARGET_DATE) - +new Date();
      if (diff <= 0) { setIsReleased(true); return { days:0,hours:0,minutes:0,seconds:0,total:0 }; }
      return {
        days: Math.floor(diff / (1000*60*60*24)),
        hours: Math.floor((diff / (1000*60*60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        total: diff
      };
    };
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    setTimeLeft(calc());
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      <CustomCursor />

      {/* Gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      <main className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isReleased ? (
            <motion.div key="countdown" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:1.05, filter:'blur(20px)' }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }} className="flex flex-col items-center w-full">

              {/* Header */}
              <div className="flex items-center gap-3 mb-6 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <GraduationCap className="w-5 h-5 text-neon-cyan"/>
                <span className="text-sm sm:text-base font-medium uppercase tracking-widest text-white/90">Carnegie Mellon University</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-center mb-12 tracking-tight">
                DECISION RELEASE <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">IN</span>
              </h1>

              {/* Countdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl">
                <CountdownBlock value={timeLeft.days} label="Days" colorClass="text-white neon-glow-cyan"/>
                <CountdownBlock value={timeLeft.hours} label="Hours" colorClass="text-white neon-glow-cyan"/>
                <CountdownBlock value={timeLeft.minutes} label="Minutes" colorClass="text-white neon-glow-purple"/>
                <CountdownBlock value={timeLeft.seconds} label="Seconds" colorClass="text-white neon-glow-purple"/>
              </div>

              <div className="mt-16 flex flex-col items-center gap-4">
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <p className="text-sm text-white/40 font-medium tracking-widest uppercase">You will get in</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="released" className="flex flex-col items-center text-center">
              <ShieldCheck className="w-16 h-16 text-neon-cyan mb-8"/>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black mb-6 tracking-tighter neon-glow-cyan">
                DECISION <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple">RELEASED</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/60 max-w-md mb-12 font-light leading-relaxed">
                The protocol has been executed. The future is now accessible to all authorized personnel.
              </p>
              <button className="px-10 py-4 bg-white text-black font-bold rounded-full flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]">
                <Sparkles className="w-5 h-5"/> ACCESS PORTAL
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
