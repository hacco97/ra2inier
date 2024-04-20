import { useThemeState } from "@/states/theme"
import { onUnmounted } from "vue"


export function useThemeChangeAnimation() {
	const theme = useThemeState()
	const position = new CSSStyleSheet()
	const animation = new CSSStyleSheet()
	animation.replaceSync(`
		@keyframes a1 {
			from {
				clip-path: circle(0% at var(--transition-x, 0px) var(--transition-y, 0px));
			}
		
			to {
				clip-path: circle(120% at var(--transition-x, 0px) var(--transition-y, 0px));
			}
		}
		
		::view-transition-new(root) {
			animation: a1 1s ease;
		}
		
		::view-transition-old(root) {
			animation: none;
		}
	`)
	document.adoptedStyleSheets.push(position, animation)
	onUnmounted(() => {
		const target = document.adoptedStyleSheets.findIndex(x => x === position)
		document.adoptedStyleSheets.splice(target, 1)
		const target2 = document.adoptedStyleSheets.findIndex(x => x === animation)
		document.adoptedStyleSheets.splice(target2, 1)
	})
	async function onThemeChange(newTheme: string) {
		if (!(newTheme in theme.map) || newTheme === theme.name)
			return false
		document.startViewTransition!(async () => {
			theme.useTheme(newTheme)
			position.replaceSync(`
			:root {
				--transition-x: ${x}px;
				--transition-y: ${y}px;
			}`
			)
		}).ready
		theme.name = newTheme
	}

	let x = 0, y = 0
	function onThemeMouseMove(e: MouseEvent) {
		x = e.clientX, y = e.clientY
	}

	return {
		onThemeChange,
		onThemeMouseMove
	}
}