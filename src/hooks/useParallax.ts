import { useEffect } from 'react';
import { PARALLAX_LAYERS } from '../motion/parallaxConfig';

const PARALLAX_SELECTOR = '[data-parallax]';
const TABLET_BREAKPOINT = 1024;
const MOBILE_BREAKPOINT = 767;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function useParallax() {
  useEffect(() => {
    const hero = document.getElementById('hero');
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>(PARALLAX_SELECTOR)
    ).filter(layer => PARALLAX_LAYERS[layer.dataset.parallax ?? '']);

    if (!hero || layers.length === 0) return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    let heroVisible = false;
    let frameId: number | null = null;

    const resetLayers = () => {
      layers.forEach(layer => {
        layer.style.transform = '';
      });
    };

    const isEnabled = () =>
      !reducedMotionQuery.matches && !mobileQuery.matches;

    const updateLayers = () => {
      frameId = null;

      if (!heroVisible || !isEnabled()) {
        resetLayers();
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const heroCenter = heroRect.top + heroRect.height / 2;
      const travel = (window.innerHeight + heroRect.height) / 2;
      const progress = clamp((viewportCenter - heroCenter) / travel, -1, 1);
      const isTablet = window.innerWidth <= TABLET_BREAKPOINT;
      const shortTabletViewport = isTablet && window.innerHeight < 700;

      layers.forEach(layer => {
        const config = PARALLAX_LAYERS[layer.dataset.parallax ?? ''];
        if (!config) return;

        const range =
          layer.dataset.parallax === 'hero-avatar' && shortTabletViewport
            ? 0
            : isTablet
              ? config.tabletRange
              : config.desktopRange;
        const offset = progress * range;
        layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
    };

    const requestUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateLayers);
    };

    const handleScroll = () => {
      if (isEnabled() && heroVisible) requestUpdate();
    };

    const handleViewportChange = () => {
      resetLayers();
      if (isEnabled() && heroVisible) requestUpdate();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible && isEnabled()) {
          requestUpdate();
        } else {
          resetLayers();
        }
      },
      { rootMargin: '100% 0px', threshold: 0 }
    );

    visibilityObserver.observe(hero);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleViewportChange);
    reducedMotionQuery.addEventListener('change', handleViewportChange);
    mobileQuery.addEventListener('change', handleViewportChange);

    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleViewportChange);
      reducedMotionQuery.removeEventListener('change', handleViewportChange);
      mobileQuery.removeEventListener('change', handleViewportChange);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      resetLayers();
    };
  }, []);
}