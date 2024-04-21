import { makeScrollxer, makeStickScrollxer } from "@/hooks/scrollx"
import { makeSvgIcon } from "@/hooks/svgIcon"

export default {
	scrollx: { mounted: makeScrollxer },
	scrolls: { mounted: makeStickScrollxer },
	svgicon: { mounted: makeSvgIcon }
}

