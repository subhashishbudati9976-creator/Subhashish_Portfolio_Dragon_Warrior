import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-motion-reveal]';

export function useRevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('motion-ready');

    const revealElements = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(element => element.classList.add('motion-visible'));
      return () => root.classList.remove('motion-ready');
    }

    // High performance one-shot reveal observer to prevent scroll paint-thrashing
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add('motion-visible');
            // Unobserve once revealed — prevents unnecessary style recalcs during fast scroll
            observer.unobserve(element);
          }
        });
      },
      { rootMargin: '0px 0px -4% 0px', threshold: 0.05 }
    );

    revealElements.forEach(element => observer.observe(element));

    return () => {
      observer.disconnect();
      root.classList.remove('motion-ready');
    };
  }, []);
}