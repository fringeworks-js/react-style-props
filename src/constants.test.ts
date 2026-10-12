import {
  DECORATION_STYLE_KEY_MAP,
  DEFAULT_STYLE_KEY_MAP,
  EFFECT_STYLE_KEY_MAP,
  FLEXBOX_ITEM_STYLE_KEY_MAP,
  FLEXBOX_STYLE_KEY_MAP,
  LAYOUT_STYLE_KEY_MAP,
  POSITION_STYLE_KEY_MAP,
  SIZE_STYLE_KEY_MAP,
  SPACING_STYLE_KEY_MAP,
} from './constants';

const CATEGORY_MAPS = {
  DECORATION_STYLE_KEY_MAP,
  EFFECT_STYLE_KEY_MAP,
  FLEXBOX_STYLE_KEY_MAP,
  FLEXBOX_ITEM_STYLE_KEY_MAP,
  LAYOUT_STYLE_KEY_MAP,
  POSITION_STYLE_KEY_MAP,
  SIZE_STYLE_KEY_MAP,
  SPACING_STYLE_KEY_MAP,
};

/**
 * スタイルのキーからプロパティのキーを作る（color → xColor）
 */
const toXKey = (key: string) =>
  `x${key.charAt(0).toUpperCase()}${key.slice(1)}`;

describe('constants', () => {
  describe.each(Object.entries(CATEGORY_MAPS))('%s', (_, map) => {
    it('プロパティのキーはスタイルのキーにプレフィックスxを付与したもの', () => {
      for (const [xKey, key] of Object.entries(map)) {
        expect(xKey).toBe(toXKey(key));
      }
    });
  });

  describe('DEFAULT_STYLE_KEY_MAP', () => {
    it('全カテゴリのマッピングを含む', () => {
      const expected = Object.assign({}, ...Object.values(CATEGORY_MAPS));
      expect(DEFAULT_STYLE_KEY_MAP).toEqual(expected);
    });

    it('カテゴリ間でキーが重複していない', () => {
      const keys = Object.values(CATEGORY_MAPS).flatMap((map) =>
        Object.keys(map),
      );
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
