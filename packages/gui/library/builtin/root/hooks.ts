// hooks文件的模板

// 默认导出一个对象，这个对象包含该词条所需的hooks

/*
hooks列表

+ onValidated : 此hook在对象编辑器的词条输入之后，词条的值变动时调用一次
+ onTranlated: 此hook在对象进行输出的时候进行调用一次，在预览时调用一次
+ onAdjusted: 此hook在对象完成转换后调用一次

*/

function onValidated() {
  // 在这里校验词条的输入值是否正确
}

function onTranlated() {
  // 在这里初步转化词条的值
}

function onAdjusted() {
  //
}

function onOutput() {

}

export default {
  onValidated,
  onTranlated,
  onAdjusted,
  onOutput
}


/*
info.json的内容




*/
