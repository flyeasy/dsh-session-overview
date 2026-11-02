# dsh-session-overview

[English](README.md) | 中文

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 社区插件：把**所有工作区的最近会话**放进一个列表，并用带颜色的底标标明每个会话来自哪个工作区。

## 为什么

原生侧栏把会话按工作区分组，想找"另一个项目里的那个会话"得逐个工作区点开找。这个插件把所有会话按时间倒序排成一个列表，工作区信息始终可见。

## 功能

- **侧栏折叠区**——侧栏底部"最近会话"折叠块，显示最近 10 个会话，展开状态会记住；
- **总览面板**——侧栏图标列的「全部会话」打开完整视图：按标题或工作区搜索、分页加载、点底标按工作区过滤；
- **工作区彩色底标**——由工作区文件夹路径哈希出的 10 色调色板，同一工作区永远同色；
- **选中高亮**——主区域当前打开的会话在列表里实时高亮；
- **运行中转圈**——正在运行的会话显示旋转的缺口圆环，静止会话是工作区色实心点；
- **右键菜单**——与原生会话行相同的操作：置顶/取消置顶、重命名、创建分支、复制标题/会话 ID、归档/取消归档，全部走宿主同一通道，状态与原生侧栏互通。

## 安装

```bash
dsh plugin --profile <你的 profile> add dsh-session-overview
```

也可以把本目录作为本地 bundle 安装到 profile。

## 兼容性

在 DeepSeek Harness 0.2.1-rc.5（macOS 桌面版）上开发验证。使用的槽位契约：`sidebar.panellist`、`main`、`sidebar.footer.action`；客户端服务：`sessions`、`workspaces`、`uiWorkspace`、`layout`、`locale`。

## 许可

[MIT](LICENSE)
