import { useEffect } from 'react';

// Progressive enhancement: content stays visible if animation APIs are unavailable.
export function usePortfolioMotion(route: string, ready: boolean) {
  useEffect(() => {
    if (!ready || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        const animation = entry.target.animate(
          [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 560, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.05 });
    document.querySelectorAll('.portfolio-public main section > div, .portfolio-public footer > div').forEach((element) => observer.observe(element));
    const stop = () => { if (preference.matches) { observer.disconnect(); animations.forEach((animation) => animation.cancel()); } };
    preference.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener('change', stop);
    };
  }, [route, ready]);
}
