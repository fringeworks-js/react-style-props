# @fringeworks/react-style-props

`@fringeworks/react-style-props` は React コンポーネントのスタイルを `xColor` のようなプロパティで指定できるようにする、誰かにとっては便利なライブラリです。

**[English README is available here](./README.md)**

## 概要

`xColor="red"` や `xMarginTop={8}` のような「スタイル関連のプロパティ」を、スタイルプロパティ（`style` / `css` / `sx` など）へ移して適用します。

```tsx
<Box xDisplay="flex" xGap={8} xPadding={16}>
  ...
</Box>
// → <Box style={{ display: 'flex', gap: 8, padding: 16 }}>
```

- スタイル関連のプロパティは既定値として扱い、スタイルプロパティに同じキーを指定した場合はそちらを優先します
- プロパティ名とスタイルのキーの対応（マッピング）は、デフォルトでスタイルのキーに `x` を付けたものです。任意のマッピングも指定できます
- スタイルの適用には [`@fringeworks/react-style-proxy`](https://github.com/fringeworks-js/react-style-proxy/blob/main/README.ja.md) を使っています

## インストール

```sh
npm install @fringeworks/react-style-props
```

## 使い方

### HOC でコンポーネントを作る

```tsx
import { withStyleProps } from '@fringeworks/react-style-props';

const Box = withStyleProps('div');

<Box xColor="red" style={{ backgroundColor: 'blue' }}>
  ABC
</Box>;
// → <div style={{ color: 'red', backgroundColor: 'blue' }}>ABC</div>
```

`css` や `sx` へ適用する場合は `styleProp` を指定します。

```tsx
const Box = withStyleProps(MuiBox, { styleProp: 'sx' });
```

### コンポーネントの中で適用する

```tsx
import type { StyleProps } from '@fringeworks/react-style-props';
import { applyStyleProps } from '@fringeworks/react-style-props';

type CardProps = ComponentProps<'div'> & StyleProps;

function Card(props: CardProps) {
  return <div {...applyStyleProps(props)} />;
}
```

### 任意のマッピングを使う

```tsx
const Text = withStyleProps('span', {
  styleKeyMap: { fontColor: 'color', baseColor: 'backgroundColor' },
});

<Text fontColor="red" baseColor="blue" />;
```

### 一部のプロパティを除外する

コンポーネント自身が同じ名前のプロパティを持っている場合は、`excludeStyleKeys` で除外します。\
除外したプロパティはスタイルへ移さず、そのままコンポーネントへ渡します。型も元のコンポーネントのプロパティの型になります。

```tsx
const StyledChart = withStyleProps(Chart, { excludeStyleKeys: ['xColor'] });
```

## デフォルトのマッピング

スタイルのキーに `x` を付けたものをプロパティ名にします（`color` → `xColor`）。

| カテゴリ         | 定数                         | スタイルのキー                                                                                                                                                             |
| ---------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 装飾             | `DECORATION_STYLE_KEY_MAP`   | `background` `backgroundColor` `border` `borderWidth` `borderStyle` `borderColor` `borderTop` `borderRight` `borderBottom` `borderLeft` `borderRadius` `boxShadow` `color` |
| 視覚効果         | `EFFECT_STYLE_KEY_MAP`       | `opacity` `visibility`                                                                                                                                                     |
| Flexbox          | `FLEXBOX_STYLE_KEY_MAP`      | `alignContent` `alignItems` `flexDirection` `flexWrap` `justifyContent` `gap` `rowGap` `columnGap`                                                                         |
| Flexbox の子要素 | `FLEXBOX_ITEM_STYLE_KEY_MAP` | `alignSelf` `flex` `flexBasis` `flexGrow` `flexShrink` `order`                                                                                                             |
| レイアウト       | `LAYOUT_STYLE_KEY_MAP`       | `boxSizing` `display` `overflow`                                                                                                                                           |
| 位置             | `POSITION_STYLE_KEY_MAP`     | `bottom` `left` `position` `right` `top` `zIndex`                                                                                                                          |
| サイズ           | `SIZE_STYLE_KEY_MAP`         | `height` `maxHeight` `maxWidth` `minHeight` `minWidth` `width`                                                                                                             |
| 余白             | `SPACING_STYLE_KEY_MAP`      | `margin` `marginBottom` `marginLeft` `marginRight` `marginTop` `padding` `paddingBottom` `paddingLeft` `paddingRight` `paddingTop`                                         |

`DEFAULT_STYLE_KEY_MAP` はすべてのカテゴリをまとめたものです。カテゴリの定数を組み合わせて、任意のマッピングを作ることもできます。

```ts
const styleKeyMap = { ...SIZE_STYLE_KEY_MAP, ...SPACING_STYLE_KEY_MAP };
```

### 並び順

スタイルにはプロパティを指定した順ではなく、マッピングの並び順で反映します。\
省略形のキー（`margin` など）は個別指定のキー（`marginTop` など）より前にあるため、両方を指定した場合は個別指定が優先されます。\
border 系は、全体（`border`）→ 種類ごと（`borderWidth` / `borderStyle` / `borderColor`）→ 辺ごと（`borderTop` など）の順で、辺ごとの指定が優先されます。

任意のマッピングを指定する場合も、省略形のキーを前に置いてください。

スタイルプロパティとのマージでは、スタイルプロパティの値を後ろに並べます。そのため、`xBorder` と `style` の `borderColor` のように名前が異なるプロパティでも、スタイルプロパティの指定が優先されます。\
ただし、再描画の途中で省略形のプロパティを追加・削除する場合は、React の制約により個別指定が上書きされることがあるため、対応しません（詳しくは [`@fringeworks/react-style-proxy` の注意事項](https://github.com/fringeworks-js/react-style-proxy/blob/main/README.ja.md#省略形と個別指定を組み合わせる場合)を参照）。

## API

| 関数                                  | 説明                                                                    |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `withStyleProps(Component, options?)` | スタイル関連のプロパティを指定できるコンポーネントを作る HOC            |
| `applyStyleProps(props, options?)`    | スタイル関連のプロパティをスタイルプロパティへ適用した props を返す     |
| `extractStyleProps(props, options?)`  | スタイル関連のプロパティを取り除いた props と、取り出したスタイルを返す |

### `withStyleProps`

```ts
withStyleProps<C extends ElementType, M extends StyleKeyMap = XStyleKeyMap, E extends keyof M = never>(
  Component: C,
  options?: WithStylePropsOptions<M, E>,
): ForwardRefExoticComponent<StylePropsComponentProps<C, M, E> & RefAttributes<ComponentRef<C>>>
```

スタイル関連のプロパティを指定できるコンポーネントを作ります。ref は `Component` へ渡します。\
マッピングなどのオプションは作成時に 1 度だけ準備するため、作成後に `options` を変更しても影響しません。

| 引数        | 型                            | 説明                                                       |
| ----------- | ----------------------------- | ---------------------------------------------------------- |
| `Component` | `C`                           | 対象のコンポーネント、または HTML の要素名（`'div'` など） |
| `options?`  | `WithStylePropsOptions<M, E>` | `applyStyleProps` のオプションと、下記のオプション         |

| オプション     | 型       | 説明                                                                                |
| -------------- | -------- | ----------------------------------------------------------------------------------- |
| `displayName?` | `string` | コンポーネントの `displayName`。デフォルトは `withStyleProps(コンポーネントの名前)` |

### `applyStyleProps`

```ts
applyStyleProps<P extends LooseDictionary & StyleProps<M, E>, M extends StyleKeyMap = XStyleKeyMap, E extends keyof M = never>(
  props: P,
  options?: ApplyStylePropsOptions<M, E>,
): StyledProps<P, M, E>
```

スタイル関連のプロパティを取り除き、スタイルプロパティへ適用した新しい props を返します。`props` 自体は変更しません。\
スタイル関連のプロパティは既定値として扱い、スタイルプロパティの指定を優先します。\
スタイル関連のプロパティが無い場合は、スタイルプロパティを追加しません。

| 引数       | 型                             | 説明             |
| ---------- | ------------------------------ | ---------------- |
| `props`    | `P`                            | プロパティ       |
| `options?` | `ApplyStylePropsOptions<M, E>` | 下記のオプション |

| オプション          | 型               | 説明                                                                                               |
| ------------------- | ---------------- | -------------------------------------------------------------------------------------------------- |
| `styleKeyMap?`      | `M`              | プロパティ名とスタイルのキーのマッピング。デフォルトは `DEFAULT_STYLE_KEY_MAP`                     |
| `excludeStyleKeys?` | `readonly E[]`   | マッピングから除外するプロパティ名。除外したプロパティはそのまま残す                               |
| `styleProp?`        | `string`         | スタイルを適用するプロパティの名前。デフォルトは `'style'`                                         |
| `styleMergeMode?`   | `StyleMergeMode` | オブジェクトのスタイルプロパティとの組み合わせ方（`'merge'` / `'append'`）。デフォルトは `'merge'` |

`styleProp` と `styleMergeMode` の詳細は [`@fringeworks/react-style-proxy`](https://github.com/fringeworks-js/react-style-proxy/blob/main/README.ja.md) を参照してください。

### `extractStyleProps`

```ts
extractStyleProps<P extends LooseDictionary & StyleProps<M, E>, M extends StyleKeyMap = XStyleKeyMap, E extends keyof M = never>(
  props: P,
  options?: ExtractStylePropsOptions<M, E>,
): { props: StyledProps<P, M, E>; style: CSSProperties }
```

スタイル関連のプロパティを取り除いた props と、取り出したスタイルを返します。`props` 自体は変更しません。\
値が `undefined` のプロパティは取り出さずに残します。

| 引数       | 型                               | 説明                                                              |
| ---------- | -------------------------------- | ----------------------------------------------------------------- |
| `props`    | `P`                              | プロパティ                                                        |
| `options?` | `ExtractStylePropsOptions<M, E>` | `applyStyleProps` の `styleKeyMap?` と `excludeStyleKeys?` と同じ |

### 型

| 型                                  | 説明                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `StyleKeyMap`                       | プロパティ名とスタイルのキーのマッピング                                                 |
| `StyleProps<M, E>`                  | スタイル関連のプロパティ（除外したキー `E` は含まない）                                  |
| `StyledProps<P, M, E>`              | `P` からスタイル関連のプロパティを取り除いた型（除外したキー `E` は残す）                |
| `StylePropsComponentProps<C, M, E>` | `withStyleProps` で作ったコンポーネントのプロパティ                                      |
| `ApplyStylePropsOptions<M, E>`      | `applyStyleProps` のオプション                                                           |
| `ExtractStylePropsOptions<M, E>`    | `extractStyleProps` のオプション                                                         |
| `WithStylePropsOptions<M, E>`       | `withStyleProps` のオプション                                                            |
| `XStyleKeyMap`                      | デフォルトのマッピングの型（カテゴリごとの `XDecorationStyleKeyMap` などもある）         |
| `StyleKey`                          | デフォルトのマッピングのスタイルのキー（カテゴリごとの `DecorationStyleKey` などもある） |
| `PrefixedStyleKeyMap<P, U>`         | スタイルのキー `U` にプレフィックス `P` を付けたマッピング                               |

## ライセンス

MIT
