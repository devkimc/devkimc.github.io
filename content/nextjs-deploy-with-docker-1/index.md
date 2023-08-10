---
emoji: 💻
title: docker, nextjs 이미지 배포하기 - 1 (+쉘 스크립트)
date: '2023-02-19 23:00:00'
author: vvs-kim
tags: ci/cd
categories: 블로그 ci/cd docker
---

## 프론트 개발자도 도커 이미지를 만들어야 할까?

### 1. 백엔드 개발자와 협업

백엔드 개발자가 JAVA, DB 등을 도커HUB 에 배포하면,
프론트엔드 개발자가 해당 이미지를 내려 받고 컴포즈 하는 방식으로 작업했습니다.
그런데 백엔드 개발자를 많이 만나보지는 않았지만, 같이 협업을 하다보면
'제 자리에서도 프론트 코드를 실행하고 싶어요', '화면을 보면서 테스트 하고 싶어요' 등등 백엔드 개발자의 요구 사항이 생겼습니다.

처음에는 도커가 왜 필요한지 몰랐기에 백엔드 개발자 자리에서

1. git clone
2. node install
3. env 파일 전달
4. os 가 달라서 생기는 오류 해결...
5. 그래서 언제 되는거죠..?

이 모든 것을 진행하다가 결국 서버로 배포해서 확인을 했었습니다.
만약에 nextjs 를 도커 이미지로 만들었다면, 이런 불편함은 없었을 겁니다.

<br />

### 2. 운영환경의 빌드파일 버전 관리

이전 프로젝트에서 CI/CD 를 적용하기 위해 jenkins, github-action 을 사용했습니다.
branch 를 통합하면 자동으로 배포가 된다는 사실은 장점이었습니다.
그러나 배포 후 운영환경에서 에러가 발생하거나 실수를 발견했을 때,

아무런 준비를 하지 않았더라면

1. 원인 체크(또는 롤백)
2. package install, build
3. 서버로 빌드 파일 전송

이 모든 것을 진행해야 하는데, 2~3분의 시간이 걸립니다.
코드 양이 많으면 훨씬 더 오래 걸릴 겁니다.
이 시간동안 사용자가 오류 화면을 보지 않기 위해서는
빌드 파일을 버전 관리하여 빠른 시간내로 전송을 받아서 재실행 하는 방법이 있습니다.
**도커를 사용하면 운영환경에 맞는 이미지를 배포하여 버전 별로 내려받아 실행할 수 있습니다.**

<br />

## 시작하기

제가 궁금했고, 중요하다고 생각한 부분을 작성한 글입니다.
nextjs 로 작성된 코드를 배포하기 위한 내용입니다.

### 로컬 내의 저장파일

#### 1. Dockerfile 작성

```bash
FROM node:16.17.0-alpine

RUN mkdir -p /app
WORKDIR /app
ADD ./ /app

RUN npm install -g pm2

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
```

빌드한 Next 파일을 도커 이미지로 생성하고, pm2 로 실행하기 위한 스크립트입니다.
alpine: 실행에 필요한 최소의 이미지 버전입니다. 사용하지 않을 시 이미지 용량이 커져서 배포 시간이 증가합니다.

#### 2. ecosystem.config.js 작성

```javascript
module.exports = {
  apps: [
    {
      name: 'test',
      cwd: './',
      script: 'yarn start',
    },
  ],
};
```

name: Pm2에서 실행하는 앱 이름
cwd: 스크립트를 실행할 위치

#### 3. .dockerignore 작성

```
.git
.github
.vscode
.husky

scripts
```

이미지 용량을 최소화 하기 위해서 사용합니다.
도커 빌드 시 사용되지 않을 폴더, 파일을 적어줍니다.

#### 4. docker build, push 쉘 스크립트 작성

```bash
##!/bin/bash
repository=testname/testrepo
os=linux/amd64

### 업데이트 버전 입력
read -p "Enter the version: " version

echo "=>>> docker build front images..."
docker build -f Dockerfile --platform $os -t $repository:$version .

echo "=>>> docker push front container...."
docker push $repository:$version

echo "🚀 success $version push"
```

도커 이미지를 버전 별로 관리하기 위한 쉘 스크립트 입니다.
사용자는 next 빌드 후 쉘스크립트를 실행하면 됩니다.

os: 운영서버를 생성시 x86 프로세서를 적용했다면, 그에 맞게 빌드하기 위해 변수로 설정했습니다.
read -p: 입력받은 버전으로 이미지를 생성하고 HUB에 푸시합니다.

<br />

### 운영서버 내의 저장파일

#### 1. docker-compose.yml 작성

```bash
version: '3'
services:
    node:
        container_name: test-front
        image: testname/testrepo:1.0
        ports:
            - '3000:3000'
        restart: always
        environment:
            TZ: Asia/Seoul
```

<br />

#### 2. docker pull, compose 쉘 스크립트 작성

```bash
##!/bin/bash
repository=testname/testrepo

## 업데이트 버전 입력
read -p "Enter the version: " version
sed -i "5s/.*/        image: testname\/testrepo:$version/" docker-compose.yml

## 업데이트 버전 다운로드
echo "=>>> docker stop front container...."
docker stop $(docker ps -q -af "name=testrepo")

echo "=>>> docker remove front container...."
docker rm $(docker ps -q -af "name=testrepo")

echo "=>>> docker pull dev version....."
docker pull $repository:$version

echo "=>>> docker compose..."
docker-compose up -d

echo "=>>> docker remove previous image..."
docker rmi $(docker images -f "dangling=true" -q)

## 저장공간 용량, 업데이트 확인
echo "\033[32mcheck storage\033[0m"
df -hs

echo "\033[32mcheck deploy\033[0m"
docker ps

echo "🚀 success $version deploy"
```

1. 사용자가 pull 받을 이미지 버전을 입력
2. docker-compose.yml 파일 내의 버전이 수정됨
3. 실행되고 있는 컨테이너 중지 및 삭제
4. 이미지 Pull 받은 후 컨테이너 실행

sed -i: 특정 파일 내의 문자열을 수정하기 위해서 사용

<br />

## 부족한 점

사용자는

1. 쉘 스크립트(도커 이미지를 생성하고 HUB에 푸시함) 실행 후 버전 입력
2. 운영 서버에 접속
3. 쉘 스크립트(도커 이미지를 pull 받고 컨테이너를 실행함) 실행 후 버전 입력

이러한 간단한 플로우로 이미지를 배포 및 버전 관리를 할 수 있습니다.
그렇지만 **빌드하는 시간이 오래 걸리고, 그 시간을 기다려서 서버에 접속한다는 것은 불편한 일**이라고 생각이 듭니다.
1~3번 과정을 자동화하기 위해 githun-action 으로 CI/CD 를 구축해보려 합니다.

```toc

```
