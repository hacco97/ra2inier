import { ChildProcess, spawn } from 'node:child_process';

import { defineConfig, Plugin } from 'vite';

function createStarter() {
	let child: ChildProcess

	return <Plugin>{
		name: 'starter',
		buildEnd() {
			if (child) child.kill()
		},
		writeBundle() {
			child = spawn('node', ['./dist/main.js'], { stdio: 'inherit' })
		}
	}
}

export default defineConfig({
	build: {
		lib: {
			entry: 'main.ts',
			formats: ['es', 'iife', 'cjs'],
			fileName: 'main',
			name: 'demo'
		},
		minify: false,
		// watch: {
			// include: ['main.ts', 'src', 'tsconfig.json', 'vite.config.ts']
		// },
		sourcemap: true
	},
	// plugins: [createStarter()]
})

