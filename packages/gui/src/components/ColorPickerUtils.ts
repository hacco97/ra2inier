
export interface HsvColor {
   hue: number,
   saturation: number,
   value: number
}

export interface RgbColor {
   red: number,
   green: number,
   blue: number
}


const map_table = [
   [0, 3, 1],
   [2, 0, 1],
   [1, 0, 3],
   [1, 2, 0],
   [3, 1, 0],
   [0, 1, 2],
]

export function hsv2rgb(hsv: HsvColor) {
   const h = hsv.hue % 360,
      s = hsv.saturation,
      v = hsv.value
   const i = Math.floor((h / 60) % 6)
   const f = h / 60 - i,
      x = v * (1 - s),
      y = v * (1 - f * s),
      z = v * (1 - (1 - f) * s)
   const table = map_table[i], initList = [v, x, y, z]
   return table.map((n) => Math.round(initList[n] * 255))
}

export function rgb2hsv(rgb: RgbColor) {
   const r = rgb.red / 255, g = rgb.green / 255, b = rgb.blue / 255
   const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
   let h = 0, v = max, s = max == 0 ? 0 : d / max;
   if (max !== min) {
      switch (max) {
         case r: h = (g - b) / d + (g < b ? 6 : 0); break;
         case g: h = (b - r) / d + 2; break;
         case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
   }
   return [Math.round(h * 360), s, v];
}

