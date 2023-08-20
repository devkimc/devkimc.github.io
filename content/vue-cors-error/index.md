---
emoji: 💻
title: CORS Error [ vue 에서 외부 API 요청 시 ]
date: '2022-08-04 23:00:00'
author: devkimc
tags: web
categories: 블로그 web
---

```javascript
Access to XMLHttpRequest at 'local address' from origin 'api address' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

​

## 에러 배경

1. vue 에서 kakao map api 를 사용하여 지도에서 맛집(장소)을 검색했다.

2. 주소 이외의 장소에 대한 상세정보가 필요했다.

3. 카카오 플레이스 (map.place.kakao) 로 장소에 대한 정보를 조회 요청했다.

4. Cors Error 발생
   ​

## 에러 발생 이유

- 로컬 주소(localhost:8000) 와 조회하려는 주소(map.place.kakao:443) 의 출처가 다르다.

​

## CORS Error (Cross-Origin Resource Sharing)

간단히 말해서,

브라우저에서 요청하는 주소와 응답하는 주소(출처)가 다를 때

허락한 요청 외에는 에러를 발생시키겠다.

​

ex) 둘을 비교하면 프로토콜(http) 와 호스트(loaclhost), 포트(8000) 모두 다르다. 에러 발생

요청하는 주소: http :// localhost : 8000

응답하는 주소: https :// map.place.kakao : 443
​

### 허락한 요청이란?

출처가 다르더라도 요청을 허락하도록 응답 헤더에 설정한 요청을 말한다.

ex) Access-Control-Allow-Origin : \*

ex) Access-Control-Allow-Credentials : true

​

## 에러 해결 과정 (방법 1)

### 1. 프록시 서버를 사용해서 우회하기

- https://cors-anywhere.herokuapp.com

- 해당 프록시 서버에서 헤더 설정을 해준다. ( Access-Control-Allow-Origin : \* )​

- 프론트에서 카카오 API를 요청하고 싶을 때 할 수 있는 유일한 방법이었다.

- 해당 프록시 서버가 중단될 경우 원하는 응답을 받을 수 없고, 코드가 깔끔하지 못한 단점이 있다.

```javascript
    getData () {
      const config = {
        baseUrl: 'https://cors-anywhere.herokuapp.com/https://place.map.kakao.com:443/main/v/9209726'
      }
      return axios.get(config.baseUrl)
    }
```

​

## 에러 해결 과정 (방법 2)

### 1. 프록시 서버 구축하기

- 해당 방법은 프론트에서 외부 API 를 요청하는 방법이 아니다.

- 요청 순서: vue -> express -> kakao api

- express 서버에서 요청할 경우 에러를 발생시키지 않는다.

- 참고했던 설명이다.

> CORS 는 브라우저에 관련된 정책이기 때문에,
> **브라우저를 통하지 않고 서버 간 통신을 할 때는 이 정책이 적용되지 않는다.**
> 즉, 서버에서 서버로 리소스를 요청하면 CORS 정책을 위반하지 않고 정상적으로 응답을 받을 수 있다.

- 출처: https://xiubindev.tistory.com/115

```javascript
// ﻿express 서버에서 카카오 API 요청 코드

const kakaoPlaceUrl = 'https://place.map.kakao.com:443/main/v/'

router.post('/place/info', (req, res) => {
  const kakaoPlaceIdUrl = `${kakaoPlaceUrl}${req.body.PLACE_ID}`

  axios.get(kakaoPlaceIdUrl).then(
    response => {
      if (response.data.isExist === true)
      {
        res.status(200).json({
          code: 30001,
          msg: "장소에 대한 정보가 조회되었습니다.",
          list: response.data
        })
      }
```

### 2. vue.js 코드 수정

- express 서버에서 카카오 API 를 요청하기 때문에 vue 에서는 파라미터만 전달하면 된다.

```javascript
// ﻿express 서버에 요청하는 함수

export const getKakaoPlaceInfo = (placeId) => {
  return axiosPost('/kakao/place/info', {
    PLACE_ID: placeId,
  });
};
```

```javascript
// ﻿express 서버에 요청하는 함수를 실행하는 부분

    getPlaceDetail (place, index) {
      getKakaoPlaceInfo(place.id).then(res => {
        if (res.data.code === 30000) {
          showToast('warning', res.data.msg)
        } else if (res.data.code === 30001) {
          this.resSearchDetail.push(res.data.list)
          this.calcRating(index)
        } else {
          showToast('danger', res.data.msg)
        }
      })
    }
```

### 3. vue.js 실행 후 카카오 API 요청

- 해당 장소에 대한 상세정보를 응답받는다.
- ex) 리뷰 / 후기

![](https://velog.velcdn.com/images/kws60000/post/ed5d4824-eb93-4219-bd24-cffcd6370a2e/image.png)

```toc

```
