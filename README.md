[English](README_en.md)

# RKPins
RKPins 是一个独特的内容收藏项目，支持使用LLM生成pin卡片，将各类信息以md文件的形式进行存储，在使用的过程中形成内容间的关系网（类似知识图谱），我相信这是种直观且便利的记录、检索信息的方式。


# 待开发
## 优化调整
1. 美化界面，适配多种设备
2. 增加环境变量，根据需求调整项目配置。如：GitHub token、LLM的API、网页登录认证等
3. 开发更多种类的卡片样式：
   - 文档
   - 网站
   - 游戏
   - 音乐
   - 书籍
   - 文本
   - 视频
   - 图片
   - 其他

## 功能开发
1. 提供记录信息的页面，将信息保存为md文件
2. 使用LLM的API，自动生成pin卡片
3. 使用LLM的API，自动提取md文件中的关联信息


# 项目特点
- 参考obsidian的文件管理模式，直接使用.md文件储存数据,无需数据库
- 支持在Markdown文件中添加结构化的属性信息
- 支持在Markdown文件正文中使用完整的Markdown语法
- 支持使用#标签进行内容分类和关联
- 提供强大的全文检索功能，快速定位所需信息
- 使用Next.js构建的轻量化项目，可使用vercel部署

# 项目界面
- 数据以卡片形式展示，卡片样式参考扑克牌
- 卡片内容包含md文件的属性部分
- 点击卡片可查看md文件的正文部分

# 功能介绍
1. 通过type类型区分卡片种类
2. 通过tags和#标签建立卡片内容之间的关联
3. 支持全文检索，检索内容可跳转或高亮

# md文件内容格式
1. 参考obsidian，.md文件包含属性和正文
2. 每个.md文件对应一个内容，放在`src/data/`路径下
3. 正文部分使用Markdown语法，支持#标签
## 网站
- 属性：网站名称，网站logo图片地址，网站介绍，网址，type(网站类别)，tags(网站标签)，wiki链接
- 正文：根据需要添加
- 示例：
```
---
title: 哔哩哔哩
url: https://www.bilibili.com
logo: https://upload.wikimedia.org/wikipedia/zh/thumb/b/bd/Bilibili_Logo_Blue.svg/2560px-Bilibili_Logo_Blue.svg.png
description: 国内知名的视频弹幕网站
type:
  - 流媒体
tags:
  - b站
  - 视频
  - 弹幕
  - ACG
  - up主
wiki: https://zh.wikipedia.org/wiki/Bilibili
---
# 正文参考
- 正文部分使用Markdown语法，支持#标签
```