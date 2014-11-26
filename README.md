# efte-unit

Efte unit 项目构建工具, 支持 Windows/Linux/OS X

```bash
$ npm install -g efte-unit
```

## 创建 unit-m 项目

```bash
$ eftu unit-m-name
```
注: 项目创建期间, 要求指定 git url

## 其他命令

build unit-m-name

```bash
$ cd unit-m-name
$ eftu build
```

install 依赖包

```bash
# 神似 npm install, 就是 cortex install
$ eftu install zepto --save
```

update 依赖包

```bash
# update 当前项目的所有依赖包
$ eftu update

# update 指定的依赖包
$ eftu update [name...]
```

watch 文件变化

```bash
$ eftu watch
```

link 创建其他项目的软连接

```bash
# apollo 是 eftu 站点上创建的 App 名称
$ eftu link apollo
```
