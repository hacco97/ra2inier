# Web Component组件封装   

使用Web Component封装部分小型组件。Vue以组件为单位进行数据的集中管理和维护，每个Vue组件均有一个Watcher来进行数据的监听和更新。  

相较于Vue组件，Webcoponent只提供样式隔离和事件隔离，不具有运行时，较为轻量，可减少Vue大量实例化带来的性能消耗。  

+ flex-input是页面中代替普通text input的元素，可以根据文字内容的长度自动进行伸缩
+ touch-button解决电脑端click事件无法连续触发的问题。