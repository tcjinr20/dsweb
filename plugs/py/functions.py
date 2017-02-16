#!/usr/bin/env python
#coding:utf-8

import os

fd = ('.bmp', '.dib', '.jpeg', '.jpg', '.jpe', '.png', '.pbm', '.pgm', '.ppm', '.sr', '.ras', '.tiff', '.tif', '.exr', '.jp2')

# Windows位图文件 - BMP, DIB；
            # JPEG文件 - JPEG, JPG, JPE；
            # 便携式网络图片 - PNG；
            # 便携式图像格式 - PBM，PGM，PPM；
            # Sun rasters - SR，RAS；
            # TIFF文件 - TIFF，TIF;
            # OpenEXR HDR 图片 - EXR;
            # JPEG 2000 图片 - jp2。
def isImage(nfile):
    fname = os.path.basename(nfile)
    for fn in fd:
        if fn in fname:
            return True
    return False
