[English](README_en.md)

# RKPins
用于聚集各大软件的跳转链接，便于分享交流

## 功能计划
- 内容分类
- [x] 卡片评语
- [ ] 卡片

## 项目说明

- 使用Next.js 14 构建
- 使用JavaScript编写
- 单页面

- data路径下存放不同类别的文件夹：shop(购物)、music(音乐)、video(视频)
- 每个文件夹下存放该类别的md文件，文件中包含对应软件跳转链接和内容介绍
- 读取data路径下内容，将有效内容解析为卡片
- 不同文件夹对应不同类别，点击类别展示该类别下所有卡片
- 点击卡片，跳转至对应链接

## 项目结构（开发中）

- src
  - app
    - api：全局通用接口
    - globals.css：全局样式
    - layout.js：布局
    - page.js：主页面
  - components：组件
    - Card.js：卡片组件
    - CategoryList.js：类别列表组件
  - utils：工具
    - parserFactory.js：解析器工厂，根据不同类别选择不同解析器
    - parsers：解析器
      - bilibiliParser.js：bilibili解析器
      - pddParser.js：拼多多解析器
      - mdParser.js：默认md解析器
- data：数据
  - shop：购物类软件链接汇总
  - music：音乐类软件链接汇总
  - video：视频类软件链接汇总