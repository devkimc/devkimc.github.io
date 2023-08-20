---
emoji: 📓
title: SPA(Single Page Application) - [1] 등장 배경
date: '2022-05-01 23:00:00'
author: devkimc
tags: web
categories: 블로그 web
---

많은 웹 프론트엔드 개발자가 React, vue, angular 프레임워크를 사용하여 개발한다.
이들은 모두 SPA 프레임워크이다. 그런데 SPA는 뭘까?
SPA를 설명하기 앞서, SPA는 모던 웹의 패러다임이라고 한다.
과거 웹 페이지에 대비해 어떠한 목적으로 SPA를 사용하기 시작한 지 알아봤다.

## 1. 서버의 부하 감소

과거의 웹 페이지 형태(MPA, Multi Page Application)에서는 사용자가 메뉴를 클릭 시,
완전히 새로운 페이지를 서버에서 전송해 줬다.
서버에서 다음과 같은 작업이 이루어졌다.

1.  사용자에게 요청이 들어오면, DB로부터 데이터를 가져온다.
2.  ASP, JSP, PHP 같은 파일에 데이터를 넣어준 후 HTML 형태화 시켜서 전송해 준다.
    ​

과거의 웹 페이지에서 브라우저는 화면을 보여주기만 할 뿐,
요청한 웹 문서에 대한 처리는 전부 서버에서 담당한 것으로 보인다.
**즉, 페이지가 요청될 때마다 서버에 부하가 생긴다.**
​
SPA는 웹 애플리케이션에 필요한 정적 리소스(Html, Css, Javascript)를 최초 접근 시 단 한 번만 다운로드한다.
**서버는 브라우저에서 필요한 정보에 대한 요청(Ajax)이 오면 응답(Json)만 주면 된다.**
따라서 MPA와 달리 SPA 방식은 서버에 부하를 줄일 수 있게 된다.

​

## 2. 모바일 최적화

온라인 세상에서 **모바일의 중요성이 커지면서 모바일 최적화에 대한 니즈를 충족시키기 위해 등장했다.**
SPA는 크롬, 브라우저와 같은 브라우저를 통해 사용하는 웹 앱(모바일 웹)을,
다운로드해 사용하는 네이티브 앱(모바일 앱) 같은 퍼포먼스를 향상시킨다.
​
모바일 웹이 MPA 방식으로 구현됐다면,
수많은 페이지를 이동할 때, 페이지를 리렌더링 해야 하므로 사용자 경험(UX)이 감소할 것이다.
SPA에서는 수정된 부분만 렌더링 하기 때문에, 기존의 웹 페이지보다 UX가 향상된다.
​
그렇다면 SPA는 장점만 있는 것일까?
역시나 단점이 존재하고, 상황에 맞게 CSR, SSR 렌더링 방식을 선택하는 것이 좋다.

![](https://velog.velcdn.com/images/kws60000/post/6c208b29-d00b-4f14-9cf6-04c1d90f5b7f/image.jpg)

​
모바일 웹이 MPA 방식으로 구현됐다면,
수많은 페이지를 이동할 때, 페이지를 리렌더링 해야 하므로 사용자 경험(UX)이 감소할 것이다.
**SPA에서는 수정된 부분만 렌더링 하기 때문에, 기존의 웹 페이지보다 UX가 향상된다.**

​
그렇다면 SPA는 장점만 있는 것일까?
역시나 단점이 존재하고, 상황에 맞게 CSR, SSR 렌더링 방식을 선택하는 것이 좋다.

```toc

```