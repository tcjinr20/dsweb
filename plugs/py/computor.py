#!/usr/bin/env python
# coding:utf-8

import logging
import psutil
import os
from log import trace

# 获取当前运行的pid
p1 = psutil.Process(os.getpid())

# 打印本机的内存信息
trace('直接打印内存占用： ' + (str)(psutil.virtual_memory))

# 打印内存的占用率
trace('获取内存占用率： ' + (str)(psutil.virtual_memory().percent) + '%')

# 本机cpu的总占用率
trace('打印本机cpu占用率： ' + (str)(psutil.cpu_percent(0)) + '%')

# 该进程所占cpu的使用率
trace(" 打印该进程CPU占用率: " + (str)(p1.cpu_percent(None)) + "%")

# 直接打印进程所占内存占用率
trace(p1.memory_percent)

# 格式化后显示的进程内存占用率
trace("percent: %.2f%%" % (p1.memory_percent()))