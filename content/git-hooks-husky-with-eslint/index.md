---
emoji: 💻
title: git hooks 를 husky 로 제어하기 (eslint, pre-commit)
date: '2022-12-06 23:00:00'
author: vvs-kim
tags: frontend
categories: 블로그 frontend
---

## 1 - 들어가기 앞서..

팀원과 컨벤션 정의 및 lint 규칙을 정하는 상황이 있습니다.
그런데 작업을 하다 보면 서로 코드 컨벤션에 소홀해지는 경우가 있습니다.
이런 상황일 때, 사용하면 좋은 도구가 **husky** 입니다.

> husky 를 사용하면 커밋 전, 푸시 전 등 git hooks 상황에 맞게 코드 규칙을 강제할 수 있습니다.

<br />

## 2 - 용어 및 도구 정리

<br />

### git hooks

> git 과 관련한 이벤트가 발생했을 때, 추가 스크립트를 실행하는 기능

git hooks 는 클라이언트 훅과 서버 훅으로 나뉩니다.
클라이언트 훅은 git 이벤트를 실행 시, 실행자의 컴퓨터에서 실행하는 훅입니다.
서버 훅은 git 이벤트를 실행 시, 타 서버에서 실행하는 훅입니다.
.git/hooks 폴더 내부에 보면 각 훅을 확인할 수 있습니다.

<br />

### husky

> git hooks 를 편리하게 사용하도록 도와주는 도구

git 이벤트 실행자는 클라이언트 훅을 사용할 수 있습니다.
.git/hooks 폴더 내부에 존재하는 클라이언트 훅을 사용해도 되지만, 버전관리가 되지 않습니다.
이에 대한 대안으로 husky 를 사용합니다.

<br />

### lint-staged

> stage 된 상태의 git 파일에 대해 lint 및 추가 명령어를 실행해주는 라이브러리

git hook 과 husky 가 무엇인지 알았습니다. 그렇다면 언제 코드를 관리하는 것일까요?
상황마다 다르겠지만, 스테이징 된 코드를 커밋하기 전에 점검하는 예제가 많았습니다.

> git add -> **pre-commit** -> commit

커밋되기 전에 스테이징 된 git 파일을 검사하고, 이상이 있을 시에는 커밋이 되지 않습니다.
이러한 과정을 도와주는 라이브러리입니다.

<br />

### mrm

https://www.npmjs.com/package/mrm

> 오픈 소스 프로젝트의 구성을 동기화하는 데 도음이 되는 명령줄 도구입니다. <br />
> Command line tool to help you keep configuration (package.json, .gitignore, .eslintrc, etc.) of your open source projects in sync.

husky 와 lint-staged 모듈을 간편하게 설정하기 위해 사용합니다
해당 모듈이 설치 시 husky 와 lint-staged 를 설치하며, husky 를 실행하기 위한 shell 스크립트가 폴더가 생성됩니다.
lint-staged 이외에도 jest, dependabot 등을 지원합니다.

<br />

## 3 - 사용방법

react, next 등 생성된 프로젝트 내부에서 시작하시면 됩니다.

### 3.1 - husky, lint-staged 설치

```
npx mrm lint-staged
```

.husky 폴더 내부에 husky 실행 쉘이 생성됩니다.
<br />

package.json 에 lint-staged 스크립트가 추가 되었을 것입니다.
해당 스크립트는 staged 된 파일에 대해 추가 명령어를 실행하는 스크립트입니다.
사용하는 언어에 따라 변경하면 됩니다.
저는 ts, tsx 파일에 대해 lint 를 적용하겠습니다.

```
// 변경 전
    },
    "lint-staged": {
        "*.js": "eslint --cache --fix"
    }

// 변경 후
    },
    "lint-staged": {
        "*.{ts,tsx}": [
            "eslint --fix",
            "prettier --write"
        ]
    }
```

만약 yarn 패키지 매니저를 사용하신다면,
.husky/pre-commit 파일을 다음과 같이 변경하시면 됩니다.

```
// 변경 전
##!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

// 변경 후
##!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn lint-staged
```

<br />

### 3.2 - husky 적용 테스트

모두 적용했으니 오류 케이스를 생성후 테스트 하겠습니다.

#### 3.2.1 - 오류 케이스 생성

```
// 오류 케이스 - index.tsx

import React from 'react';
import MapView from '../components/map/MapView';
import SearchModal from '../components/search/SearchModal';

const Home = () => {
    return (
            <SearchModal />
            <MapView />
    );
};

export default Home;
```

해당 tsx 파일은 부모로 감싸주는 태그가 없기 때문에 eslint 에러를 발생시켜야 합니다.

#### 3.2.2 - 오류 케이스 테스트

```
// 1. 스테이징
git add .

// 2. 테스트
yarn lint-staged // yarn 사용 시
npx lint-staged // npm 사용 시
```

<br />

```bash
$ yarn lint-staged
✔ Preparing lint-staged...
❯ Running tasks for staged files...
  ❯ package.json — 57 files
    ❯ *.{ts,tsx} — 1 file
      ✖ eslint --fix [FAILED]
      ◼ prettier --write
↓ Skipped because of errors from tasks. [SKIPPED]
✔ Reverting to original state because of errors...
✔ Cleaning up temporary files...

✖ eslint --fix:

/Users/ws/with-eat/pages/index.tsx
  7:12  error  Parsing error: JSX expressions must have one parent element

✖ 1 problem (1 error, 0 warnings)
```

eslint 에러가 발생했으니 성공입니다!

```
git commit
```

커밋을 해도 같은 메시지가 뜨는 지 확인해보고 오류가 뜬다면 설정은 끝났습니다.

```toc

```
