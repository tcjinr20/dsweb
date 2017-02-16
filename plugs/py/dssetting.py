#!/usr/bin/env python
# coding:utf-8
import os.path as path
"""图片的相似度的汉明距离"""
homodis = 1.5

"""蜘蛛下载图片的临时位置"""
download = path.realpath('upload/spy')

"""图片最终放置位置"""
copypath = 'upload'
"""图片缩放大小"""
imgw = 256
"""查找限制"""
limit = 2000

redisdb = {'host': '127.0.0.1', 'port': 6379, 'password': 'dsimg1234'}
mongodb = {'host': '127.0.0.1', 'port': 27017, 'password': 'dsimg1234'}
