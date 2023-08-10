---
emoji: 💻
title: docker, nextjs 이미지 배포하기 - 2 (github action 자동 배포)
date: '2023-02-25 23:00:00'
author: vvs-kim
tags: ci/cd
categories: 블로그 ci/cd docker
---

[[docker] node, nextjs 이미지 배포하기 - 1](https://vvs-kim.github.io/nextjs-deploy-with-docker-1/)
이전 게시물과 이어지는 내용입니다.
추가 설명이 필요한 부분은 이전 게시물을 참고 해주시면 됩니다.

## 자동화가 필요해..

전 게시물에서 node 와 nginx 를 도커 이미지로 생성했고,
각 컨테이너를 실행하는 쉘 스크립트를 만드는 내용을 작성했습니다.

<br />

### 쉘 스크립트를 이용한 수동 배포의 단점

사용자는

1. 쉘 스크립트(도커 이미지를 생성하고 HUB에 푸시함) 실행 후 버전 입력
2. 운영 서버에 접속
3. 쉘 스크립트(도커 이미지를 pull 받고 컨테이너를 실행함) 실행 후 버전 입력

이러한 간단한 플로우로 이미지를 배포 및 버전 관리를 할 수 있습니다.
이러한 플로우에는 사용자는 다음과 같은 단점이 있습니다.

1. 로컬, 운영서버 각 환경에서 배포하는 이미지의 버전를 입력해야 합니다. (총 2번)
2. 언제 끝날지 모르는 도커 빌드, 푸시 시간이 끝나기를 기다려야 합니다.
3. 도커 푸시 후, 서버에 접속해서 이미지를 전송 받아야 합니다.

<br />

### 해결책 = github action

**자동화를 통해서 한 번의 실행으로 모든 작업을 실행할 수는 없을까?** 고민했습니다.
이러한 고민을 해결하기 위해 **github action** 을 사용했습니다.

도커를 사용하기 이전에는 AWS 에서 제공하는 codeDeploy, s3 서비스를 통해서 CI/CD 를 구축했었습니다.
codeDeploy 를 사용하면 **ubuntu 버전 호환 문제와 ruby, codeAgent 등을 설치해야 해서 용량을 많이 차지**하는 부분이 불편했습니다.
또한, S3 로 버전 관리를 하는 것이 아니라 Docker HUB 를 통해서 버전관리를 하므로 S3 를 사용할 이유도 없었습니다.

<br />

## 시작하기

### 1. Dockerfile 수정

```bash
FROM node:16.17.0-alpine

RUN mkdir -p /app
WORKDIR /app
ADD ./ /app

RUN yarn install   // 변경된 부분
RUN yarn build     // 변경된 부분

RUN npm install -g pm2

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
```

도커 Node 이미지를 생성 시 패키지 파일을 생성하고 빌드 파일을 생성하기 위함입니다.

<br />

### 2. Github action secret 변수 생성

github action 을 사용하기 위해 서버 접속, 도커 로그인 등을 하기 위한
보안 정보를 github 에 등록하는 단계입니다.

#### 해당 경로로 이동

github.com > repository > settings > secrets and variables > actions

#### 해당 변수 추가

REMOTE_IP : 서버 IP <br />
REMOTE_SSH_PORT : 서버 접속 PORT <br />
REMOTE_SSH_USER : 서버 접속 계정 <br />
REMOTE_SSH_KEY : 서버에 접속하기 위한 SSH KEY 의 내용 <br />
DOCKER_REPOSITORY : 도커 유저명/레포지토리명 <br />
DOCKER_USERNAME : 도커 유저명 <br />
DOCKER_PASSWORD : 도커 비밀번호 <br />

<br />

### 3. github action workflow 파일 생성

이제 자동 배포 스크립트를 작성하기 위한 준비가 됐습니다.
해당 경로에 다음 파일을 생성합니다.
_프로젝트/.github/workflows/my_deploy.yml_

```bash
name: CI

on:
    push:
        branches: [main]

jobs:
    build:
        runs-on: ubuntu-latest
        env:
            VERSION: 1.0.0
            OS: linux/amd64

        steps:
            - name: Checkout release
              uses: actions/checkout@v3

            - name: Set env
              run: echo "TAG=$VERSION" >> $GITHUB_ENV

            - name: Confirm env
              run: echo "RELEASE_VERSION=${{ env.TAG }}"

            - name: Login to DockerHub
              uses: docker/login-action@v1
              with:
                  username: ${{ secrets.DOCKER_USERNAME }}
                  password: ${{ secrets.DOCKER_PASSWORD }}

            - name: build and release to DockerHub
              env:
                  REPO: ${{ secrets.DOCKER_REPOSITORY }}
              run: |
                  docker build -f Dockerfile.prod --platform $OS -t $REPO:${{ env.TAG }} .
                  docker push $REPO:${{ env.TAG }}

            - name: Deploy
              uses: appleboy/ssh-action@master
              with:
                  host: ${{ secrets.REMOTE_IP }}
                  username: ${{ secrets.REMOTE_SSH_USER }}
                  key: ${{ secrets.REMOTE_SSH_KEY }}
                  port: ${{ secrets.REMOTE_SSH_PORT }}
                  script: |
                      docker ps

                      echo "=>>> docker stop front container...."
                      docker stop $(docker ps -q -af "name=test-front")

                      echo "=>>> docker remove front container...."
                      docker rm $(docker ps -q -af "name=test-front")

                      docker pull ${{ secrets.DOCKER_REPOSITORY }}:${{ env.TAG }}

                      cd /
                      pwd
                      sed -i  "5s|.*|        image: ${{ secrets.DOCKER_REPOSITORY }}:${{ env.TAG }}|g" docker-compose.yml

                      docker images

                      docker-compose up -d
                      docker image prune -af
                      docker ps
```

<br />

#### Githun action 스크립트 추가 설명

이전 게시물에서 다룬 내용을 하나의 스크립트로 축약했습니다.

<br />

```
on:
    push:
        branches: [main]

```

main 브랜치로 통합될(push, merge) 시 github action 을 실행하기 위함입니다.

<br />

```bash
            - name: Set env
              run: echo "TAG=$VERSION" >> $GITHUB_ENV

            - name: Confirm env
              run: echo "RELEASE_VERSION=${{ env.TAG }}"
```

github action 변수를 지정하는 단계입니다.
env 필드로 사용할 수도 있지만, 도커 내부에서 사용이 안되므로 이렇게 지정해야 합니다.

<br />

```bash
            - name: build and release to DockerHub
              env:
                  REPO: ${{ secrets.DOCKER_REPOSITORY }}
              run: |
                  docker build -f Dockerfile.prod --platform $OS -t $REPO:${{ env.TAG }} .
                  docker push $REPO:${{ env.TAG }}

```

Dockerfile 로 원하는 버전의 이미지를 생성 후 Hub 로 Push 하는 단계입니다.

<br />

### Github action 사용법

1. 프로젝트 코드 수정
2. my_deploy.yml 파일 내의 버전수정 (ex. 1.0.1)
3. main branch 로 병합
4. github action 실행됨

```toc

```
