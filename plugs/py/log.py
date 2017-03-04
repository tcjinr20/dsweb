#!/usr/bin/env python
# coding:utf-8
import logging
import time

# infoLogger = logging.getLogger("spyinfo")
filename = './log/'+time.strftime('%Y-%m-%d', time.localtime(time.time()))+'.txt'
# infoHandler = logging.FileHandler(filename)
# infoHandler.setLevel(logging.DEBUG)
formatter = '%(asctime)s - %(filename)s - [line:%(lineno)d] - %(levelname)s - %(message)s'
# infoHandler.setFormatter(formatter)

logging.basicConfig(filename=filename,level=logging.DEBUG,format =formatter)


def trace(message):
    logging.debug(message)
