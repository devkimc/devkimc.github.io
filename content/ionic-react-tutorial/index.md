---
emoji: 💻
title: Ionic React 시작하기
date: '2022-10-26 23:00:00'
author: vvs-kim
tags: frontend
categories: 블로그 frontend
---

## Ionic

### 1. Ionic 이란

아이오닉 페이지는 스스로를 이렇게 소개합니다. https://ionicframework.com/

> An open source mobile UI toolkit for building modern, high quality cross-platform mobile apps from a single code base in React.Vue.Angular.

> 아이오닉은 리액트, 뷰, 앵귤러에서 최신 고품질의 크로스 플랫폼 앱을 구축하기 위한 오픈 소스 모바일 UI 툴킷입니다.

### 2. Ionic react vs react native

크로스 플랫폼 앱을 구현하기 위해 사용되는 것으로 리액트 네이티브도 있습니다.
아이오닉 리액트와 리액트 네이티브는 어떤 점이 다른지 읽어봤습니다. https://ionic.io/resources/articles/ionic-react-vs-react-native

> Ionic React is web-first, meaning that it implements native iOS and Android UI patterns using cross-platform, standards-based web technology instead of accessing platform UI controls directly.

> For teams that have traditional web development skills and libraries and wish to target mobile and web (as a Progressive Web App), Ionic React will likely be a better fit.

여러 차이가 있지만, 아이오닉은 웹 퍼스트로 표준 기반 웹 기술을 사용하여 네이티브 ios와 안드로이드 UI 패턴을 구현한다고 합니다.
그리고 프로그레시브 웹 앱을 목표로 하는 팀에게 아이오닉 리액트가 적합할 것이라고 설명합니다.

## ionic react 시작하기

![](https://velog.velcdn.com/images/kws60000/post/06a175a2-33af-4a90-ada3-ebfcd88ebad6/image.png)

사진처럼 간단한 앱을 생성하고 시뮬레이터로 실행하는 예제입니다.

### 1. ionic, cordova 설치

```
yarn add global @ionic/cli, cordova
ionic -v
cordova -v
```

설치가 안됐다면 환경 변수 확인

```
// mac 기준 - 환경변수 파일 생성 (존재하지 않다면)
touch ~/.bash_profile; open ~/.bash_profile;

// 환경변수 파일 작성
export PATH="설치경로:$PATH"
ex) export PATH="$HOME/.yarn-global/node_modules/cordova/bin:$PATH"
```

### 2. ionic CLI로 프로젝트 생성

- myApp 위치에 프로젝트 명을 입력하시면 되요
- tabs: 탭 형태의 템플릿

```
ionic start myApp tabs --type=react
cd myApp
ionic serve
```

### 3. ionic 빌드

Capacitor: 모바일에 배포하기 위한 크로스 플랫폼 앱 런타임

```
ionic integrations enable capacitor
ionic build
serve -s build
```

### 4. ios, android 폴더 생성

```
ionic cap add android
ionic cap add ios
```

#### ❌ 에러 케이스

1. CocoaPods is not installed

```
[capacitor] [error] CocoaPods is not installed.
[capacitor]         See this install guide: https://capacitorjs.com/docs/getting-started/environment-setup#homebrew

// CocoaPods: Swift, Objective-C 에서 라이브러리를 사용할 수 있게 도와주는 모듈
```

```
brew install CocoaPods
```

2. [error] ERR_SUBPROCESS_NON_ZERO_EXIT

```
[capacitor] ✖ Updating iOS native dependencies with pod install - failed!
[capacitor] ✖ update ios - failed!
[capacitor] [error] ERR_SUBPROCESS_NON_ZERO_EXIT
```

```
sudo xcode-select --reset
```

3. You have not agreed to the Xcode license agreements

```
[capacitor] ✖ Updating iOS native dependencies with pod install - failed!
[capacitor] ✖ update ios - failed!
[capacitor] [error] /opt/homebrew/Cellar/cocoapods/1.11.3/libexec/gems/cocoapods-1.11.3/lib/cocoapods/command.rb:128:in `git_version': Failed to extract git version from `git --version` ("\\nYou have not agreed to the Xcode license agreements, please run 'sudo xcodebuild -license' from within a Terminal window to review and agree to the Xcode license agreements.\\n") (RuntimeError)
```

```
sudo xcodebuild -license
agree
```

### 5. android studio, xcode 에서 실행

ios, android 폴더가 생성됐다면 각 시뮬레이터를 실행할 수 있어요.

```
ionic cap open android
ionic cap open ios
```

```toc

```
