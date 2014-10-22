#!/bin/bash

PREFIX='/usr/local'
MANPREFIX="$PREFIX/share/man/man1"

mkdir -p $MANPREFIX
mkdir -p $PREFIX/bin

echo '正在卸载 EFTE 项目构建工具 ...'
rm -f $PREFIX/bin/efte

# echo '正在删除 EFTE 帮助文档 ...'
# rm -f $MANPREFIX/efte.1
