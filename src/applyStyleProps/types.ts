import type { StyleProxyOptions } from '@fringeworks/react-style-proxy';
import type {
  ExtractStylePropsOptions,
  StyleKeyMap,
  XStyleKeyMap,
} from '../types';

/**
 * applyStylePropsのオプション
 */
export type ApplyStylePropsOptions<M extends StyleKeyMap = XStyleKeyMap> = Omit<
  StyleProxyOptions,
  'styleAsDefault'
> &
  ExtractStylePropsOptions<M>;
