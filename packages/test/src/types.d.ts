/// <reference types="vite/client" />

declare global {
   interface PromiseConstructor {
      wait(n: number): void
   }

}

export {};
