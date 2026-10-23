import extractStyleProps from './extractStyleProps';

describe('extractStyleProps', () => {
  const onChange = () => {};

  describe('default', () => {
    it('スタイル関連のプロパティ無し', () => {
      const result = extractStyleProps({ value: 'abc', onChange });
      expect(result).toEqual({
        props: { value: 'abc', onChange },
        style: {},
      });
    });

    it('スタイル関連のプロパティをstyleに移動する', () => {
      const result = extractStyleProps({
        value: 'abc',
        onChange,
        xColor: '#ff0000',
        xBackgroundColor: '#00ff00',
        xMarginTop: 8,
      });
      expect(result).toEqual({
        props: { value: 'abc', onChange },
        style: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
          marginTop: 8,
        },
      });
    });

    it('各カテゴリのプロパティを移動する', () => {
      const result = extractStyleProps({
        xBorder: '1px solid',
        xOpacity: 0.5,
        xFlexDirection: 'column',
        xFlexGrow: 1,
        xDisplay: 'flex',
        xZIndex: 10,
        xWidth: '100%',
        xPadding: 4,
      });
      expect(result).toEqual({
        props: {},
        style: {
          border: '1px solid',
          opacity: 0.5,
          flexDirection: 'column',
          flexGrow: 1,
          display: 'flex',
          zIndex: 10,
          width: '100%',
          padding: 4,
        },
      });
    });

    it('値がundefinedのプロパティは移動しない', () => {
      const result = extractStyleProps({
        value: 'abc',
        xColor: undefined,
        xBackgroundColor: '#00ff00',
      });
      expect(result.style).toEqual({ backgroundColor: '#00ff00' });
      // undefinedのプロパティは削除されずに残る
      expect(result.props).toEqual({ value: 'abc', xColor: undefined });
      expect('xColor' in result.style).toBe(false);
    });

    it('falsyな値(0, 空文字, null)は移動する', () => {
      const result = extractStyleProps({
        xOpacity: 0,
        xColor: '',
        xBackgroundColor: null as any,
      });
      expect(result).toEqual({
        props: {},
        style: {
          opacity: 0,
          color: '',
          backgroundColor: null,
        },
      });
    });

    it('マッピングに無いプロパティはそのまま残す', () => {
      const result = extractStyleProps({
        color: '#ff0000',
        style: { color: '#0000ff' },
      });
      expect(result).toEqual({
        props: {
          color: '#ff0000',
          style: { color: '#0000ff' },
        },
        style: {},
      });
    });

    it('引数のpropsを変更しない', () => {
      const props = { value: 'abc', xColor: '#ff0000' };
      const result = extractStyleProps(props);
      expect(props).toEqual({ value: 'abc', xColor: '#ff0000' });
      expect(result.props).not.toBe(props);
    });
  });

  describe('styleKeyMap', () => {
    it('任意のマッピング', () => {
      const result = extractStyleProps(
        {
          value: 'abc',
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
      expect(result).toEqual({
        props: { value: 'abc' },
        style: {
          color: '#ff0000',
          backgroundColor: '#00ff00',
        },
      });
    });

    it('任意のマッピングを指定した場合はデフォルトのマッピングを使用しない', () => {
      const result = extractStyleProps(
        {
          fontColor: '#ff0000',
          xBackgroundColor: '#00ff00',
        },
        {
          styleKeyMap: { fontColor: 'color' },
        },
      );
      expect(result).toEqual({
        props: { xBackgroundColor: '#00ff00' },
        style: { color: '#ff0000' },
      });
    });
  });

  describe('excludeStyleKeys', () => {
    it('除外したプロパティは移動せずにそのまま残す', () => {
      const result = extractStyleProps(
        {
          value: 'abc',
          xColor: '#ff0000',
          xBackgroundColor: '#00ff00',
        },
        { excludeStyleKeys: ['xColor'] },
      );
      expect(result).toEqual({
        props: { value: 'abc', xColor: '#ff0000' },
        style: { backgroundColor: '#00ff00' },
      });
    });

    it('任意のマッピングと組み合わせる', () => {
      const result = extractStyleProps(
        {
          fontColor: '#ff0000',
          baseColor: '#00ff00',
        },
        {
          styleKeyMap: {
            fontColor: 'color',
            baseColor: 'backgroundColor',
          },
          excludeStyleKeys: ['baseColor'],
        },
      );
      expect(result).toEqual({
        props: { baseColor: '#00ff00' },
        style: { color: '#ff0000' },
      });
    });

    it('空配列', () => {
      const result = extractStyleProps(
        { xColor: '#ff0000' },
        { excludeStyleKeys: [] },
      );
      expect(result).toEqual({
        props: {},
        style: { color: '#ff0000' },
      });
    });

    it('読み取り専用の配列', () => {
      const excludeStyleKeys = ['xColor'] as const;
      const result = extractStyleProps(
        { xColor: '#ff0000', xBackgroundColor: '#00ff00' },
        { excludeStyleKeys },
      );
      expect(result).toEqual({
        props: { xColor: '#ff0000' },
        style: { backgroundColor: '#00ff00' },
      });
    });
  });

  describe('並び順', () => {
    it('プロパティの指定順ではなく、マッピングの並び順でスタイルに反映する', () => {
      const result = extractStyleProps({
        xMarginTop: 4,
        xMargin: 8,
        xFlexGrow: 1,
        xFlex: 'none',
      });
      expect(Object.keys(result.style)).toEqual([
        'flex',
        'flexGrow',
        'margin',
        'marginTop',
      ]);
    });

    it('border系は全体、種類ごと、辺ごとの順', () => {
      const result = extractStyleProps({
        xBorderLeft: '1px solid red',
        xBorderBottom: '1px solid red',
        xBorderRight: '1px solid red',
        xBorderTop: '1px solid red',
        xBorderColor: 'blue',
        xBorderStyle: 'dashed',
        xBorderWidth: 2,
        xBorder: '1px solid',
      });
      expect(Object.keys(result.style)).toEqual([
        'border',
        'borderWidth',
        'borderStyle',
        'borderColor',
        'borderTop',
        'borderRight',
        'borderBottom',
        'borderLeft',
      ]);
    });

    it('DOMでは辺ごとの指定が種類ごとの指定より優先される', () => {
      const { style } = extractStyleProps({
        xBorderBottom: '1px solid red',
        xBorderColor: 'blue',
      });
      const div = document.createElement('div');
      Object.assign(div.style, style);
      expect(div.style.borderBottomColor).toBe('red');
      expect(div.style.borderTopColor).toBe('blue');
    });
  });

  describe('追加したキー', () => {
    it('Flexboxとその子要素のキー', () => {
      const result = extractStyleProps({
        xAlignContent: 'center',
        xRowGap: 4,
        xColumnGap: 8,
        xAlignSelf: 'end',
        xOrder: 2,
      });
      expect(result.style).toEqual({
        alignContent: 'center',
        rowGap: 4,
        columnGap: 8,
        alignSelf: 'end',
        order: 2,
      });
    });
  });
});
