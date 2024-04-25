
# 容器中的初始对象  

## 在每个容器中应当初始化的对象:  
   + app-config：整个程序的设置  
   + client-config：用户的设置  
   + window：当前window实例  
   + front-logger：向前端的控制台打印消息  
   + front-emitter：向前度推送事件  
  
## controller的options参数中的初始对象
   + window：当前的window实例
   + reject：拒绝器，拒绝当前的请求
   + \[PATH_VARIABLE\]：路径变量
