import type { PrefixedUnion } from '@fringeworks/types';
import type { CSSProperties } from 'react';

/**
 * スタイル関連のプロパティのキーとスタイルのキーのマッピング
 *
 * - 並び順にスタイルへ反映するため、省略形のキーは個別指定のキーより前に置く
 */
export type StyleKeyMap = Record<string, keyof CSSProperties>;

/**
 * スタイル関連のプロパティ
 *
 * - `E`に指定したキー（除外したキー）は含まない
 */
export type StyleProps<
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
> = {
  [K in Exclude<keyof M, E>]?: CSSProperties[M[K]];
};

/**
 * プレフィックスを付与したプロパティと元のプロパティのマッピング
 */
export type PrefixedStyleKeyMap<P extends string, U extends string> = {
  [K in U as PrefixedUnion<P, K>]: K;
};

/**
 * スタイル関連のプロパティを取り除いた後のプロパティ
 *
 * - `E`に指定したキー（除外したキー）は取り除かずに残す
 */
export type StyledProps<
  P,
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
> = Omit<P, keyof StyleProps<M, E>>;

/**
 * デフォルトのプレフィックス
 */
type Prefix = 'x';

/**
 * styleKeyMapのデフォルト値の装飾に関するマッピング
 */
export type XDecorationStyleKeyMap = PrefixedStyleKeyMap<
  Prefix,
  DecorationStyleKey
>;

/**
 * styleKeyMapのデフォルト値の視覚効果に関するマッピング
 */
export type XEffectStyleKeyMap = PrefixedStyleKeyMap<Prefix, EffectStyleKey>;

/**
 * styleKeyMapのデフォルト値のFlexboxに関するマッピング
 */
export type XFlexboxStyleKeyMap = PrefixedStyleKeyMap<Prefix, FlexboxStyleKey>;

/**
 * styleKeyMapのデフォルト値のFlexboxの子要素に関するマッピング
 */
export type XFlexboxItemStyleKeyMap = PrefixedStyleKeyMap<
  Prefix,
  FlexboxItemStyleKey
>;

/**
 * styleKeyMapのデフォルト値のレイアウトに関するマッピング
 */
export type XLayoutStyleKeyMap = PrefixedStyleKeyMap<Prefix, LayoutStyleKey>;

/**
 * styleKeyMapのデフォルト値の位置に関するマッピング
 */
export type XPositionStyleKeyMap = PrefixedStyleKeyMap<
  Prefix,
  PositionStyleKey
>;

/**
 * styleKeyMapのデフォルト値のサイズに関するマッピング
 */
export type XSizeStyleKeyMap = PrefixedStyleKeyMap<Prefix, SizeStyleKey>;

/**
 * styleKeyMapのデフォルト値の余白に関するマッピング
 */
export type XSpacingStyleKeyMap = PrefixedStyleKeyMap<Prefix, SpacingStyleKey>;

/**
 * styleKeyMapのデフォルト値のマッピング
 */
export type XStyleKeyMap = XDecorationStyleKeyMap &
  XEffectStyleKeyMap &
  XFlexboxStyleKeyMap &
  XFlexboxItemStyleKeyMap &
  XLayoutStyleKeyMap &
  XPositionStyleKeyMap &
  XSizeStyleKeyMap &
  XSpacingStyleKeyMap;

/**
 * 装飾に関するスタイルのキー
 */
export type DecorationStyleKey =
  | 'background'
  | 'backgroundColor'
  | 'border'
  | 'borderWidth'
  | 'borderStyle'
  | 'borderColor'
  | 'borderTop'
  | 'borderRight'
  | 'borderBottom'
  | 'borderLeft'
  | 'borderRadius'
  | 'boxShadow'
  | 'color';

/**
 * 視覚効果に関するスタイルのキー
 */
export type EffectStyleKey = 'opacity' | 'visibility';

/**
 * Flexboxに関するスタイルのキー
 */
export type FlexboxStyleKey =
  | 'alignContent'
  | 'alignItems'
  | 'flexDirection'
  | 'flexWrap'
  | 'justifyContent'
  | 'gap'
  | 'rowGap'
  | 'columnGap';

/**
 * Flexboxの子要素に関するスタイルのキー
 */
export type FlexboxItemStyleKey =
  'alignSelf' | 'flex' | 'flexBasis' | 'flexGrow' | 'flexShrink' | 'order';

/**
 * レイアウトに関するスタイルのキー
 */
export type LayoutStyleKey = 'boxSizing' | 'display' | 'overflow';

/**
 * 位置に関するスタイルのキー
 */
export type PositionStyleKey =
  'bottom' | 'left' | 'position' | 'right' | 'top' | 'zIndex';

/**
 * サイズに関するスタイルのキー
 */
export type SizeStyleKey =
  'height' | 'maxHeight' | 'maxWidth' | 'minHeight' | 'minWidth' | 'width';

/**
 * 余白に関するスタイルのキー
 */
export type SpacingStyleKey =
  | 'margin'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginTop'
  | 'padding'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingTop';

/**
 * スタイルのキー
 */
export type StyleKey =
  | DecorationStyleKey
  | EffectStyleKey
  | FlexboxStyleKey
  | FlexboxItemStyleKey
  | LayoutStyleKey
  | PositionStyleKey
  | SizeStyleKey
  | SpacingStyleKey;
