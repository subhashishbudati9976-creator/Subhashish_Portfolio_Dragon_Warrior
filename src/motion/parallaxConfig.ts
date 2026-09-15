export interface ParallaxLayerConfig {
  desktopRange: number;
  tabletRange: number;
}

export const PARALLAX_LAYERS: Record<string, ParallaxLayerConfig> = {
  'hero-atmosphere': {
    desktopRange: 18,
    tabletRange: 8,
  },
  'hero-avatar': {
    desktopRange: 12,
    tabletRange: 6,
  },
};