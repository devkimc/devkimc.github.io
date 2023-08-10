---
emoji: 💻
title: Jenkins 자동 배포하기 (+github 연동)
date: '2022-08-27 23:00:00'
author: vvs-kim
tags: ci/cd
categories: 블로그 ci/cd
---

## 포스팅 배경

### Jenkins를 실무에서 왜 사용할까?

이전 직장에서 xshell, total commander 를 사용하여 수동으로 배포를 했었습니다.
상당히 위험한 순간도 많았고, 실수한 적도 많았습니다.
이에 대한 불편함을 느끼고, 현 직장에서는 자동 배포환경을 구축했습니다.
이로 인해 동료 개발자도 배포가 쉬워지는 장점을 느꼈습니다.

### 기억보단 기록

Jenkins 환경 구축을 4번했습니다.
잦은 장비 변경으로 인해 window, linux, mac, docker 등 각 OS에 모두 설치할 때마다
이전 과정이 기억나지 않았고, 많은 시간을 소비했습니다.
기록에 대한 필요성을 느꼈고, 저와 같은 불편함을 겪는 분들에게 도움이 되면 좋겠습니다.

## 순서

1. Jenkins 설치 및 계정 설정
2. Jenkins - github 계정 연동 설정
3. 프로젝트 생성
4. 프로젝트 - github repository 연동 설정
5. 플러그인 설치, 설정(ex. node, publish over ssh)
6. Build steps, 빌드 전/후 조치 설정

## 전체 과정

### 1. Jenkins 설치 및 계정 설정

https://www.jenkins.io/download/
해당 페이지에서 각 OS 별 요구하는 Jenkins 를 설치합니다.

![](https://velog.velcdn.com/images/kws60000/post/fdda899c-e5c7-4450-9e74-0f7619020104/image.PNG)

Jenkins 설치 후 해당 경로의 초기 비밀번호를 입력합니다.
plugin은 Install suggested plugins 를 선택해도 괜찮습니다. (추후 설치 가능)

설치되면 Admin 계정을 설정합니다.
port 를 설정할 수 있습니다.
저의 경우, 백엔드 api에서 8080 포트를 사용하므로 8090으로 변경했습니다.

### 2. Jenkins - github 계정 연동 설정

https://github.com/settings/tokens
or
github -> settings -> developer settings -> Personal access tokens

해당 페이지에서 Generate new token 클릭
token 이름 설정 후 repo, admin_hook 을 체크하고 Generate token 을 클릭합니다.

![](https://velog.velcdn.com/images/kws60000/post/caeb1570-f512-45c7-8e28-2434dea7f5cc/image.PNG)![](https://velog.velcdn.com/images/kws60000/post/b04e2890-49ea-45b9-987b-a88ad91b7ff0/image.png) 빨간부분을 복사합니다.

Jenkins 홈 -> Jenkins 관리 -> Configure System 로 이동합니다.
git 메뉴에 있는 Add github server 를 클릭 후 Credentials 하단의 Add 버튼을 클릭합니다.
복사한 텍스트를 Secret에 입력합니다.![](https://velog.velcdn.com/images/kws60000/post/88f985a5-d7e3-49bf-b958-b71528217214/image.PNG)설정한 credential 을 적용 후
test connection 클릭 시 이렇게 출력된다면 연동된 것입니다.

> Credentials verified for user "your ID", rate limit: 4999

### 3. 프로젝트 생성

Jenkins 홈 -> 새로운 Item -> ID 입력, Freestyle project 클릭 후 Ok 버튼 클릭

### 4. 프로젝트 - github repository 연동 설정

Jenkins 홈 -> 생성한 프로젝트 클릭 -> 구성
소스 코드 관리 Git 선택 후 Repository URL 입력
git@github.com:kws60000/Must_Eat_2.git 와 같은 ssh url 을 입력합니다.
![](https://velog.velcdn.com/images/kws60000/post/8b93253c-3e46-4cec-aa07-c0b4227bae87/image.png)

에러가 뜹니다. jenkins workspace에 ssh key를 추가해야 합니다.
Jenkins 홈 -> Jenkins 관리 -> Configure System 로 이동하면 각 OS 별 홈 디렉토리를 알려줍니다.
![](https://velog.velcdn.com/images/kws60000/post/e9734dcc-a5e1-4f95-b41e-eaa2e5038510/image.png)디렉토리 이동 후 cd jobs/your_project_name 또는 cd workspace/your_project_name 이동
해당 경로는 jenkins project 경로입니다. ssh 접속을 위한 파일을 추가해야 합니다.

> _\* 해당 기록은 추가 수정이 필요합니다_ > _\* 'jenkins github ssh 연동' 이라고 검색하시면 원하는 자료를 찾으실 수 있습니다._

#### 1. ssh key 파일 생성

해당 디렉토리에서 .ssh 파일 추가 후 ssh key 파일을 생성합니다.

#### 2. github에 ssh key 등록

https://github.com/settings/ssh/new

#### 3. Jenkins 프로젝트 구성 Add credential

![](https://velog.velcdn.com/images/kws60000/post/004a34f3-3447-4f36-90d8-3faed895e8fd/image.png)

### 5. 플러그인 설치, 설정

jenkins 에서 패키지, 플러그인을 사용하기위한 과정입니다.
저의 경우 nodejs, publish over ssh 플러그인을 사용했습니다.

### 6. Build steps, 빌드 전/후 조치 설정

설치한 플러그인을 활용해 빌드 script, 전/후 처리를 하는 과정입니다.

저의 경우
**Build** 단계에서 npm install, build 를 진행합니다.
CI는 환경변수이고, 정확한 이유는 모르나 false로 지정해야 오류가 나지 않았습니다.

**빌드 후 조치** 단계에서 서버에 SSH 접속 후 build된 파일을 서버로 모두 전송했습니다.
이후 nginx 를 재실행 함으로서 배포가 마무리 됩니다.

Jenkins 홈 -> 생성한 프로젝트 클릭 -> 구성
![](https://velog.velcdn.com/images/kws60000/post/4162308e-291a-4992-8805-11f1d2fef6f6/image.png)

![](https://velog.velcdn.com/images/kws60000/post/6218a7f9-7f19-4e17-80d7-6c8945adcc16/image.png)

## Jenkins 적용 후

- 수동 배포만 하다가 **버튼 한 번으로 배포가 된다는 것**과 팀즈(hook)의 알람을 통해 **배포의 성공 유무를 확인할 수 있다는 것**은 정말 많은 시간을 줄여주고 편리했습니다.

- 타 개발자도 사설 IP를 통해 jenkins를 사용할 수 있어서 두배 이상의 효과가 있었습니다.

- 미흡한 점도 많습니다. CD는 구축한 것 같으나 CI에 대한 설정이 필요합니다. **테스트에 대한 설정이 필요합니다.**
- 기회가 된다면, github action hook을 통해 배포를 해보고 싶다는 생각을 했습니다.

긴 글 읽어주셔서 고맙습니다.

```toc

```
