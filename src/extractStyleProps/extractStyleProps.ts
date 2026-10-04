import type { LooseDictionary } from '@fringeworks/types';
import type { CSSProperties } from 'react';
import { DEFAULT_STYLE_KEY_MAP } from '../constants';
import type {
  ExtractStylePropsOptions,
  StyleProps,
  XStyleKeyMap,
} from '../types';

/**
 * スタイル関連のプロパティを取得する
 *
 * @param props プロパティ
 * @param options オプション
 * @returns
 */
export default function extractStyleProps<
  P extends LooseDictionary & StyleProps<M>,
  M extends Record<string, keyof CSSProperties> = XStyleKeyMap,
>(props: P, options: ExtractStylePropsOptions<M> = {}) {
  const { styleKeyMap = DEFAULT_STYLE_KEY_MAP, excludeStyleKeys } = options;
  const rest: Omit<P, keyof StyleProps<M>> = { ...props };
  let shouldExtract;
  if (excludeStyleKeys) {
    const excludeKeys = new Set(excludeStyleKeys as unknown as string[]);
    shouldExtract = (p, k) => p[k] !== undefined && !excludeKeys.has(k);
  } else {
    shouldExtract = (p, k) => p[k] !== undefined;
  }

  const style: CSSProperties = {};
  // rest配下のプロパティをstyleに移動
  for (const xKey in styleKeyMap) {
    if (shouldExtract(rest, xKey)) {
      const key = styleKeyMap[xKey];
      style[key] = rest[xKey];
      delete rest[xKey];
    }
  }

  return { props: rest, style };
}
