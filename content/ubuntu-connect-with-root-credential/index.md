---
emoji: 💻
title: Ubuntu 환경에서 root 사용자로 ssh 접속하기
date: '2023-01-01 23:00:00'
author: vvs-kim
tags: server
categories: 블로그 server
---

## root 접속하는 이유

Ec2 인스턴스 생성 시 ubuntu 계정으로 접속할 수 있습니다.
패키지를 설치하거나 쉘 스크립트를 실행할 때 sudo 를 사용하는 불편함을 줄이기 위함입니다.
<br />

## 설정방법

### 1. 초기 비밀번호 설정

```
sudo passwd
// 비밀번호 입력
```

<br />

### 2. ssh 설정

```
vi /etc/ssh/sshd_config
```

1. root 비밀번호 로그인 허용 시
   PermitRootLogin yes

2. root ssh 접속만 허용 시
   PermitRootLogin prohibit-password

<br />

```
service sshd restart
```

```
vi root/.ssh/authorized_keys
```

private key 내용 확인 및 접속하기 위한 private key 를 추가
이렇게 설정하면 접속이 가능합니다.

### 에러 발생 시

> authentication refused: bad ownership or modes for file /root/.ssh/authorized_keys

ubuntu 계정으로 root 계정의 인증파일을 수정시 발생하는 오류입니다.
root 폴더의 파일은 root 계정으로 작성 및 수정합니다.

```toc

```
