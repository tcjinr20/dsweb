#!/usr/bin/env python
# coding:utf-8

from getopt import getopt
import sys
from analysis import Search
import json
if __name__ == '__main__':
    opt, arg = getopt(sys.argv[1:], 'f:')
    opt = dict(opt)
    path = opt.get('-f')

    if path is not None:
        print json.dumps(Search(1).search(path))
