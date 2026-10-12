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
  const rest: LooseDictionary = { ...props };
  let shouldExtract: (key: string) => boolean;
  if (excludeStyleKeys) {
    const excludeKeys = new Set(excludeStyleKeys as unknown as string[]);
    shouldExtract = (key) => rest[key] !== undefined && !excludeKeys.has(key);
  } else {
    shouldExtract = (key) => rest[key] !== undefined;
  }

  const style: Record<string, unknown> = {};
  // rest配下のプロパティをstyleに移動
  for (const [xKey, key] of Object.entries<string>(styleKeyMap)) {
    if (shouldExtract(xKey)) {
      style[key] = rest[xKey];
      delete rest[xKey];
    }
  }

  return {
    props: rest as Omit<P, keyof StyleProps<M>>,
    style: style as CSSProperties,
  };
}
