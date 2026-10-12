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
  });
});
