# @fringeworks/react-style-props

`@fringeworks/react-style-props` is a library some will find handy, for styling React components with props such as `xColor`.

**[日本語のREADMEはこちら](./README.ja.md)**

## Overview

It moves "style props" such as `xColor="red"` or `xMarginTop={8}` to the style property (`style`, `css`, `sx` and so on) and applies them.

```tsx
<Box xDisplay="flex" xGap={8} xPadding={16}>
  ...
</Box>
// → <Box style={{ display: 'flex', gap: 8, padding: 16 }}>
```

- Style props are treated as defaults. When the style property has the same key, that value takes precedence
- By default, each prop name is the style key prefixed with `x` (the mapping). You can also pass your own mapping
- Styles are applied with [`@fringeworks/react-style-proxy`](https://github.com/fringeworks-js/react-style-proxy)

## Installation

```sh
npm install @fringeworks/react-style-props
```

## Usage

### Creating a component with a HOC

```tsx
import { withStyleProps } from '@fringeworks/react-style-props';

const Box = withStyleProps('div');

<Box xColor="red" style={{ backgroundColor: 'blue' }}>
  ABC
</Box>;
// → <div style={{ color: 'red', backgroundColor: 'blue' }}>ABC</div>
```

To apply to `css` or `sx`, specify `styleProp`.

```tsx
const Box = withStyleProps(MuiBox, { styleProp: 'sx' });
```

### Applying inside a component

```tsx
import type { StyleProps } from '@fringeworks/react-style-props';
import { applyStyleProps } from '@fringeworks/react-style-props';

type CardProps = ComponentProps<'div'> & StyleProps;

function Card(props: CardProps) {
  return <div {...applyStyleProps(props)} />;
}
```

### Using your own mapping

```tsx
const Text = withStyleProps('span', {
  styleKeyMap: { fontColor: 'color', baseColor: 'backgroundColor' },
});

<Text fontColor="red" baseColor="blue" />;
```

### Excluding some props

When the component itself has a prop with the same name, exclude it with `excludeStyleKeys`.\
Excluded props are not moved to the style and are passed to the component as they are. Their types are also those of the original component's props.

```tsx
const StyledChart = withStyleProps(Chart, { excludeStyleKeys: ['xColor'] });
```

## Default mapping

Each prop name is the style key prefixed with `x` (`color` → `xColor`).

| Category     | Constant                     | Style keys                                                                                                                                                                 |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decoration   | `DECORATION_STYLE_KEY_MAP`   | `background` `backgroundColor` `border` `borderWidth` `borderStyle` `borderColor` `borderTop` `borderRight` `borderBottom` `borderLeft` `borderRadius` `boxShadow` `color` |
| Effect       | `EFFECT_STYLE_KEY_MAP`       | `opacity` `visibility`                                                                                                                                                     |
| Flexbox      | `FLEXBOX_STYLE_KEY_MAP`      | `alignContent` `alignItems` `flexDirection` `flexWrap` `justifyContent` `gap` `rowGap` `columnGap`                                                                         |
| Flexbox item | `FLEXBOX_ITEM_STYLE_KEY_MAP` | `alignSelf` `flex` `flexBasis` `flexGrow` `flexShrink` `order`                                                                                                             |
| Layout       | `LAYOUT_STYLE_KEY_MAP`       | `boxSizing` `display` `overflow`                                                                                                                                           |
| Position     | `POSITION_STYLE_KEY_MAP`     | `bottom` `left` `position` `right` `top` `zIndex`                                                                                                                          |
| Size         | `SIZE_STYLE_KEY_MAP`         | `height` `maxHeight` `maxWidth` `minHeight` `minWidth` `width`                                                                                                             |
| Spacing      | `SPACING_STYLE_KEY_MAP`      | `margin` `marginBottom` `marginLeft` `marginRight` `marginTop` `padding` `paddingBottom` `paddingLeft` `paddingRight` `paddingTop`                                         |

`DEFAULT_STYLE_KEY_MAP` combines all categories. You can also build your own mapping by combining the category constants.

```ts
const styleKeyMap = { ...SIZE_STYLE_KEY_MAP, ...SPACING_STYLE_KEY_MAP };
```

### Order

Styles are applied in the order of the mapping, not in the order the props are given.\
Shorthand keys (such as `margin`) come before longhand keys (such as `marginTop`), so the longhand wins when both are given.\
Border keys are ordered as the whole (`border`) → per kind (`borderWidth` / `borderStyle` / `borderColor`) → per side (`borderTop` and so on), so the per-side value wins.

When you pass your own mapping, put shorthand keys first as well.

When merging with the style property, the values of the style property are placed last. So the style property takes precedence even when the property names differ, such as `xBorder` and `borderColor` in `style`.\
However, adding or removing a shorthand property during a re-render is not supported, because a limitation of React may cause the longhand property to be overridden (see [the notes of `@fringeworks/react-style-proxy`](https://github.com/fringeworks-js/react-style-proxy#mixing-shorthand-and-longhand-properties)).

## API

| Function                              | Description                                                              |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `withStyleProps(Component, options?)` | A HOC that creates a component accepting style props                     |
| `applyStyleProps(props, options?)`    | Returns props with the style props applied to the style property         |
| `extractStyleProps(props, options?)`  | Returns props without the style props, together with the extracted style |

### `withStyleProps`

```ts
withStyleProps<C extends ElementType, M extends StyleKeyMap = XStyleKeyMap, E extends keyof M = never>(
  Component: C,
  options?: WithStylePropsOptions<M, E>,
): ForwardRefExoticComponent<StylePropsComponentProps<C, M, E> & RefAttributes<ComponentRef<C>>>
```

Creates a component that accepts style props. The ref is passed to `Component`.\
Options such as the mapping are prepared once when the component is created, so changing `options` afterwards has no effect.

| Parameter   | Type                          | Description                                                 |
| ----------- | ----------------------------- | ----------------------------------------------------------- |
| `Component` | `C`                           | The target component, or an HTML tag name (such as `'div'`) |
| `options?`  | `WithStylePropsOptions<M, E>` | The options of `applyStyleProps` and the option below       |

| Option         | Type     | Description                                                                             |
| -------------- | -------- | --------------------------------------------------------------------------------------- |
| `displayName?` | `string` | The `displayName` of the component. Defaults to `withStyleProps(name of the component)` |

### `applyStyleProps`

```ts
applyStyleProps<P extends LooseDictionary & StyleProps<M, E>, M extends StyleKeyMap = XStyleKeyMap, E extends keyof M = never>(
  props: P,
  options?: ApplyStylePropsOptions<M, E>,
): StyledProps<P, M, E>
```

Returns new props with the style props removed and applied to the style property. `props` itself is not changed.\
Style props are treated as defaults, and the style property takes precedence.\
When there are no style props, the style property is not added.

| Parameter  | Type                           | Description       |
| ---------- | ------------------------------ | ----------------- |
| `props`    | `P`                            | The props         |
| `options?` | `ApplyStylePropsOptions<M, E>` | The options below |

| Option              | Type             | Description                                                                                  |
| ------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| `styleKeyMap?`      | `M`              | The mapping from prop names to style keys. Defaults to `DEFAULT_STYLE_KEY_MAP`               |
| `excludeStyleKeys?` | `readonly E[]`   | Prop names to exclude from the mapping. Excluded props are left as they are                  |
| `styleProp?`        | `string`         | The name of the prop to apply the style to. Defaults to `'style'`                            |
| `styleMergeMode?`   | `StyleMergeMode` | How to combine with an object style property (`'merge'` / `'append'`). Defaults to `'merge'` |

See [`@fringeworks/react-style-proxy`](https://github.com/fringeworks-js/react-style-proxy) for details of `styleProp` and `styleMergeMode`.

### `extractStyleProps`

```ts
extractStyleProps<P extends LooseDictionary & StyleProps<M, E>, M extends StyleKeyMap = XStyleKeyMap, E extends keyof M = never>(
  props: P,
  options?: ExtractStylePropsOptions<M, E>,
): { props: StyledProps<P, M, E>; style: CSSProperties }
```

Returns props without the style props, together with the extracted style. `props` itself is not changed.\
Props whose value is `undefined` are not extracted and are left as they are.

| Parameter  | Type                             | Description                                                         |
| ---------- | -------------------------------- | ------------------------------------------------------------------- |
| `props`    | `P`                              | The props                                                           |
| `options?` | `ExtractStylePropsOptions<M, E>` | Same as `styleKeyMap?` and `excludeStyleKeys?` of `applyStyleProps` |

### Types

| Type                                | Description                                                                             |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| `StyleKeyMap`                       | A mapping from prop names to style keys                                                 |
| `StyleProps<M, E>`                  | The style props (excluding the excluded keys `E`)                                       |
| `StyledProps<P, M, E>`              | `P` without the style props (the excluded keys `E` are kept)                            |
| `StylePropsComponentProps<C, M, E>` | The props of a component created with `withStyleProps`                                  |
| `ApplyStylePropsOptions<M, E>`      | The options of `applyStyleProps`                                                        |
| `ExtractStylePropsOptions<M, E>`    | The options of `extractStyleProps`                                                      |
| `WithStylePropsOptions<M, E>`       | The options of `withStyleProps`                                                         |
| `XStyleKeyMap`                      | The type of the default mapping (also per category, such as `XDecorationStyleKeyMap`)   |
| `StyleKey`                          | The style keys of the default mapping (also per category, such as `DecorationStyleKey`) |
| `PrefixedStyleKeyMap<P, U>`         | A mapping from the style keys `U` prefixed with `P`                                     |

## License

MIT
