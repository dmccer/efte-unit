PREFIX ?= /usr/local
MANPREFIX ?= "$(PREFIX)/shara/man/man1"

install:
	@mkdir -p $(DESTDIR)$(MANPREFIX)
	@mkdir -p $(DESTDIR)$(PREFIX)/bin

	@echo '正在安装 EFTE 项目构建工具 ...'
	cp -f bin/efte.sh $(DESTDIR)$(PREFIX)/bin/efte
	@chmod 755 $(DESTDIR)$(PREFIX)/bin/efte

	@echo '正在安装 EFTE 帮助文档 ...'
	cp -f man/efte.1 $(DESTDIR)$(MANPREFIX)

uninstall:
	@echo '正在卸载 EFTE 项目构建工具 ...'
	rm -f $(DESTDIR)$(PREFIX)/bin/efte

	@echo '正在删除 EFTE 帮助文档 ...'
	rm -f $(DESTDIR)$(MANPREFIX)/efte.1
