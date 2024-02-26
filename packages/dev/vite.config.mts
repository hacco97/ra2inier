import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig } from 'vite';

const entry: Record<string, string> = {
   main: "word/main"
}

function countWords() {
   for (const wordName of readdirSync('./word')) {
      entry
   }
}

function countMappers() {

}

countWords()

export default defineConfig({
   resolve: {
      alias: {
         '@': resolve(__dirname, 'util')
      }
   },

   build: {
      lib: {
         name: 'hook',
         entry,
         formats: ['umd'],
      },
      sourcemap: false,
      minify: false
   }
})
