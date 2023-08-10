---
emoji: 📓
title: SSL 인증(DNS, Nginx)
date: '2022-12-15 23:00:00'
author: vvs-kim
tags: web
categories: 블로그 web
---

## 1 - CSR 생성

> mac → 키체인 접근 → 인증서 지원 -> 인증기관에서 인증서 요청

<br />

## 2 - DNS 검증

SSL 인증서를 발급하기 전에, 해당 도메인의 소유주가 맞는 지 확인하는 검증 단계입니다.
도메인 구입 사이트 또는 호스팅 사이트에서 cname 등록인 필요합니다. (ex. aws route53, gabia 등)
하루를 기다려도 검증이 안될 시 잘못 입력한 부분이 있는지 확인해야 합니다.

> Type: CNAME Record
> Host: CNAME
> Value: CNAME value
> TTL: Automatic

🚫 주의할점: Host 입력 시 도메인 제거 후 입력할 것!

<br />

## 3 - SSL 인증서 다운로드

> DNS 검증 완료 시 구매 사이트로부터 다운로드

<br />

## 4 - chain 파일 생성 (필요 시)

> [SSL & CSR Decoder](https://decoder.link/result)

1. 접속 후 CSR 입력 후 DECODE
2. Bundle (Nginx) 다운로드

<br />

## 5 - 개인키 파일 생성

> mac → 키체인 접근 → 도메인 검색(ex. google.com) → 개인키 우클릭 → 내보내기(.p12 파일)

<br />

## 6 - p12 파일을 key 파일로 변환

```bash
openssl pkcs12 -in your_domain.p12 -nodes -out your_domain.key -nocerts
```

<br />

## 7 - 인증 파일을 nginx 로 이동

```jsx
/etc/lss /
  certs /
  your_domain_chain.crt / // 체인
  etc /
  ssl /
  certs /
  your_domain_private.key; // 개인키
```

<br />

## 8 - Nginx 설정

1. 설정 파일 생성
2. http → https 리다이렉트 설정
3. 인증서 위치 설정(ssl_certificate, ssl_certificate_key)

```bash
// /etc/nginx/conf.d/default.conf

server {
	listen 80 default_server;
	listen [::]:80 default_server;

    return 301 https://your_domain$request_uri;
}

server {
    listen 443 ssl;

    ssl_certificate /etc/ssl/certs/your_domain_chain.crt;
    ssl_certificate_key /etc/ssl/certs/your_domain_private.key;

	root /var/www/html;

	index index.html index.htm index.nginx-debian.html;

	location / {
		try_files $uri $uri/ =404;
	}

    server_name your_domain www.your_domain;
}
```

<br />

```jsx
// nginx 문법 테스트

sudo nginx -t

nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

<br />

```jsx
// nginx 재실행

sudo service nginx restart
```

```toc

```
