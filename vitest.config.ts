import { defineConfig } from 'vitest/config';

export default defineConfig({
  // link:で参照したパッケージが別のReactを読み込まないようにする
  resolve: { dedupe: ['react', 'react-dom'] },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: { enabled: true },
    typecheck: {
      // `*.test-d.ts(x)`の型アサーションをテストとして実行する
      enabled: true,
      tsconfig: './tsconfig.json',
    },
  },
});
