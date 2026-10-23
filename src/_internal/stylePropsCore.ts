import type { StyleProxyOptions } from '@fringeworks/react-style-proxy';
import { styleProxy } from '@fringeworks/react-style-proxy';
import type { LooseDictionary } from '@fringeworks/types';
import type { CSSProperties } from 'react';
import { DEFAULT_STYLE_KEY_MAP } from '../constants';
import type { StyleKeyMap } from '../types';

/**
 * スタイル関連のプロパティのキーとスタイルのキーの組の配列（マッピングの並び順）
 */
type StyleKeyEntries = readonly (readonly [
  propKey: string,
  styleKey: string,
])[];

/**
 * 内部で扱うオプション（型引数を外したもの）
 */
type CoreOptions = Omit<StyleProxyOptions, 'styleAsDefault'> & {
  styleKeyMap?: StyleKeyMap;
  excludeStyleKeys?: readonly PropertyKey[];
};

/**
 * デフォルトのマッピングの組の配列
 */
const DEFAULT_STYLE_KEY_ENTRIES: StyleKeyEntries = Object.entries(
  DEFAULT_STYLE_KEY_MAP,
);

/**
 * マッピングから除外するキーを取り除き、組の配列にする
 * @param styleKeyMap マッピング
 * @param excludeStyleKeys マッピングから除外するプロパティのキー
 * @returns
 */
export function createStyleKeyEntries(
  styleKeyMap?: StyleKeyMap,
  excludeStyleKeys?: readonly PropertyKey[],
): StyleKeyEntries {
  const entries = styleKeyMap
    ? Object.entries(styleKeyMap)
    : DEFAULT_STYLE_KEY_ENTRIES;
  if (!excludeStyleKeys?.length) {
    return entries;
  }
  const excludeKeys = new Set(excludeStyleKeys);
  return entries.filter(([propKey]) => !excludeKeys.has(propKey));
}

/**
 * マッピングの組の配列に従い、スタイル関連のプロパティをスタイルへ移動する
 *
 * - 値が`undefined`のプロパティは移動しない
 * @param props プロパティ
 * @param entries マッピングの組の配列
 * @returns
 */
export function extractStyleByEntries(
  props: LooseDictionary,
  entries: StyleKeyEntries,
): { props: LooseDictionary; style: CSSProperties } {
  const rest: LooseDictionary = { ...props };
  const style: Record<string, unknown> = {};
  for (const [propKey, styleKey] of entries) {
    if (rest[propKey] !== undefined) {
      style[styleKey] = rest[propKey];
      delete rest[propKey];
    }
  }
  return { props: rest, style };
}

/**
 * スタイル関連のプロパティをスタイルプロパティへ適用する関数を作る
 *
 * - マッピングとstyleProxyのオプションは作成時に1度だけ用意する
 * @param options オプション
 * @returns
 */
export function createStylePropsApplier(
  options: CoreOptions,
): (props: LooseDictionary) => LooseDictionary {
  const { styleKeyMap, excludeStyleKeys, ...restOptions } = options;
  const entries = createStyleKeyEntries(styleKeyMap, excludeStyleKeys);
  // スタイル関連のプロパティは既定値として扱い、スタイルプロパティの指定を優先する
  const styleProxyOptions: StyleProxyOptions = {
    ...restOptions,
    styleAsDefault: true,
  };
  return (props) => {
    const { props: rest, style } = extractStyleByEntries(props, entries);
    // スタイル関連のプロパティがある場合のみ適用する
    return Object.keys(style).length
      ? styleProxy(rest, style, styleProxyOptions)
      : rest;
  };
}
