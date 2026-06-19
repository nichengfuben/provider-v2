# src/webui/templates/scripts_bootstrap.py

该模块负责页面事件绑定与初始化启动流程。

v2.2.153 起拆分为立即执行（核心初始化）和 5 个按标签页延迟初始化函数，配合 LazyLoader 按需加载各标签页资源。
