import type {
  XDecorationStyleKeyMap,
  XEffectStyleKeyMap,
  XFlexboxItemStyleKeyMap,
  XFlexboxStyleKeyMap,
  XLayoutStyleKeyMap,
  XPositionStyleKeyMap,
  XSizeStyleKeyMap,
  XSpacingStyleKeyMap,
  XStyleKeyMap,
} from './types';

// 並び順にスタイルへ反映するため、省略形のキーは個別指定のキーより前に置く

/**
 * 装飾に関するスタイルのキーのマッピング
 *
 * - border系は、全体（`border`）→ 種類ごと（`borderColor`など）→
 *   辺ごと（`borderTop`など）の順にし、辺ごとの指定を優先する
 */
export const DECORATION_STYLE_KEY_MAP: XDecorationStyleKeyMap = {
  xBackground: 'background',
  xBackgroundColor: 'backgroundColor',
  xBorder: 'border',
  xBorderWidth: 'borderWidth',
  xBorderStyle: 'borderStyle',
  xBorderColor: 'borderColor',
  xBorderTop: 'borderTop',
  xBorderRight: 'borderRight',
  xBorderBottom: 'borderBottom',
  xBorderLeft: 'borderLeft',
  xBorderRadius: 'borderRadius',
  xBoxShadow: 'boxShadow',
  xColor: 'color',
};

/**
 * 視覚効果に関するスタイルのキーのマッピング
 */
export const EFFECT_STYLE_KEY_MAP: XEffectStyleKeyMap = {
  xOpacity: 'opacity',
  xVisibility: 'visibility',
};

/**
 * Flexboxに関するスタイルのキーのマッピング
 */
export const FLEXBOX_STYLE_KEY_MAP: XFlexboxStyleKeyMap = {
  xAlignContent: 'alignContent',
  xAlignItems: 'alignItems',
  xFlexDirection: 'flexDirection',
  xFlexWrap: 'flexWrap',
  xJustifyContent: 'justifyContent',
  xGap: 'gap',
  xRowGap: 'rowGap',
  xColumnGap: 'columnGap',
};

/**
 * Flexboxの子要素に関するスタイルのキーのマッピング
 */
export const FLEXBOX_ITEM_STYLE_KEY_MAP: XFlexboxItemStyleKeyMap = {
  xAlignSelf: 'alignSelf',
  xFlex: 'flex',
  xFlexBasis: 'flexBasis',
  xFlexGrow: 'flexGrow',
  xFlexShrink: 'flexShrink',
  xOrder: 'order',
};

/**
 * レイアウトに関するスタイルのキーのマッピング
 */
export const LAYOUT_STYLE_KEY_MAP: XLayoutStyleKeyMap = {
  xBoxSizing: 'boxSizing',
  xDisplay: 'display',
  xOverflow: 'overflow',
};

/**
 * 位置に関するスタイルのキーのマッピング
 */
export const POSITION_STYLE_KEY_MAP: XPositionStyleKeyMap = {
  xBottom: 'bottom',
  xLeft: 'left',
  xPosition: 'position',
  xRight: 'right',
  xTop: 'top',
  xZIndex: 'zIndex',
};

/**
 * サイズに関するスタイルのキーのマッピング
 */
export const SIZE_STYLE_KEY_MAP: XSizeStyleKeyMap = {
  xHeight: 'height',
  xMaxHeight: 'maxHeight',
  xMaxWidth: 'maxWidth',
  xMinHeight: 'minHeight',
  xMinWidth: 'minWidth',
  xWidth: 'width',
};

/**
 * 余白に関するスタイルのキーのマッピング
 */
export const SPACING_STYLE_KEY_MAP: XSpacingStyleKeyMap = {
  xMargin: 'margin',
  xMarginBottom: 'marginBottom',
  xMarginLeft: 'marginLeft',
  xMarginRight: 'marginRight',
  xMarginTop: 'marginTop',
  xPadding: 'padding',
  xPaddingBottom: 'paddingBottom',
  xPaddingLeft: 'paddingLeft',
  xPaddingRight: 'paddingRight',
  xPaddingTop: 'paddingTop',
};

/**
 * styleKeyMapのデフォルト値（全カテゴリのマッピング）
 */
export const DEFAULT_STYLE_KEY_MAP: XStyleKeyMap = {
  ...DECORATION_STYLE_KEY_MAP,
  ...EFFECT_STYLE_KEY_MAP,
  ...FLEXBOX_STYLE_KEY_MAP,
  ...FLEXBOX_ITEM_STYLE_KEY_MAP,
  ...LAYOUT_STYLE_KEY_MAP,
  ...POSITION_STYLE_KEY_MAP,
  ...SIZE_STYLE_KEY_MAP,
  ...SPACING_STYLE_KEY_MAP,
};
