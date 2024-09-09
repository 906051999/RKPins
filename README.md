[English](README_en.md)

# RKPins
RKPins 是一个独特的内容收藏项目，它直接使用markdown文件存储数据，参考Obsidian：支持在md文件中将信息添加为属性和正文，支持#标签，支持Markdown语法。同时，它也是一个直观方便的检索、导航、浏览信息的工具。

# 项目特点
- 直接使用Markdown文件储存数据，类obsidian
- 静态网站，超轻量化，可使用vercel部署
- 通过#标签，展示网站之间的相互关系

# 项目界面
- 数据以卡片形式展示，卡片样式参考扑克牌
- 卡片内容包含md文件的属性部分
- 点击网址，跳转至对应网站
- 点击卡片可查看md文件的正文部分

# 功能介绍
1. 通过type类型分类网站
2. 通过tags和#标签，展示网站之间的相互关系，并且设定权重，权重越高，排名越靠前

# md文件内容说明
1. 参考obsidian
2. 每个网站建立一个MD文件，放在`src/data/`路径下
3. md文件的属性部分包含：网站名称，网站logo图片地址，网站介绍，网址，type(网站类别)，tags(网站标签)，wiki链接
4. 正文部分使用Markdown语法，支持#标签

示例：
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