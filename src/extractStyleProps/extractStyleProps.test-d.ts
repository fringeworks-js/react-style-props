import type { CSSProperties } from 'react';
import { describe, expectTypeOf, it } from 'vitest';
import applyStyleProps from '../applyStyleProps';
import extractStyleProps from './extractStyleProps';

/**
 * テスト用のプロパティ
 *
 * - `xColor`: スタイル関連のプロパティと名前が衝突するプロパティ（除外して使う）
 */
type TestProps = {
  value: string;
  xColor?: number;
  xBackgroundColor?: string;
};

const props = {} as TestProps;

describe('extractStyleProps', () => {
  it('スタイル関連のプロパティを取り除いた型を返す', () => {
    const result = extractStyleProps({} as { value: string; xColor?: string });
    expectTypeOf(result.props).toEqualTypeOf<{ value: string }>();
    expectTypeOf(result.style).toEqualTypeOf<CSSProperties>();
  });

  it('除外したキーは取り除かずに残す', () => {
    const result = extractStyleProps(props, { excludeStyleKeys: ['xColor'] });
    expectTypeOf(result.props).toEqualTypeOf<{
      value: string;
      xColor?: number;
    }>();
  });

  it('読み取り専用の配列を指定できる', () => {
    const excludeStyleKeys = ['xColor'] as const;
    const result = extractStyleProps(props, { excludeStyleKeys });
    expectTypeOf(result.props).toEqualTypeOf<{
      value: string;
      xColor?: number;
    }>();
  });

  it('マッピングに無いキーは除外できない', () => {
    // @ts-expect-error マッピングに無いキー
    extractStyleProps(props, { excludeStyleKeys: ['color'] });
  });

  it('除外していないキーにはCSSの値の型が必要', () => {
    // @ts-expect-error xColorはCSSのcolorの値
    extractStyleProps(props);
  });

  it('任意のマッピングのキーを取り除く', () => {
    const result = extractStyleProps(
      {} as { value: string; fontColor?: string; baseColor?: string },
      {
        styleKeyMap: { fontColor: 'color', baseColor: 'backgroundColor' },
        excludeStyleKeys: ['baseColor'],
      },
    );
    expectTypeOf(result.props).toEqualTypeOf<{
      value: string;
      baseColor?: string;
    }>();
  });
});

describe('applyStyleProps', () => {
  it('除外したキーは取り除かずに残す', () => {
    const result = applyStyleProps(props, { excludeStyleKeys: ['xColor'] });
    expectTypeOf(result).toEqualTypeOf<{ value: string; xColor?: number }>();
  });
});
