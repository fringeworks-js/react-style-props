import type { LooseDictionary } from '@fringeworks/types';
import type { CSSProperties } from 'react';
import {
  createStyleKeyEntries,
  extractStyleByEntries,
} from '../_internal/stylePropsCore';
import type {
  StyledProps,
  StyleKeyMap,
  StyleProps,
  XStyleKeyMap,
} from '../types';
import type { ExtractStylePropsOptions } from './types';

/**
 * スタイル関連のプロパティを取り出す
 *
 * - 値が`undefined`のプロパティは取り出さずに残す
 * - 除外したプロパティ（`excludeStyleKeys`）は取り出さずに残す
 * @param props プロパティ
 * @param options オプション
 * @returns スタイル関連のプロパティを取り除いたプロパティと、取り出したスタイル
 */
export default function extractStyleProps<
  P extends LooseDictionary & StyleProps<M, E>,
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
>(
  props: P,
  options: ExtractStylePropsOptions<M, E> = {},
): { props: StyledProps<P, M, E>; style: CSSProperties } {
  const { styleKeyMap, excludeStyleKeys } = options;
  const { props: rest, style } = extractStyleByEntries(
    props,
    createStyleKeyEntries(styleKeyMap, excludeStyleKeys),
  );
  return { props: rest as StyledProps<P, M, E>, style };
}
