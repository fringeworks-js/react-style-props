import type { StyleKeyMap, XStyleKeyMap } from '../types';

/**
 * extractStylePropsのオプション
 */
export type ExtractStylePropsOptions<
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
> = {
  /**
   * スタイル関連のプロパティのキーとスタイルのキーのマッピング\
   * 未指定の場合はDEFAULT_STYLE_KEY_MAP
   */
  styleKeyMap?: M;

  /**
   * マッピングから除外するプロパティのキー\
   * 除外したプロパティはスタイルへ移動せず、そのまま残す
   */
  excludeStyleKeys?: readonly E[];
};
