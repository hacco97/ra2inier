export interface WebComponent {
   connectedCallback?(): void
   disconnectedCallback?(): void
   adoptedCallback?(): void
   attributeChangedCallback?(name: string, oldValue: string, newValue: string): void
}

export namespace WebComponent {
   export const observedAttributes: string[] = []
}
