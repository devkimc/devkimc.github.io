---
emoji: 💻
title: www.google.com을 검색 시 발생하는 일 - [ 브라우저 렌더링 ]
date: '2022-08-04 23:00:00'
author: devkimc
tags: web
categories: 블로그 web
---

## www.google.com을 검색 시 화면이 출력되는 과정

1.  사용자가 주소창에 구글 주소를 입력한다. (https://www.google.com)
2.  DNS에서 도메인 주소에 해당하는 IP 주소를 찾는다.
3.  브라우저가 서버와 TCP connection을 한다.
4.  브라우저가 서버에 HTTP 요청을 한다.
5.  서버가 HTTP 응답을 보낸다.
6.  html 파일과 CSS 파일을 각각 파싱 하여 DOM, CSSOM Tree를 만든다. (Parsing)
7.  DOM Tree 와 CSSOM Tree를 결합하여 Render Tree를 만든다.
8.  Render Tree에서 각 노드의 위치와 크기를 계산한다. (Layout)
9.  Layout 단계에서 계산된 값을 여러 Layer로 나눠 픽셀을 채워 넣는다. (Painting)
10. 여러 Layer로 나누어진 픽셀들을 우리가 보는 화면처럼 합성해 준다. (Composite)

1~5 번은 통신과 관련된 과정이고,
6~11 번은 화면이 어떻게 그려지는지(렌더링)에 대한 과정입니다.

본 게시물에서는 **브라우저 렌더링**을 중점으로 화면이 어떻게 출력되는지 작성하려 했습니다.

​

## 브라우저 렌더링 과정

![](https://velog.velcdn.com/images/kws60000/post/ffc7bffb-315f-4140-8075-2f5087ca7ae4/image.png)

​

### 1. DOM, CSSOM 트리 생성

Ⅰ. 변환: 브라우저가 HTML의 원시 바이트를 읽어와서, HTML에 정의된 인코딩에 따라 개별 문자로 변환함
Ⅱ. 토큰화: 브라우저가 문자열을 W3C 표준에 지정된 고유 토큰으로 변환함
Ⅲ. 렉싱: 방출된 토큰은 해당 속성 및 규칙을 정의하는 '객체'로 변환함
Ⅳ. DOM 생성: HTML 마크업에 정의된 여러 태그 간의 관계(parent, child)를 해석해서 트리 구조로 연결됨

- DOM 트리를 생성하는 과정과 동일한 과정으로 CSSOM 트리를 생성함

![](https://velog.velcdn.com/images/kws60000/post/786d859b-fc2e-4843-aa06-b592594654a1/image.png)

![](https://velog.velcdn.com/images/kws60000/post/781a2f4d-e28d-42f7-9f65-f1ef6990be7d/image.png)

​

### 2. 렌더 트리(Render Tree) 생성

DOM 트리와 CSSOM 트리를 결합해서 렌더 트리를 생성합니다.
렌더 트리에는 페이지를 렌더링 하는데 필요한 노드만 포함됩니다.
![](https://velog.velcdn.com/images/kws60000/post/fc056cc1-d751-497d-9d89-59fcf55fe7ea/image.png)

​

### 3. 레이아웃(Layout)

렌더 트리가 제자리에 있으면 레이아웃 단계를 진행할 수 있습니다.
레이아웃 단계에서는 **viewport** 내에서 정확한 위치와 크기를 계산합니다.

- viewport: 화면 Display 상의 표시 영역(ex. 노트북 너비: 1440px, iPhone SE 너비: 375px )

​

![](https://velog.velcdn.com/images/kws60000/post/f0d2989a-d915-4005-8d86-17610b37f2e6/image.png)

​

### 4. 페인팅(Painting)

레이아웃 단계에서 계산된 각 노드들의 위치, 크기, 색상에 맞춰 화면에 요소를 그립니다.
단, 전체 Render Tree를 한 번에 처리하는 것이 아니라
특수한 알고리즘에 따라 Layer를 나눠서 처리합니다.
![](https://velog.velcdn.com/images/kws60000/post/8359a7d2-1d96-4380-90ff-908268eb20be/image.avif)
이렇게 Layer를 분리함으로써 특정 요소가 수정되어 리페인트(Repaint) 해야 할 때,
변경된 Layer만 다시 그려주면 되는 이점이 있습니다.

​

### 5. Composite

이렇게 여러 Layer로 나눠진 픽셀들을 우리가 실제로 보는 화면처럼 합성해 주는 단계입니다.
이러한 과정을 통해 우리는 www.google.com 주소를 입력 시 완성된 화면을 볼 수 있습니다.

​

## 마치며

개발할 때 크게 중요시하지 않았던 내용이고, 너무 생소해서 자료를 베끼기에 급급했습니다.
이번 기회로 조금은 공부는 했지만, 실제로 어떻게 작동하는지는 실제로 확인해야겠다고 생각했습니다.
또한, 브라우저 렌더링 성능 최적화에 대한 궁금증이 생겼습니다.

```toc

```
