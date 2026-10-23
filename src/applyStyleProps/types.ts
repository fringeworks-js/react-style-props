import type { StyleProxyOptions } from '@fringeworks/react-style-proxy';
import type { ExtractStylePropsOptions } from '../extractStyleProps';
import type { StyleKeyMap, XStyleKeyMap } from '../types';

/**
 * applyStylePropsのオプション
 *
 * - スタイル関連のプロパティは常に既定値として扱うため、`styleAsDefault`は指定できない
 */
export type ApplyStylePropsOptions<
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
> = Omit<StyleProxyOptions, 'styleAsDefault'> & ExtractStylePropsOptions<M, E>;
