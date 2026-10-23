import type { LooseDictionary } from '@fringeworks/types';
import { createStylePropsApplier } from '../_internal/stylePropsCore';
import type {
  StyledProps,
  StyleKeyMap,
  StyleProps,
  XStyleKeyMap,
} from '../types';
import type { ApplyStylePropsOptions } from './types';

/**
 * スタイル関連のプロパティをスタイルプロパティ(styleやcss)へ適用する
 *
 * - スタイル関連のプロパティは既定値として扱い、スタイルプロパティの指定を優先する
 * - スタイル関連のプロパティが無い場合は、スタイルプロパティを追加しない
 * @param props プロパティ
 * @param options オプション
 * @returns スタイル関連のプロパティを取り除き、スタイルプロパティへ適用したプロパティ
 */
export default function applyStyleProps<
  P extends LooseDictionary & StyleProps<M, E>,
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
>(props: P, options: ApplyStylePropsOptions<M, E> = {}): StyledProps<P, M, E> {
  return createStylePropsApplier(options)(props) as StyledProps<P, M, E>;
}
