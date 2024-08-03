#!/bin/bash

# 获取传递的第一个参数作为 SPIDER_TYPE
SPIDER_TYPE=$1

# 检查是否传递了 SPIDER_TYPE 参数
if [ -z "$SPIDER_TYPE" ]; then
  echo "Error: SPIDER_TYPE is not provided."
  exit 1
fi

# 打印 SPIDER_TYPE 以供调试
echo "Running spider with type: $SPIDER_TYPE"

# 执行命令，传递环境变量
cross-env NODE_ENV=development SPIDER_TYPE=$SPIDER_TYPE nodemon
