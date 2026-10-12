import type { CSSProperties } from 'react';
import applyStyleProps from '../applyStyleProps';
import type { StyleProps } from '../types';

type TestPropsBase = {
  value?: string;
  onChange?: () => void;
  style?: CSSProperties | any;
  css?: CSSProperties | CSSProperties[];
  sx?: CSSProperties | CSSProperties[];
  any?: CSSProperties | CSSProperties[];
};

type DefaultTestProps = TestPropsBase & StyleProps;

describe('applyStyleProps', () => {
  const onChange = (...args: unknown[]) => {
    console.log(args);
  };
  const create = (options?: DefaultTestProps) => {
    return {
      value: 'abc',
      onChange,
      xColor: '#ff0000',
      xBackgroundColor: '#00ff00',
      ...options,
    } as DefaultTestProps;
  };

  describe('default', () => {
    it('スタイル関連のプロパティ無し', () => {
      const styledProps = applyStyleProps({
        value: 'abc',
        onChange,
      });
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
      });
    });

    it('スタイルプロパティがオブジェクト、配列以外', () => {
      const styleFn = () => {
        return {
          borderColor: '#0000ff',
        };
      };
      const styledProps = applyStyleProps(
        create({
          style: styleFn,
        }),
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: [
          {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
          styleFn,
        ],
      });
    });
  });

  describe('styleProp', () => {
    it('undefined', () => {
      const styledProps = applyStyleProps(create());
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
        },
      });
    });

    describe('style', () => {
      it('none', () => {
        const styledProps = applyStyleProps(create(), { styleProp: 'style' });
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          style: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        });
      });

      it('object', () => {
        const styledProps = applyStyleProps(
          create({
            xBorderColor: '#ffffff',
            style: {
              borderColor: '#0000ff',
            },
          }),
          { styleProp: 'style' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          style: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });

      it('object (設定済み)', () => {
        const styledProps = applyStyleProps(
          create({
            style: {
              borderColor: '#0000ff',
            },
          }),
          { styleProp: 'style' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          style: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });
    });

    describe('css', () => {
      it('none', () => {
        const styledProps = applyStyleProps(create(), { styleProp: 'css' });
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          css: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        });
      });

      it('object', () => {
        const styledProps = applyStyleProps(
          create({
            css: {
              borderColor: '#0000ff',
            },
          }),
          { styleProp: 'css' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          css: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });

      it('array', () => {
        const styledProps = applyStyleProps(
          create({
            css: [
              {
                borderColor: '#0000ff',
              },
            ],
          }),
          { styleProp: 'css' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          css: [
            {
              color: '#ff0000',
              backgroundColor: '#00ff00',
            },
            { borderColor: '#0000ff' },
          ],
        });
      });
    });

    describe('sx', () => {
      it('none', () => {
        const styledProps = applyStyleProps(create(), { styleProp: 'sx' });
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          sx: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        });
      });

      it('object', () => {
        const styledProps = applyStyleProps(
          create({
            sx: {
              borderColor: '#0000ff',
            },
          }),
          { styleProp: 'sx' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          sx: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });

      it('array', () => {
        const styledProps = applyStyleProps(
          create({
            sx: [
              {
                borderColor: '#0000ff',
              },
            ],
          }),
          { styleProp: 'sx' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          sx: [
            {
              color: '#ff0000',
              backgroundColor: '#00ff00',
            },
            { borderColor: '#0000ff' },
          ],
        });
      });
    });

    describe('any', () => {
      it('none', () => {
        const styledProps = applyStyleProps(create(), { styleProp: 'any' });
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          any: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
        });
      });

      it('object', () => {
        const styledProps = applyStyleProps(
          create({
            any: {
              borderColor: '#0000ff',
            },
          }),
          { styleProp: 'any' },
        );
        expect(styledProps).toEqual({
          value: 'abc',
          onChange,
          any: {
            color: '#ff0000',
            backgroundColor: '#00ff00',
            borderColor: '#0000ff',
          },
        });
      });
    });
  });

  describe('styleApplyMode', () => {
    it('未設定', () => {
      const styledProps = applyStyleProps(
        create({
          any: {
            borderColor: '#0000ff',
          },
        }),
        { styleProp: 'any' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        any: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
          borderColor: '#0000ff',
        },
      });
    });

    it('merge', () => {
      const styledProps = applyStyleProps(
        create({
          any: {
            borderColor: '#0000ff',
          },
        }),
        { styleProp: 'any', styleMergeMode: 'merge' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        any: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
          borderColor: '#0000ff',
        },
      });
    });

    it('append', () => {
      const styledProps = applyStyleProps(
        create({
          any: {
            borderColor: '#0000ff',
          },
        }),
        { styleProp: 'any', styleMergeMode: 'append' },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        any: [
          {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
          {
            borderColor: '#0000ff',
          },
        ],
      });
    });
  });

  describe('styleAsDefault', () => {
    it('スタイルプロパティに指定した値が優先される(object)', () => {
      const styledProps = applyStyleProps(
        create({
          style: {
            color: '#0000ff',
          },
        }),
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          color: '#0000ff',
          backgroundColor: '#00ff00',
        },
      });
    });

    it('スタイルプロパティに指定した値が優先される(array)', () => {
      const styledProps = applyStyleProps(
        create({
          style: [{ color: '#0000ff' }],
        }),
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: [
          {
            color: '#ff0000',
            backgroundColor: '#00ff00',
          },
          { color: '#0000ff' },
        ],
      });
    });

    it('スタイルプロパティの値がundefinedの場合はスタイル関連のプロパティで補完する', () => {
      const styledProps = applyStyleProps(
        create({
          style: {
            color: undefined,
          },
        }),
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
        },
      });
    });
  });

  describe('excludeStyleKeys', () => {
    it('除外したプロパティは適用しない', () => {
      const styledProps = applyStyleProps(create(), {
        excludeStyleKeys: ['xBackgroundColor'],
      });
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        xBackgroundColor: '#00ff00',
        style: {
          color: '#ff0000',
        },
      });
    });

    it('全て除外した場合はスタイルプロパティを追加しない', () => {
      const styledProps = applyStyleProps(create(), {
        excludeStyleKeys: ['xColor', 'xBackgroundColor'],
      });
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        xColor: '#ff0000',
        xBackgroundColor: '#00ff00',
      });
    });
  });

  it('引数のpropsを変更しない', () => {
    const props = create({ style: { borderColor: '#0000ff' } });
    applyStyleProps(props);
    expect(props).toEqual({
      value: 'abc',
      onChange,
      xColor: '#ff0000',
      xBackgroundColor: '#00ff00',
      style: { borderColor: '#0000ff' },
    });
  });

  describe('styleKeyMap', () => {
    it('任意のマッピング', () => {
      const styledProps = applyStyleProps(
        {
          value: 'abc',
          onChange,
          fontColor: '#ff0000',
          baseColor: '#00ff00',
        },
        {
          styleKeyMap: {
            fontColor: 'color',
            baseColor: 'backgroundColor',
          },
        },
      );
      expect(styledProps).toEqual({
        value: 'abc',
        onChange,
        style: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
        },
      });
    });
  });
});
