declare global {
   namespace eApi {

      function exec<T>(command: string, ...args: any[]): Promise<ServResponse<T>>

      function send(channel: string, ...args: any[]): void

      function on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void

      function getPort(): MessagePort

      const port2: MessagePort
   }
}

export {};
