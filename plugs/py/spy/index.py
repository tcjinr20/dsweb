#!/usr/bin/env python
# coding:utf-8

from engine import dsEngine
from spy import dsImg
import threading
from monodb import status
import sys
"""递归限制解除"""
sys.setrecursionlimit(1000000)

if __name__ == "__main__":
    # opt, arg = getopt(sys.argv[1:],'d:')
    # opt =dict(opt)
    # domain = opt.get('-d')

    def check():
        sta = status.find({'type': 'spy'}).next()
        if sta['running'] == 0:
            en.stop(1)
            return
        threading.Timer(2, check).start()
    threading.Timer(2, check).start()

    en = dsEngine()
    en.add(dsImg('www.duitang.com'))
    en.start()



