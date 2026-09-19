# 通用T显编辑器

网易基岩版 `titleraw` / actionbar 动画排版编辑器。多帧动画合并、动态积木库、像素级对齐，完全本地离线运行。

## 在线地址

- 在线使用：<https://NovaElysian.github.io/>

## 功能特性

- **多帧动画合并**：一键生成复杂的 translate 嵌套指令
- **动态积木库**：插入跑马灯、状态机等高级组件
- **变量支持**：直接使用 selector / score 实体与计分板变量
- **像素级对齐**：内置 Minecraft 原生字体宽度数据
- **所见即所得**：实时画布预览与时间轴编辑
- **多格式导出**：mcfunction 指令、纯 JSON、Markdown
- **语法适配**：网易中国版 / 标准基岩版均可直接导入命令方块

## 项目结构

采用多文件结构，便于维护：

```
web/
  index.html            入口页面
  css/                 样式（style.css + 工具类）
  js/                   逻辑（app/events/timeline/ui/tutorial 等）
  data/                 字体宽度与字体数据
```

## 部署方式

- 仓库名：`NovaElysian.github.io`
- 发布源：`main` 分支根目录（`web/` 内容）
- 资源带 `v=1.1.0` 版本号，避免浏览器缓存旧版本

## 本地使用

双击或用浏览器打开 `web/index.html` 即可，无需服务器，无需安装依赖。

## 使用说明

打开首页点击「打开使用教程」，进入交互式分步教程，按弹窗提示操作即可。