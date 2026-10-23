import getComponentName from '@fringeworks/react-utils/utils/getComponentName';
import type { ComponentRef, ElementType } from 'react';
import { createElement, forwardRef } from 'react';
import { createStylePropsApplier } from '../_internal/stylePropsCore';
import type { StyleKeyMap, XStyleKeyMap } from '../types';
import type { StylePropsComponentProps, WithStylePropsOptions } from './types';

/**
 * スタイル関連のプロパティをプロパティに指定できるコンポーネントを作成するHOC
 *
 * - スタイル関連のプロパティは既定値として扱い、スタイルプロパティの指定を優先する
 * - マッピングなどのオプションは作成時に1度だけ準備し、描画のたびには作り直さない
 * @param Component コンポーネント
 * @param options オプション
 * @returns
 */
export default function withStyleProps<
  C extends ElementType,
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
>(Component: C, options: WithStylePropsOptions<M, E> = {}) {
  const {
    displayName = `withStyleProps(${getComponentName(Component)})`,
    ...applyOptions
  } = options;
  const applyStyleProps = createStylePropsApplier(applyOptions);

  const StylePropsComponent = forwardRef<
    ComponentRef<C>,
    StylePropsComponentProps<C, M, E>
  >((props, ref) => {
    return createElement(Component, { ref, ...applyStyleProps(props) });
  });
  StylePropsComponent.displayName = displayName;
  return StylePropsComponent;
}
