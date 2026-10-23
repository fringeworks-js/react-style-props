import { render, screen } from '@testing-library/react';
import type { CSSProperties, Ref } from 'react';
import { createRef } from 'react';
import withStyleProps from './withStyleProps';

type ComponentProps = {
  children?: string;
  id?: string;
  xBackgroundColor?: string;
  style?: CSSProperties | any;
  css?: CSSProperties | any;
  ref?: Ref<HTMLDivElement>;
};

/**
 * 受け取ったpropsを記録するコンポーネント
 */
const createComponent = () => {
  const received: ComponentProps[] = [];
  const Component = (props: ComponentProps) => {
    received.push(props);
    const { children, id, style, ref } = props;
    return (
      <div data-testid="target" id={id} style={style} ref={ref}>
        {children}
      </div>
    );
  };
  return { Component, received, last: () => received[received.length - 1]! };
};

const STYLE_KEY_MAP = {
  fontColor: 'color',
  baseColor: 'backgroundColor',
} as const;

describe('withStyleProps', () => {
  describe('default', () => {
    it('スタイル関連のプロパティをstyleに適用する', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component);
      render(
        <CustomComponent xColor="red" xBackgroundColor="blue">
          ABC
        </CustomComponent>,
      );

      expect(last().style).toEqual({
        color: 'red',
        backgroundColor: 'blue',
      });
      const target = screen.getByTestId('target');
      expect(target.style.color).toBe('red');
      expect(target.style.backgroundColor).toBe('blue');
    });

    it('スタイル関連のプロパティはコンポーネントに渡さない', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component);
      render(<CustomComponent xColor="red">ABC</CustomComponent>);

      expect(last()).not.toHaveProperty('xColor');
    });

    it('スタイル関連以外のプロパティはそのまま渡す', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component);
      render(
        <CustomComponent id="abc" xColor="red">
          ABC
        </CustomComponent>,
      );

      expect(last()).toMatchObject({ id: 'abc', children: 'ABC' });
      const target = screen.getByTestId('target');
      expect(target.id).toBe('abc');
      expect(target.textContent).toBe('ABC');
    });

    it('スタイル関連のプロパティ無しの場合はstyleを追加しない', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component);
      render(<CustomComponent>ABC</CustomComponent>);

      expect(last().style).toBeUndefined();
    });

    it('styleに指定した値がスタイル関連のプロパティより優先される', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component);
      render(
        <CustomComponent
          xColor="red"
          xBackgroundColor="blue"
          style={{ color: 'green' }}
        >
          ABC
        </CustomComponent>,
      );

      expect(last().style).toEqual({
        color: 'green',
        backgroundColor: 'blue',
      });
    });

    it('styleに指定した個別指定がスタイル関連のプロパティの省略形より優先される', () => {
      const { Component } = createComponent();
      const CustomComponent = withStyleProps(Component);
      render(
        <CustomComponent
          xBorder="1px solid red"
          style={{ borderColor: 'blue' }}
        >
          ABC
        </CustomComponent>,
      );

      const target = screen.getByTestId('target');
      expect(target.style.borderTopColor).toBe('blue');
      expect(target.style.borderTopWidth).toBe('1px');
    });
  });

  describe('ref', () => {
    it('refをコンポーネントへ転送する', () => {
      const { Component } = createComponent();
      const CustomComponent = withStyleProps(Component);
      const ref = createRef<HTMLDivElement>();
      render(
        <CustomComponent ref={ref} xColor="red">
          ABC
        </CustomComponent>,
      );

      expect(ref.current).toBe(screen.getByTestId('target'));
    });

    it('HTML要素をそのまま指定する', () => {
      const CustomDiv = withStyleProps('div');
      const ref = createRef<HTMLDivElement>();
      render(
        <CustomDiv ref={ref} data-testid="div" xColor="red">
          ABC
        </CustomDiv>,
      );

      const div = screen.getByTestId('div');
      expect(ref.current).toBe(div);
      expect(div.style.color).toBe('red');
      expect(div.hasAttribute('xColor')).toBe(false);
    });
  });

  describe('options', () => {
    it('styleKeyMap', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component, {
        styleKeyMap: STYLE_KEY_MAP,
      });
      render(
        <CustomComponent fontColor="red" baseColor="blue">
          ABC
        </CustomComponent>,
      );

      expect(last().style).toEqual({
        color: 'red',
        backgroundColor: 'blue',
      });
      expect(last()).not.toHaveProperty('fontColor');
      expect(last()).not.toHaveProperty('baseColor');
    });

    it('styleProp', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component, { styleProp: 'css' });
      render(
        <CustomComponent xColor="red" css={{ backgroundColor: 'blue' }}>
          ABC
        </CustomComponent>,
      );

      expect(last().css).toEqual({
        color: 'red',
        backgroundColor: 'blue',
      });
      expect(last().style).toBeUndefined();
    });

    it('styleMergeMode', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component, {
        styleProp: 'css',
        styleMergeMode: 'append',
      });
      render(
        <CustomComponent xColor="red" css={{ backgroundColor: 'blue' }}>
          ABC
        </CustomComponent>,
      );

      expect(last().css).toEqual([
        { color: 'red' },
        { backgroundColor: 'blue' },
      ]);
    });

    it('excludeStyleKeys', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component, {
        excludeStyleKeys: ['xBackgroundColor'],
      });
      render(
        <CustomComponent xColor="red" xBackgroundColor="blue">
          ABC
        </CustomComponent>,
      );

      expect(last().style).toEqual({ color: 'red' });
      expect(last()).toHaveProperty('xBackgroundColor', 'blue');
    });

    it('作成後にオプションを変更しても影響しない', () => {
      const { Component, last } = createComponent();
      const excludeStyleKeys: 'xBackgroundColor'[] = [];
      const CustomComponent = withStyleProps(Component, { excludeStyleKeys });
      excludeStyleKeys.push('xBackgroundColor');
      render(
        <CustomComponent xColor="red" xBackgroundColor="blue">
          ABC
        </CustomComponent>,
      );

      expect(last().style).toEqual({ color: 'red', backgroundColor: 'blue' });
    });
  });

  describe('displayName', () => {
    it('対象のコンポーネントの名前から作る', () => {
      function Card() {
        return null;
      }
      expect(withStyleProps('div').displayName).toBe('withStyleProps(div)');
      expect(withStyleProps(Card).displayName).toBe('withStyleProps(Card)');
    });

    it('名前の無いコンポーネントはUnknownにする', () => {
      expect(withStyleProps(() => null).displayName).toBe(
        'withStyleProps(Unknown)',
      );
    });

    it('オプションで指定した値を優先する', () => {
      expect(
        withStyleProps('div', { displayName: 'StyledDiv' }).displayName,
      ).toBe('StyledDiv');
    });

    it('displayNameはコンポーネントへ渡さない', () => {
      const { Component, last } = createComponent();
      const CustomComponent = withStyleProps(Component, {
        displayName: 'Custom',
      });
      render(<CustomComponent xColor="red">ABC</CustomComponent>);

      expect(last()).not.toHaveProperty('displayName');
    });
  });
});
