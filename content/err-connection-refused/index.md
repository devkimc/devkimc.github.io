---
emoji: 💻
title: AWS EC2 Node.js 서버 연결 안될 때 ( 사이트에 연결할 수 없음 )
date: '2022-08-04 23:00:00'
author: vvs-kim
tags: server
categories: 블로그 server
---

![](https://velog.velcdn.com/images/kws60000/post/f460a774-e0fa-493d-8654-7f762abcb847/image.png)

## 에러 배경

1. node js 를 AWS 서버 에 배포했다.

2. 웹 화면에서 api 요청 시 '사이트에 연결할 수 없음' 에러 확인

​

## 에러 발생 이유

- 방화벽이 원인이었다.

- http 프로토콜과 포트를 열어주지 않아서 응답을 주지 않았다.

​

## 에러 해결 과정

### 1. AWS 인바운드 규칙 확인

- Instance 의 보안 그룹에 대한 포트를 열어줬는지 확인한다.

​

### 2. 해당 포트가 실행되는 지 확인

- netstat -tnlp

- 해당 포트가 실행되는 지 알 수 있다.

​

### 3. 방화벽 허용하기

- firewall-cmd --permanent --add-service=http

- firewall-cmd --permanent --add-service=https

- firewall-cmd --permanent --add-port=9000/tcp

​

- 과거에 허용한 적이 없다면 success

- 과거에 허용한 적이 있다면 경고가 뜬다.

```toc

```
