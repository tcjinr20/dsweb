#!/usr/bin/env python
# coding:utf-8
import logging
import time
import os

# infoLogger = logging.getLogger("spyinfo")
fold = 'log'
filename = os.path.join('log',time.strftime('%Y-%m-%d', time.localtime(time.time()))+'.txt')
# infoHandler = logging.FileHandler(filename)
# infoHandler.setLevel(logging.DEBUG)
formatter = '%(levelname)s--%(asctime)s--%(message)s'
# infoHandler.setFormatter(formatter)
if not os.path.exists(fold):
    os.makedirs(fold)
logging.basicConfig(filename=filename,level=logging.DEBUG,format =formatter)


def trace(message):
    logging.info(message)


def error(msg):
    logging.debug(msg)

