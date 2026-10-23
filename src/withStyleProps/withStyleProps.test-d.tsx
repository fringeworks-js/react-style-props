import type { ComponentProps, ComponentRef, CSSProperties } from 'react';
import { describe, expectTypeOf, it } from 'vitest';
import withStyleProps from './withStyleProps';

/**
 * テスト用のコンポーネント
 *
 * - `xColor`: スタイル関連のプロパティと名前が衝突するプロパティ
 */
const Label = (props: { title: string; xColor?: number }) => {
  return <span title={props.title}>{props.xColor}</span>;
};

const StyledDiv = withStyleProps('div');
const StyledLabel = withStyleProps(Label);
const ExcludedLabel = withStyleProps(Label, { excludeStyleKeys: ['xColor'] });
const ExcludedDiv = withStyleProps('div', {
  excludeStyleKeys: ['xBackgroundColor'],
});

type StyledDivProps = ComponentProps<typeof StyledDiv>;
type StyledLabelProps = ComponentProps<typeof StyledLabel>;
type ExcludedLabelProps = ComponentProps<typeof ExcludedLabel>;
type ExcludedDivProps = ComponentProps<typeof ExcludedDiv>;

describe('withStyleProps', () => {
  it('スタイル関連のプロパティを指定できる', () => {
    expectTypeOf<StyledDivProps>()
      .toHaveProperty('xColor')
      .toEqualTypeOf<CSSProperties['color']>();
    expectTypeOf<
      ComponentRef<typeof StyledDiv>
    >().toEqualTypeOf<HTMLDivElement>();
  });

  it('衝突するプロパティはスタイル関連のプロパティの型になる', () => {
    expectTypeOf<StyledLabelProps>()
      .toHaveProperty('xColor')
      .toEqualTypeOf<CSSProperties['color']>();
  });

  it('除外したキーは元のコンポーネントのプロパティの型になる', () => {
    expectTypeOf<ExcludedLabelProps>()
      .toHaveProperty('xColor')
      .toEqualTypeOf<number | undefined>();
    expectTypeOf<ExcludedLabelProps>()
      .toHaveProperty('title')
      .toEqualTypeOf<string>();
  });

  it('除外したキーが元のコンポーネントに無ければ指定できない', () => {
    expectTypeOf<ExcludedDivProps>().not.toHaveProperty('xBackgroundColor');
  });

  it('displayNameを設定できる', () => {
    expectTypeOf(StyledDiv).toHaveProperty('displayName');
    expectTypeOf(StyledLabel).toHaveProperty('displayName');
    expectTypeOf(ExcludedLabel).toHaveProperty('displayName');
    expectTypeOf(ExcludedDiv).toHaveProperty('displayName');
  });
});
