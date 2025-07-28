# 使用Node.js 18 Alpine镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# 复制应用代码
COPY . .

# 创建logs目录
RUN mkdir -p logs

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S whatsapp -u 1001

# 设置文件权限
RUN chown -R whatsapp:nodejs /app
USER whatsapp

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http=require('http');const options={hostname:'localhost',port:3000,path:'/health',timeout:2000};const req=http.request(options,(res)=>{if(res.statusCode===200){process.exit(0)}else{process.exit(1)}});req.on('error',()=>process.exit(1));req.on('timeout',()=>process.exit(1));req.end();"

# 启动应用
CMD ["npm", "start"]