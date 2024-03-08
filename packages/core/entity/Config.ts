/**
 * 程序前端的设置
 */
export interface ClientConfig {
   saveConfig(): void
   setByKey(key: string, val: any): void
   getClientConfig(): Record<string, string>
   addProjectHistory(history: string): string
   [x: string]: any
}

/**
 * 程序前端的设置
 */
export class ClientConfig {
   /**
    * 当前的主题名称
    */
   THEME = ''
   /**
    * 开启GPU加速  yes  or  no
    */
   GPU = ''
   /**
    * 当前的项目位置
    */
   PROJECT_PATH: string = ''
   /**
    * 项目的自动保存时间间隔
    */
   PROJECT_AUTO_SAVE_INTERVAL = 5 * 60 * 1000
   /**
    * 在提示框被关闭时自动确认提示框的内容
    */
   PROMPT_SUBMIT_ON_CLOSE = false
   /**
    * 构建输出文件夹
    */
   OUTPUT_DIR = './out'
   /**
    * 窗口大小，用于记录上次工作的窗口大小
    */
   readonly WINDOW_SIZE: string = ''
   /**
    * 近期打开过的历史项目，最多保存8个
    */
   PROJECT_HISTORY: string[] = []
   /**
    * 默认的新建项目位置
    */
   DEFAULT_PROJECT_DIR: string = ''
}

/**
 * 程序前后端的设置
 */
export class Config extends ClientConfig {
   /**
    * 当前程序的启动位置
    */
   declare CWD: string
   /**
    * 文件系统协议
    */
   declare FILE_PROTOCOL: string
   /**
    * 客户端主题文件夹
    */
   declare THEME_DIR: string
   /**
    * 日志文件文件夹位置
    */
   declare LOG_FILE_DIR: string
   /**
    * 全局第三方可执行文件的位置
    */
   declare GLOBAL_ADDONS_DIR: string
   /**
    * 全局包的位置
    */
   declare GLOBAL_PACKAGE_DIR: string
   /**
    * 全局教程文件的位置
    */
   declare GLOBAL_TUTORIAL_DIR: string
   /**
    * 主窗口名字
    */
   declare MAIN_WINDOW_NAME: string
   /**
    * 开发环境标识
    */
   declare IS_DEV: boolean
   /**
    * 开发服务器URL
    */
   declare DEV_URL: string
   /**
    * 程序的配置信息会每过一段时间自动保存
    */
   declare CONFIG_AUTOSAVE_INTERVAL: number
   /**
    * vue开发工具目录
    */
   declare VITE_VUE_DEVTOOLS: string
}

export interface Rectangle {
   x: number,
   y: number,
   height: number,
   width: number
}

export class WindowSize {
   x: number = 0
   y: number = 0
   width: number = 1280
   height: number = 960
   max?: boolean = false

   constructor(size: string) {
      const arr = size.split(',').map((val) => parseInt(val))
      this.x = arr[0]
      this.y = arr[1]
      this.width = arr[2]
      this.height = arr[3]
      this.max = arr[4] === 1
   }

   toString() {
      return `${this.x},${this.y},${this.width},${this.height},${this.max ? 1 : 0}`
   }

   setSize(val: Rectangle) {
      this.x = val.x
      this.y = val.y
      this.width = val.width
      this.height = val.height
   }

   maximun() { this.max = true }

   unmax() { this.max = false }

   getSize(): Rectangle {
      return {
         x: this.x,
         y: this.y,
         width: this.width,
         height: this.height
      }
   }
}
