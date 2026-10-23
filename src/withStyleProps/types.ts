import type { ComponentPropsWithoutRef, ElementType } from 'react';
import type { ApplyStylePropsOptions } from '../applyStyleProps';
import type { StyleKeyMap, StyleProps, XStyleKeyMap } from '../types';

/**
 * withStylePropsのオプション
 */
export type WithStylePropsOptions<
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
> = ApplyStylePropsOptions<M, E> & {
  /**
   * コンポーネントに設定するdisplayName\
   * 未指定の場合は`withStyleProps(コンポーネントの名前)`
   */
  displayName?: string;
};

/**
 * withStylePropsで作ったコンポーネントのプロパティ
 *
 * - 除外したキー（`E`）は、元のコンポーネントのプロパティの型のまま残す
 */
export type StylePropsComponentProps<
  C extends ElementType,
  M extends StyleKeyMap = XStyleKeyMap,
  E extends keyof M = never,
> = Omit<ComponentPropsWithoutRef<C>, keyof StyleProps<M, E>> &
  StyleProps<M, E>;
