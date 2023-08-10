---
emoji: 💻
title: git ssh 접속하기
date: '2022-12-03 23:00:00'
author: vvs-kim
tags: server
categories: 블로그 server
---

## 1 - git 접속 에러

1. 새로운 노트북을 이용할 때
2. github, gitlab 에 처음 계정을 연동해서 이용할 때
3. https remote 주소로 부터 깃을 관리할 때

권한 에러를 마주할 수 있습니다.
이에 대한 반복된 검색을 줄이면 좋을 거 같아서 포스팅을 시작합니다.

### github 에러

```
$ git push origin main
Username for 'https://github.com': vvs-kim
Password for 'https://vvs-kim@github.com':

remote: Support for password authentication was removed on August 13, 2021.
remote: Please see https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls for information on currently recommended modes of authentication.
fatal: Authentication failed for '레포지토리 주소'

```

올바른 사용자 이름과 비밀번호를 입력했을 때 에러가 발생합니다.
가끔 마주하는 문구인데 읽어보면,

> **2021년 8월 13일 부터 비밀번호 인증지원은 제거됐다.**

라고 나와 있고, 어떻게 적용할 지 링크를 알려줍니다.
https 리모트를 적용하면 기본적으로 깃계정의 아이디와 패스워드를 입력합니다.
패스워드 인증을 지원하지 않는다고 하니 ssh 접속을 하는 방법이 필요합니다.

<br />

## 2 - git ssh 접속 방법

### 2.1 - ssh key 생성

우선, ssh-keygen 이 설치되어 있어야 합니다.
https://git-scm.com/book/ko/v2/Git-%EC%84%9C%EB%B2%84-SSH-%EA%B3%B5%EA%B0%9C%ED%82%A4-%EB%A7%8C%EB%93%A4%EA%B8%B0
<br />

#### ssh-keygen 옵션

**-t:** 생성할 키의 유형. 암호화의 타입을 사용하겠다는 것입니다.
**-c:** 생성할 코멘트의 내용. 작성한 내용은 public key 파일 마지막에 기입됩니다.
<br />

```bash
$ ssh-keygen -t rsa -C "깃 아이디 또는 이메일 등"

Generating public/private rsa key pair.

// public, private key 파일 생성 위치, 입력하지 않을 시 해당 디렉토리에 생성
Enter file in which to save the key (/Users/wskim/.ssh/id_rsa):

// 보안을 강화하고 싶다면 추가 비밀번호 입력, 없을 시 엔터
Enter passphrase (empty for no passphrase):

// 추가 비밀번호 확인
Enter same passphrase again:

// 생성되었습니다! 👏
Your identification has been saved in /Users/wskim/.ssh/id_rsa
Your public key has been saved in /Users/wskim/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:Kbzt8d0Sv57t9RG11/1SKpQXQjJeOAqIjMgw+tX+iqc vvs-kim
The key's randomart image is:
```

<br />

#### ssh key 생성 확인

```
// 유저별 ssh 디렉토리
$ cd ~/.ssh

// ssh 목록 확인
$ ls -a

// public key 확인. 입력한 코멘트가 보여야 합니다.
$ cat id_rsa.pub

// public key 복사
$ pbcopy < id_rsa.pub
```

<br />

### 2.2 - github 에 ssh public key 등록

https://github.com/settings/keys
해당 페이지에 접속하여 **[New SSH Key]** 클릭
원하는 Title 입력 후 복사한 public key 붙여넣기합니다.
**[Add SSH Key]** 클릭

#### ssh 접속 설정

```
// ssh config 파일 설정
$ touch ~/.ssh/config

// ssh config 파일 편집
$ vi ~/.ssh/config

// 📝 해당 내용을 복사해서 붙여넣기 합니다.
Host github.com
  IdentityFile ~/.ssh/id_rsa
  User git

```

<br />

#### ssh 접속 테스트

```
$ .ssh % ssh -T git@github.com
Hi vvs-kim! You've successfully authenticated, but GitHub does not provide shell access.
```

ssh 접속을 위한 준비가 끝났습니다.

<br />

### 2.3 - ssh 로 github clone

```
$ git clone 'ssh 레포지토리 경로'

```

<br />

## 참고자료

https://www.lainyzine.com/ko/article/creating-ssh-key-for-github/

```toc

```
