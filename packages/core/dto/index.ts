export * from './objectDto'
export * from './packageDto'

export interface ToDto {
   /**
    * 这个发法由API center调用
    * 用于处理不能够经过postMessage的数据类型
    */
   toDto?(): ToDto
}
