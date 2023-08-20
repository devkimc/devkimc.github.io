---
emoji: 💻
title: eslint(airbnb) + prettier + Next + Typescript + yarn 설정
date: '2022-11-17 23:00:00'
author: devkimc
tags: frontend
categories: 블로그 frontend
---

## 패키지 소개

### ESLint 란? (ES + Lint)

> 자바스크립트 소스 코드의 오류를 표시하기 위한 도구입니다.

ES란, Ecma Script, 표준 자바스크립트
Lint란, 소스 코드를 분석하여 프로그램 오류, 버그, 스타일 오류 등을 표시하기 위한 도구

### Prettier 란?

> 코드를 예쁘고 일관성 있게 유지시켜주는 자동완성 도구입니다.

eslint 로 소스코드를 분석하고,
prettier 로 올바르게 문법을 자동으로 고칠 수 있으므로 함께 사용합니다.

### airbnb convention 란?

> 에이비앤비에서 만든 코딩 컨벤션(문법을 이렇게 작성하자! 라는 약속) 입니다.

여러 회사가 만든 코딩 컨벤션이 존재하며, 그중 에어비앤비에서 만든 약속입니다.

<br />

## 적용방법

### 1. eslint config 패키지 추가

```
yarn add -D eslint-config-airbnb eslint-config-airbnb-typescript
```

eslint-config 로 시작하는 패키지를 설치 시 extends 옵션에 사용
extends 옵션을 통해 설정을 패키지의 설정을 적용할 수 있음

<br />

### 2. eslint plugin 패키지 추가

```
yarn add -D eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin
```

eslint 의 서드파티 플러그인 사용

<br />

### 3. eslint-typescript parser 패키지 추가

```
yarn add -D @typescript-eslint/parser
```

타입스크립트용 ESLint 파서

<br />

### 4. eslint resolver 패키지 추가

```
yarn add -D eslint-import-resolver-node
```

설치하지 않을 시: 각 파일에서 모듈 import 시 위치를 찾지 못하는 에러가 발생함
Resolve error: unable to load resolver "node" https://github.com/airbnb/javascript/issues/1730

<br />

### 5. eslintrc.json 생성 및 작성 (eslint 설정파일)

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "next/core-web-vitals",
    "airbnb",
    "airbnb-typescript",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }],
    "react/function-component-definition": [2, { "namedComponents": "arrow-function" }],
    "react/prop-types": 0,
    "import/no-unresolved": "off",
    "import/no-cycle": "off",
    "no-param-reassign": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off"
  }
}
```

<br />

### 6. prettier 설정

```
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

eslint 와 호환하여 규칙에 어긋나는 문법을 자동수정하기 위함

<br />

### 7. .prettierrc 추가 (prettier 설정파일)

```
{
    "singleQuote": true,
    "semi": true,
    "tabWidth": 4,
    "trailingComma": "all",
    "printWidth": 80,
    "arrowParens": "avoid",
    "endOfLine": "auto"
}
```

<br />

### 8. vscode prettier sdk 추가

```
yarn dlx @yarnpkg/sdks vscode
```

.yarn/sdks 폴대 내의 prettier sdk 추가
yarn-berry 사용시 node_modules 가 없으므로 vscode 에서 prettier 모듈을 찾지 못함

<br />

### 9. 안될 경우 재실행

eslint 에러가 나는 부분은 각 추천 링크를 눌러서 규칙을 꺼주거나, 코드를 수정

<br />

## 참고자료

https://velog.io/@jiwon/ESlint

```toc

```
