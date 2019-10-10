
### 安装

```sh
yarn add thrift @shynome/thrift-server
yarn add -D @types/thrift 
```

### 使用

#### 生成 `thrift` 代码

```sh
yarn add -D @shynome/thrift-typescript
$(yarn bin thrift-typescript) --sourceDir . helloSvc.thrift
```
