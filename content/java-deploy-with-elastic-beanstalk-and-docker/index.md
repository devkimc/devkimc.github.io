---
emoji: 💻
title: Elastic Beanstalk + Docker + Java 설정
date: '2023-06-19 23:00:00'
author: devkimc
tags: server
categories: 블로그 server
---

## 🤔 적용 이유

### AutoScaling, LoadBalancer

EB를 사용해본 적은 없으나 사용율이 증가하면 scale out 했다가, 다시 줄어들면 scale in 을 할 수 있는 **AutoScaling Group**과 서버의 부하를 나누어 주는 **LoadBalancer**를 간편하게 설정할 수 있는 점이 장점으로 느껴졌습니다.
다른 여러 장점은 사용해보기 전에는 와닿지 않아서 '사용해보고 느껴보자' 해서 사용했습니다.

## ⚙️ 설정 방법

### 1. IAM 역할 추가

Elastic beanstalk(이하 EB) 의 환경을 구성하기 위해 각 역할에 권한이 필요합니다.

#### 1.1 서비스 역할

EB를 서비스로 사용하므로 담당할 IAM 역할을 부여합니다.
[Elastic Beanstalk 서비스 역할 관리](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/iam-servicerole.html)

![](https://velog.velcdn.com/images/kws60000/post/c925b17e-a881-431f-80db-601c7e23e505/image.png)

설정하지 않을 시, 다음과 같은 에러를 만나게 됩니다..

> Configuration validation exception: Invalid option specification (Namespace: 'aws:elasticbeanstalk:managedactions', OptionName: 'ManagedActionsEnabled'): You can't enable managed platform updates when your environment uses the service-linked role 'AWSServiceRoleForElasticBeanstalk'. Select a service role that has the 'AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy' managed policy.

<br />

#### 1.2 EC2 인스턴스 프로파일

EB 환경 구성이 완료되면 EC2 인스턴스가 자동으로 생성됩니다. 이를 위해 IAM 역할이 필요합니다.
[Elastic Beanstalk 인스턴스 프로파일 관리](https://docs.aws.amazon.com/ko_kr/elasticbeanstalk/latest/dg/iam-instanceprofile.html#iam-instanceprofile-create)

![](https://velog.velcdn.com/images/kws60000/post/7dc30e7e-5db3-4df3-a575-0e36ec547a5a/image.png)

<br />

### 2. 환경 구성

[Elastic Beanstalk 환경 구성](https://ap-northeast-2.console.aws.amazon.com/elasticbeanstalk/home?region=ap-northeast-2#/create-environment)

![](https://velog.velcdn.com/images/kws60000/post/df13710c-fdc3-4f10-8406-161353d4d4d4/image.png)

환경 티어: 웹 서버 환경 선택 시 Http 요청을 처리 합니다.<br />
환경 정보 - 환경 이름: 애플리케이션 이름 + [-env] 형식으로 자동 완성됩니다.<br />
환경 정보 - 도메인: 작성하지 않을 시 랜덤값으로 자동 생성됩니다.<br />

![](https://velog.velcdn.com/images/kws60000/post/2c5a7da3-e0e0-45c9-980a-bd21e970a317/image.png)

사전 설정: AutoScaling, LoadBalancer를 사용할 예정이라면 고가용성을 선택해 줍니다. 아니면 단일 인스턴스를 선택합니다.

여기까지 설정하고 검토 단계로 건너뛰면 잠시 뒤 EB 가 생성됩니다.
생성된 도메인을 클릭하면 화면이 아래처럼 출력됩니다.

![](https://velog.velcdn.com/images/kws60000/post/9244fab9-b269-461b-ad4e-0d9b1b989928/image.png)

<br />

### 3. 배포

도커 허브 레포지토리를 생성하고, 이미지를 추가해줍니다.
docker-compose.yml 을 작성합니다.

```bash
version: "3"
  api:
    image: tester/jpa-rest:0.0.1-dev
    restart: always
    ports:
      - "80:9090"
    container_name: jpa-rest-api
    environment:
      TZ: Asia/Seoul
      SPRING_PROFILES_ACTIVE: prod
```

<br />

EB 환경 탭에서 업로드 및 배포를 클릭합니다.

![](https://velog.velcdn.com/images/kws60000/post/48fc5a1d-1bff-41b0-b61d-fc5570e97215/image.png)

정상 배포가 된걸 확인할 수 있습니다.

![](https://velog.velcdn.com/images/kws60000/post/e8d180c9-1b96-43c7-9e7c-4736a4fbdf2f/image.png)

<br />

### 4. 배포 옵션

배포 옵션은 4가지 정도가 존재합니다. Rolling 이 기본값으로 설정되어 있습니다. 저는 기본 설정인 Rolling 방식으로 진행하여 무중단 배포가 가능하도록 설정했습니다. 다운타임이 존재하지 않으면서도 배포시간이 비교적 빨라서 소규모 서비스에서 적합하다고 생각했습니다.

#### 1. All at once

모든 인스턴스에 동시에 새 버전 배포
단순하고 가장 빠른 배포 방식

단점: 서비스가 중단되는 다운타임이 존재한다.

#### 2. Rolling

배치 단위로 새 버전 배포 (단일 인스턴스 불가)
예를 들어, 4개의 인스턴스가 존재한다고 가정합니다.
2개의 인스턴스를 먼저 배포하고, 배포가 완료되면 나머지 인스턴스도 배포합니다.

단점: 순차적으로 배포가 되기 때문에, 누군가는 업데이트 전 버전을 누구는 업데이트 후 버전을 볼 수 있습니다.

#### 3. Rolling with additional batch

배치 단위로 새 버전 배포, +1 추가 배치 (단일 인스턴스 불가)
예를 들어, 4개의 인스턴스가 존재한다고 가정합니다. 배포 시 2개의 인스턴스를 추가합니다. 이후 배치 단위로 배포합니다. 6개중 4개의 인스턴스가 배포 완료되면 2개의 인스턴스는 종료 합니다.

#### 4. Immutable

새로운 인스턴스 그룹에 배포
AutoScaling Group을 새로 만들어 배포한다. 새로 생긴 그룹은 기존의 그룹과 같은 DNS 를 바라본다. (Blue green 과 비슷하다)

<br />

### 5. AutoScaling

EB 의 AutoScaling 방법은 두 가지로 나뉩니다.

#### 1. Triggers based scaling

특정 메트릭의 임계값을 기준으로 스케일링을 한다.

#### 2. Time-based scaling

특정 시간을 기준으로 스케일링을 한다. (ex. 오전 8시에 대규모 업데이트가 실시 된다.)

#### 설정하기

저는 CPU 사용률을 메트릭으로 하여 60% 이상일 시 스케일업을 하도록 설정했습니다.

![](https://velog.velcdn.com/images/kws60000/post/1bc19506-4a0b-4f21-a37d-5762c4f0dd35/image.png)![](https://velog.velcdn.com/images/kws60000/post/0cc4e8da-a01d-40a5-8f5e-f79676ad3c62/image.png)

인스턴스가 2~4개 가 유지되도록 설정했습니다.

![](https://velog.velcdn.com/images/kws60000/post/eb217c0d-fb02-4964-a16a-88b2bedc3f18/image.png)

인스턴스가 2개 실행된 것을 확인할 수 있습니다.![]

(https://velog.velcdn.com/images/kws60000/post/55986749-6484-4039-9afe-a88ee12e7b3d/image.png)

<br />

## 📄 마치며..

### 1. 초기 설정이 빠르고 간단하다.

EC2 를 사용하면 인스턴스 생성, 탄력적 IP 설정, 도커 설치 등 당연히 수행되어야 되는 작업이 있습니다. 어려운 일은 아니지만, EB 가 반복된 작업을 줄여주므로 편리했습니다.

### 2. AutoScaling 설정이 편하다.

AutoScaling 설정이 간단했습니다. 눈에 보이는데로 메트릭을 설정하고, 임계값과 인스턴스 수만 정하면 적용이 가능했습니다.

<br />

## 참고 자료

[AWS Elastic Beanstalk 활용하여 수 분만에 코드 배포하기 - 최원근 솔루션즈 아키텍트(AWS)](https://www.youtube.com/watch?v=AfRnvsRxZ_0)
[무중단 배포 방식(Rolling / BlueGreen / Canary)](https://llshl.tistory.com/47)
[[AWS] Spring Boot 프로젝트 Elastic beanstalk에 수동 배포하기](https://twosky.tistory.com/55)

```toc

```
