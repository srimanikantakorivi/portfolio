import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : undefined;
    observer?.observe(document.documentElement);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);
  return <div ref={bar} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-[#4D5E4B]" style={{ transform: 'scaleX(0)' }} />;
}
