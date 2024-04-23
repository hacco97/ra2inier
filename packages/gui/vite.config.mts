import { resolve } from 'node:path';

import { defineConfig, loadEnv, UserConfig } from 'vite';
import electron from 'vite-plugin-electron';
import { notBundle } from 'vite-plugin-electron/plugin';

import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, './env')
	env.MODE = mode
	return {
		envDir: 'env',
		server: {
			port: 34242
		},
		resolve: {
			alias: {
				'@': resolve(__dirname, './src'),
				"@css": resolve(__dirname, './src/css/app'),
				'@pages': resolve(__dirname, './src/pages'),
				'@widget': resolve(__dirname, './src/pages/widget'),
			},
		},
		build: {
			outDir: env.VITE_DIST,
		},
		plugins: [
			vue({
				template: {
					compilerOptions: {
						isCustomElement(tag: string) {
							return !!tag.match('-')
						}
					}
				}
			}),
			useElectron(env),
		],
		clearScreen: false,
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/css/mixins/index.scss" as *;'
				}
			}
		}
	} as UserConfig
})

function useElectron(env: Record<string, string>) {
	const isDev = env.MODE === 'development'
	const alias = {
		'~': resolve(__dirname, './electron'),
		'~main': resolve(__dirname, './electron/mainWindow'),
	}
	const plugins = [isDev === true && notBundle()]

	return electron({
		vite: {
			envDir: 'env',
			resolve: { alias },
			build: {
				sourcemap: isDev,
				minify: !isDev,
				outDir: env.VITE_DIST,
				lib: {
					entry: {
						main: "electron/main.ts",
						preload: 'electron/preload/preload.ts',
						safePreload: 'electron/preload/safePreload.ts'
					},
					formats: ['cjs']
				},
				rollupOptions: {
					output: {
						entryFileNames: '[name].js',
					},
				},
			},
			plugins
		},
		onstart({ startup }) {
			startup(['.', '--remote-debugging-port=19222', '--trace-warnings'])
		}
	})
}


