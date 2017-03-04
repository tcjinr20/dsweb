#!/usr/bin/env python
# coding:utf-8

from engine import dsEngine
from spy import dsSpy
import threading
from monodb import status

if __name__ == "__main__":

    def check():
        sta = status.find({'type': 'spy'}).next()
        if sta['running'] == 0:
            en.stop(1)
            return
        threading.Timer(2, check).start()
    threading.Timer(2, check).start()

    en = dsEngine()
    en.add('www.bttiantangs.com')
    en.start()




