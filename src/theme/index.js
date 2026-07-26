/**
 * Public entry point for the design system.
 *
 * Safe to import from server components — it deliberately does *not* re-export
 * `ThemeProvider` / `useTheme`, so pulling in a colour token never drags a
 * client boundary along with it. Import those from `@/theme/ThemeProvider`.
 */

export {
  brand,
  brandColor,
  button,
  layout,
  motion,
  palette,
  scene,
  shadow,
  surface,
  surfaces,
  theme,
  typography,
  DEFAULT_TONE,
} from './theme';

export { default } from './theme';
