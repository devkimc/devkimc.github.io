---
emoji: 💻
title: Namecheap SSL 인증서 재발급 후기 (Https 적용)
date: '2022-10-05 23:00:00'
author: devkimc
tags: web
categories: 블로그 web
---

## 포스팅 배경

### Namecheap SSL 인증에 대한 자료 부족

Namecheap 사이트에서 생성한 SSL 인증서가 만료되어, https 적용을 위해 재발급 했습니다.
Namecheap 에서 제공하는 문서만으로는 재발급이 쉽지 않아서 작성했습니다.
이 게시물이 저와 같은 상황의 분들에게 도움이 되면 좋겠습니다.
<br/>

## 순서

1. 인증서 발행
2. 인증서 다운로드
3. CNAME 등록
4. 모든 인증서 파일을 단일 파일로 결합
5. Nginx 설정 확인 및 재실행  
   <br/><br/>

## 전체 과정

### 1. 인증서 발행

https://ap.www.namecheap.com/domains/ssl/detail/*CertificateID*/*PrimaryDomain*/dashboard

해당 페이지로 접속하거나,

Namecheap 사이트에서 Domain List → Details → SSL → Details 로 이동합니다.
(갱신하고자 하는 Domain 과 Certificate 선택)

만료된 CSR Code 를 복사합니다.
만료된 CSR Code를 사용하지 않는다면 이전에 사용하는 private_key 와 생성할 public_key 가 매칭하지 않습니다.
(private_key도 바꿔야 합니다.)

따라서 CSR Code 를 새로 생성할 필요가 없습니다.
issue 버튼을 눌러서 인증서를 발행합니다.

![](https://velog.velcdn.com/images/kws60000/post/9d7af08f-00ea-4476-a23a-b2966bd6e4bd/image.png)<br/>

### 2. 인증서 다운로드

인증서를 다운로드 받기 전에 CSR 코드를 입력하는 부분이 존재할 것입니다.
복사한 CSR 코드를 붙여넣기 합니다.
그러면 Certificate Status 가 ISSUED(발행됐다) 로 변경될 것입니다.
DOWNLOAD CERTIFICATE 를 눌러서 인증서를 다운받습니다.
![](https://velog.velcdn.com/images/kws60000/post/7c14da62-47ea-4711-920a-68d10bf2ac45/image.png)<br/>

### 3. CNAME 등록

사용하는 도메인에 대해서 소유권이 있는지를 확인하는 단계입니다.

1. Get a CNAME record from this page (Edit methods).

해당 링크를 클릭 후 CNAME 의 host, value 를 복사합니다.

2. Namecheap’s Default DNS, Backup DNS or FreeDNS: Visit the host records page.

해당 링크를 클릭 후 복사한 host, value 를 붙여 넣고 TTL 은 5분으로 설정합니다.

![](https://velog.velcdn.com/images/kws60000/post/b8542940-0930-4baf-b0c7-d2dd22f8536d/image.png)

<br/>

### 4. 모든 인증서 파일을 단일 파일로 결합

![](https://velog.velcdn.com/images/kws60000/post/13dbe578-4385-4374-8bc8-bd68b112c2fc/image.png)
다운로드 파일을 압축 해제하면 위와 같이 세개의 파일이 존재합니다.
이 중 **crt** 파일과 **ca-bundle** 파일을 합치면,
서버에 존재하는 private key 와 매칭하는 인증서 파일이 됩니다.
합치는 방법은 다음과 같습니다.

> // your_domain
> cat your_domain.crt your_domain.ca-bundle >> your_domain_chain.crt

> // ex) google
> cat google.crt google.ca-bundle >> google_chain.crt

<br/>
통합된 단일 파일을 서버의 ssl 폴더 경로로 이동합니다.<br/><br/>

### 5. Nginx 설정 확인 및 재실행

서버의 nginx 설정이 올바르게 되어 있는지 확인합니다.
보통 /etc/nginx/nginx.conf
또는 /etc/nginx/conf.d/default.conf 파일에서 설정하는 것 같습니다.
설정 파일 안에 https 설정이 다음의 내용을 포함하는지 확인합니다.

> server {

    listen       443 ssl;
    ssl_certificate "/etc/ssl/your_domain.crt";
    ssl_certificate_key "/etc/ssl/your_domain.key";
    ...

}

<br/>
경로는 저와 다를 수 있습니다.
private key 와 통합된 crt 의 경로를 올바르게 해줘야 합니다.

> service nginx restart
> service nginx status

<br/>

확인 후 이상이 없다면 적용된 것입니다.
시크릿 창을 띄워서 도메인에 접속하시면 https 적용이 되었을 것입니다.

만약 nginx 를 재실행 했을 때 다음과 같은 오류가 발견된다면,

> SSL: error:0906D066:PEM routines:PEM_read_bio:bad end line

<br/>

인증서 형식에 대한 오류입니다.
통합된 crt 파일을 확인합니다.
다음과 일치하는 부분이 있는지 찾아서 변경해줍니다.

> // 변경 전
> -----END CERTIFICATE----------BEGIN CERTIFICATE-----

> // 변경 후
> -----END CERTIFICATE-----
> -----BEGIN CERTIFICATE-----

```toc

```
