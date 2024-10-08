[中文](README.md)
# RKPins
RKPins is a unique content bookmarking project that directly uses markdown files to store data, inspired by Obsidian. It supports adding information as properties and content in md files, supports #tags, and supports Markdown syntax. At the same time, it is also an intuitive and convenient tool for searching, navigating, and browsing information.

# Project Features
- Directly uses Markdown files to store data, similar to Obsidian
- Static website, ultra-lightweight, can be deployed using Vercel
- Displays relationships between websites through #tags

# Project Interface
- Data is displayed in card form, with card styles inspired by playing cards
- Card content includes the property section of the md file
- Click on the URL to jump to the corresponding website
- Click on the card to view the content section of the md file

# Function Introduction
1. Categorize websites by type
2. Display relationships between websites through tags and #tags, and set weights, with higher weights ranking higher

# MD File Content Description
1. Refer to Obsidian
2. Create an MD file for each website, placed in the `src/data/` path
3. The property section of the md file includes: website name, website logo image address, website description, URL, type (website category), tags (website tags), wiki link
4. The content section uses Markdown syntax and supports #tags

Example:
```
---
title: Bilibili
url: https://www.bilibili.com
logo: https://upload.wikimedia.org/wikipedia/zh/thumb/b/bd/Bilibili_Logo_Blue.svg/2560px-Bilibili_Logo_Blue.svg.png
description: A Chinese video sharing website
type:
  - Streaming Media
tags:
  - Bilibili
  - Video
  - Bullet Screen
  - ACG
  - Up-to-date
wiki: https://en.wikipedia.org/wiki/Bilibili
---
# Content Reference