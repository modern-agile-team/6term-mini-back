

# Node.js 버전을 기반으로 하는 도커 이미지 사용
FROM node:18.16.0-alpine

# 애플리케이션 코드를 컨테이너 내부에 복사
WORKDIR home/app

COPY . .

# 애플리케이션 의존성 설치
RUN npm i
RUN npm install -g nodemon

# 애플리케이션 실행 
CMD ["npm", "start"]

# 애플리케이션을 실행할 포트
EXPOSE 3000