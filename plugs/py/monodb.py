#!/usr/bin/env python
# coding:utf-8
import pymongo
from dssetting import mongodb as config

conn = pymongo.MongoClient(config['host'], config['port'])
status = conn.blog.spystatustable
