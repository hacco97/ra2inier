import { getThemeMap, saveTheme, useConfigStore } from "@/stores/config"
import { useSingleton } from "@ra2inier/core"
import { defineStore } from "pinia"
import { computed, onMounted, reactive, readonly, watch } from "vue"

// 主题和皮肤控制模块
export enum BuildinTheme {
	dark = '灰暗',
	light = '明亮'
}

function createThemeState() {
	const { config, set } = useConfigStore()

	// 派生当前的主题<config.THEME>的管理变量
	const themeName = computed<string>({
		get() { return config.THEME },
		set(val) { set('THEME', val) }
	})


	// 临时数据，保存着当前的样式方案
	const themeMap: Record<string, string> = reactive({})
	async function setThemeText(name: string, text: string = '') {
		if (typeof name !== 'string') return
		if (!await saveTheme(name, text)) return
		if (!text) delete themeMap[name]
		else themeMap[name] = text
	}
	getThemeMap().then((res) => Object.assign(themeMap, res))
	// 持久化


	// 页面样式管理
	let style: HTMLStyleElement
	onMounted(() => style = document.querySelector('#theme-ctrl')!)
	function setTheme(name: string) {
		if (!style) style = document.querySelector('#theme-ctrl')!
		if (style) style.textContent = themeMap[name] || ''
	}
	watch(() => themeMap[themeName.value], () => setTheme(themeName.value))


	return {
		name: themeName,
		map: readonly(themeMap),
		setTheme: setThemeText,
		useTheme: setTheme,
		addTheme(name: string) {
			if (!(name in themeMap))
				setThemeText(name, `/* 自定义主题：${name} */` + DEFAULT_THEME_TEXT)
		}
	}
}

export const useThemeState = defineStore('theme-state', { state: useSingleton(createThemeState) })
export type ThemeState = ReturnType<typeof useThemeState>


const DEFAULT_THEME_TEXT = `
/* 默认主题：灰暗 */
:root {
	/* 文字字体 */
	/* 普通文字的字体 */
	--font-normal: "MicroSoft YaHei", Arial, sans-serif;
	/* 控件字体 */
	--font-control: "黑体", "MicroSoft YaHei", Arial, sans-serif;
	/* 代码字体 */
	--font-code: "Consolas", "MicroSoft YaHei", Arial, sans-serif;


	/* 字体大小 */
	/* 小型字的大小 */
	--font-size-small: 14px;
	/* 正常字的大小 */
	--font-size-normal: 16px;
	/* 大型字的大小 */
	--font-size-big: 18px;


	/* 文字颜色 */
	/* 普通文字 */
	--font-color-normal: rgb(176, 176, 182);
	/* 前景文字 */
	--font-color-fore: rgb(180, 179, 179);
	/* 背景文字 */
	--font-color-back: rgb(138, 138, 155);
	/* 选中文字颜色 */
	--font-color-selected: rgb(243, 247, 217);
	/* 选中文字背景颜色 */
	--font-color-selback: rgb(135, 145, 167);


	/* 线条颜色 */
	/* 普通线条 */
	--line-color-normal: hsl(221, 9%, 48%);
	/* 亮线条 */
	--line-color-light: hsl(219, 29%, 73%);
	/* 暗线条 */
	--line-color-dark: hsl(220, 2%, 27%);


	/* 线条宽度 */
	/* 普通线条 */
	--line-width-normal: 2px;
	/* 细线条 */
	--line-width-slim: 1px;
	/* 粗线条 */
	--line-width-bold: 3px;

	/* 线条样式 */
	--line-style: solid;


	/* 界面颜色 */
	/* 普通背景 */
	--plane-color-normal: #30353f;
	/* 背景 */
	--plane-color-back: rgb(40, 43, 50);
	/* 前景 */
	--plane-color-fore: #3e4351;
	/* 填充色 */
	--plane-color-default: #191a20;



	/* 界面圆角 */
	/* 普通圆角 */
	--plane-radius-normal: 15px;
	/* 大圆角 */
	--plane-radius-big: 20px;
	/* 小圆角 */
	--plane-radius-small: 10px;


	/* 提示色 */
	/* 成功 */
	--info-color-success: hsl(159.26deg 49.43% 73.84% / 70%);
	/* 详细 */
	--info-color-detail: rgb(124, 142, 167);
	/* 警告 */
	--info-color-warn: hsl(65.11deg 49.43% 73.84% / 68%);
	/* 错误 */
	--info-color-error: hsl(0deg 49.43% 73.84% / 70%);


	/* 滚动条颜色 */
	/* 滚动条按钮 */
	--scroll-color-button: #7479867e;
	/* 滚动条滑块 */
	--scroll-color-thumb: #626b818e;
	/* 滚动条滑道 */
	--scroll-color-track: #53565daf;


	/* 界面尺寸 */
	/* 菜单栏高度 */
	--menubar-height: 30px;
	/* 左侧导航栏宽度 */
	--lefttab-width: 45px;
	/* 底部状态栏高度 */
	--footer-height: 24px;
	/* 主面板导航条高度 */
	--panelnav-height: 30px;
	/* 抽屉栏导航条高度 */
	--foottab-height: 25px;


	/* 背景图片 */
	/* lfp:// 表示图片在ra2 inier程序所在目录下的路径 */
	/* 左上图标 */
	--image-icon: url(lfp://custom/icons/favicontext.svg) center / contain no-repeat;
	/* 编辑器背景 */
	--image-editor: ;
	/* 左侧边栏底纹 */
	--image-lefttab: ;
	/* 右下抽屉图片 */
	--image-foottab: ;
}

/* 整个页面 */
#home {}

/* logo */
#favicon {
	background-color: var(--plane-color-fore);

	a {
		filter: invert(1);
	}
}

/* 标题 */
#title {}

/* 右键菜单 */
#ctxmenu {}

/* 菜单栏 */
#menubar {}

/* 左侧边栏整体 */
#lefttab {}

/* 左侧边栏导航按钮 */
.lefttab-button {}

/* 左侧边面板 */
#leftpanel {}

/* 右下边栏 */
#foottab {
	background-color: rgba(70, 80, 90, 0.25);
}

#home[GPU=yes] #foottab {
	backdrop-filter: blur(2px);
}

/* 主界面 */
#panel {}

/* 主界面导航条 */
.panel-nav {}

/* 主界面头部 */
.panel-header {
	background-color: rgba(70, 80, 90, 0.25);
}

.panel-header::after {
	content: '';
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 1px;
	border-top: 1px solid var(--line-color-normal);
}

#home[GPU=yes] .panel-header {
	backdrop-filter: blur(2px);
}

/* 右下边栏导航条 */
.footnav {}


/* 对象编辑器 */
#object-editor {
	--line-height: 26px;
	--textbox-radius: 13px;
	--color-line-even: rgba(56, 86, 117, 0.167);
	--color-line-odd: rgba(79, 121, 101, 0.272);
	--color-word: rgba(48, 89, 112, 0.155);
	--color-word-selected: rgba(97, 123, 149, 0.667);
	--color-input: rgba(129, 115, 162, 0.105);
	--color-input-focus: var(--info-color-detail);

	.oe-line {}

	.oe-input:focus {
		color: white;
	}
}
`