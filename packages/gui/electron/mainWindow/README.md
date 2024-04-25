# services层和controller层合并

+ 每个窗口对象单独声明一个ioc容器对象，只处理当前窗口的前端请求。  

+ services面向controllers层，直接给services层的对象添加controller装饰器，减少业务的复杂程度防止过度抽象和封装。减少一层controller层的代码。  

+ controller的内容由ioc handler直接处理。handler需要提供test功能，以提供接口测试的能力。

# **TODO**
+ aspect，实现AOP能力。提供@aspect类装饰器和@advice方法装饰器；
+ 实现@component和@controller装饰器的version参数，以健全开闭原则的实现。