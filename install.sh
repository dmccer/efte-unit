#!/bin/bash

PREFIX='/usr/local'
MANPREFIX="$PREFIX/share/man/man1"

mkdir -p $MANPREFIX
mkdir -p $PREFIX/bin

echo '正在安装 EFTE 项目构建工具 ...'
cp -f bin/efte.sh $DESTDIR$PREFIX/bin/efte
chmod 755 $PREFIX/bin/efte

# echo '正在安装 EFTE 帮助文档 ...'
# cp -f man/efte.1 $MANPREFIX
