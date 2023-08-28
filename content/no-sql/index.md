---
emoji: 🧬
title: NoSQL
date: '2023-07-20 20:00:00'
author: devkimc
tags: db
categories: 블로그 db
---

## NoSQL 이란

비관계형 데이터베이스 유형을 가리킵니다. NoSQL 데이터베이스는 언어마다 관습화된 API, 선언적 구조와 쿼리 언어, 쿼리별 언어를 사용하여 질의할 수 있습니다. 이러한 이유로 not only SQL 데이터베이스라고 불립니다.

<br />

## NoSQL의 등장배경

### 스토리지 비용 감소

2000년대 말에 스토리지 비용이 크게 하락하면서 등장했습니다. 단순히 **데이터 중복 감소를 목적으로 복잡하고 관리하기 어려운 데이터 모델을 생성해야 하던 트렌드가 바뀐 것**입니다.

![](https://velog.velcdn.com/images/kws60000/post/dc1f3c7b-3d87-410a-a807-fc091141f8ad/image.png)

### 비정형 데이터

인터넷이 활성화되고, SNS 등이 등장하면서 저장해야 하는 데이터의 양이 증가했습니다. 이러한 **데이터는 정형, 반정형 등 모양과 크기가 모두 다르기 때문에 미리 스키마를 정의하는 것이 거의 불가능**해졌습니다. 개발자가 엄청난 양의 비정형 데이터를 저장할 수 있도록 지원하기 위해 등장했습니다.

### 유연한 개발 방식

애자일 방법론의 인기가 높아지면서 소프트웨어 개발자들은 소프트웨어 개발 방식을 재고하기 시작했습니다. 그리고 **변화하는 요구사항에 발 빠르게 적응해야 할 필요가 있음을 인식**했습니다. 데이터베이스 모델에 이르기까지 소프트웨어 스택 전반에서 반복 작업과 변경을 신속하게 수행할 수 있는 능력이 필요했고, 개발자들에게 이러한 유연성을 제공하기 위해 등장했습니다.

### 분산 시스템

클라우드 컴퓨팅의 인기가 높아졌고, 개발자들은 퍼블릭 클라우드를 사용해 애플리케이션과 데이터를 호스팅하기 시작했습니다. 이들은 **여러 서버와 리전에 데이터를 분산시켜 애플리케이션 복원력을 높이고, 스케일이 아닌 스케일아웃**을 수행하기를 원했습니다. 이러한 분산 시스템을 지원하기 위해 등장했습니다.

<br />

## NoSQL의 종류

### Document DB

**JSON, BSON, XML 과 같이 문서 형식**으로 저장할 수 있는 DB 입니다.

#### Document

문서는 문서 데이터베이스의 레코드입니다. 문서는 필드-값 쌍으로 저장합니다. 값은 문자열, 숫자, 배열 또는 객체를 포함하여 다양한 유형 및 구조일 수 있습니다.

#### 장점

```json
{
  "_id": 1,
  "first_name": "Tom",
  "email": "tom@example.com",
  "cell": "765-555-5555",
  "likes": ["fashion", "spas", "shopping"],
  "businesses": [
    {
      "name": "Entertainment 1080",
      "partner": "Jean",
      "status": "Bankrupt",
      "date_founded": {
        "$date": "2012-05-19T04:00:00Z"
      }
    },
    {
      "name": "Swag for Tweens",
      "date_founded": {
        "$date": "2012-11-01T04:00:00Z"
      }
    }
  ]
}
```

위와 동일한 정보를 관계형 테이터베이스에 저장할 경우 세개의 테이블(Info, Likes, Businesses)이 필요합니다. 그리고 id 를 외래키로 사용하여 ORM, Join 등을 사용해야 합니다.

**ORM, Join, 외래키 등을 사용할 필요없이** 쉽고 직관적이며 스키마를 동적으로 변경할 수 있습니다.

<br>

### Key-value DB

**데이터가 key-value 형식**으로 저장되고, 해당 데이터를 읽고 쓰는데 최적화된 DB 입니다.

#### 장점

효율적이고 간결한 데이터 구조를 정의하여 key-value 가져오기/업데이트/제거의 간단한 형식으로 데이터에 접근할 수 있습니다. 키를 통해 값을 빠르게 검색할 수 있습니다.

<br>

### Column Store DB

열 지향 모델을 사용하여 데이터를 저장하는 DB 입니다. 관**계형 데이터베이스의 스키마와 비슷한 Keyspace 라는 개념을 사용**합니다. 키스페이스에는 열을 포함하는 행들을 포함하는 Column Family 가 포함됩니다.
<br>

![](https://velog.velcdn.com/images/kws60000/post/1393fd5a-dee7-412d-baae-e93451dcd055/image.png)

Column Family 의 예시입니다. 여러 행으로 구성됩니다.
<br>

![](https://velog.velcdn.com/images/kws60000/post/7fefc509-ff64-4918-8ac0-8016b72407c2/image.png)

Row 는 고유키와 각 열에 대한 정보로 구성됩니다.
<br>

![](https://velog.velcdn.com/images/kws60000/post/f897a7d6-88d9-46a9-9f61-eb5eb1416adc/image.png)

#### 장점

열 형식의 구조로 인해 SUM, COUNT, AVG 등을 잘 수행합니다. 효율적인 압축의 이점을 통해 더 빠르게 읽을 수 있습니다.

<br>

### Graph DB

**데이터 요소 간의 관계에 중점을 두는 DB** 입니다. 데이터 요소는 노드, 엣지, 속성을 저장됩니다. 어느 객체, 장소 또는 사람 모두 노드가 될 수 있습니다. 엣지는 노드 간의 관계를 정의합니다.

![](https://velog.velcdn.com/images/kws60000/post/5157be09-6420-4b49-b42e-8c7953a7cce0/image.png)

#### 장점

##### 대규모의 연관 데이터 조회 서능

관계형 데이터베이스를 사용하는 대규모 응용프로그램의 경우 20, 30 개 이상의 테이블에 조인을 하는 쿼리가 있다고 합니다. 레코드가 많을 수록 실행 시간은 오래걸릴 것입니다. 이런 상황에서 그래프 DB를 사용할 경우 훨씬 간단하고 빠르게 실행이 됩니다.

이유는 그래프 DB 에서 쿼리가 그래프의 일부로 지역화되기 때문입니다. 즉, 각 **쿼리의 실행 시간은 전체 그래프의 크기가 아니라 해당 쿼리를 충족하기 위해 통과한 그래프 부분의 크기에만 비례**합니다.

##### 유연성

설정된 스키마를 정의할 필요가 없기 때문에 데이터베이스가 확장되는 방식에 대해 완전한 유연성을 가질 수 있습니다.

<br />

## RDBMS vs NoSQL

### RDBMS

#### 장점

- 정해진 스키마에 따라 데이터를 저장해야 하므로 명확한 데이터 구조를 보장합니다.
- 각 데이터는 중복없이 한 번만 저장할 수 있습니다.
- 복잡한 트랜잭션을 지원합니다.

#### 단점

- 테이블 간의 관계를 맺고 있어서 시스템의 규모가 커질 경우 JOIN 문이 많은 복잡한 쿼리가 생성되며, 검색 시간도 오래걸립니다.
- 스키마로 인해 데이터가 유연하지 못합니다. 변경 될 경우 번거롭고 어렵습니다.
- 성능 향상을 위해 Scale-up 만 지원합니다. 이로 인해 비용이 크게 증가할 수 있습니다.

#### 사용처

- 변경될 여지가 없고, 명확한 스키마가 사용자와 데이터에게 중요한 경우

<br />

### NoSQL

#### 장점

- 복잡도가 떨어져서 훨씬 대용량의 데이터를 저장 및 관리할 수 있습니다.
- 스키마가 존재하지 않아서 정형, 비정형 및 반정형 데이터를 관리할 수 있습니다.
- 또한, 데이터가 자유로운 구조를 가지므로 언제든 저장된 데이터를 조정하고 새로운 필드를 추가할 수 있습니다.
- 데이터 분산이 용이하며 성능 향상을 위한 Scale-out 이 가능합니다.

#### 단점

- 데이터 중복이 발생할 수 있으며 중복된 데이터가 변경 될 경우 수정을 모든 컬렉션에서 수행해야 합니다.
- 간단한 트랜잭션만 지원합니다.

#### 사용처

- 읽기는 자주 하지만 데이터 변경은 자주 없는 경우
- 정확한 데이터 구조를 알 수 없거나, 변경/확장될 수 있는 경우
- 데이터베이스를 수평적으로 확장해야 하는 경우
- 막대한 양의 데이터를 다루는 경우

<br />

## 참고자료

[NoSQL이란 무엇입니까?](https://www.mongodb.com/ko-kr/nosql-explained)<br>
[NoSQL이란 무엇인가?](https://www.oracle.com/kr/database/nosql/what-is-nosql/)<br>
[NoSQL 데이터베이스란?](https://www.ibm.com/kr-ko/topics/nosql-databases)

[Understanding the Different Types of NoSQL Databases](https://www.mongodb.com/ko-kr/scale/types-of-nosql-databases)<br>
[What is a Column Store Database?](https://database.guide/what-is-a-column-store-database/)<br>
[What is a Graph Database?](https://database.guide/what-is-a-graph-database)

[Database-RDBMS와-NOSQL-차이점](https://khj93.tistory.com/entry/Database-RDBMS%EC%99%80-NOSQL-%EC%B0%A8%EC%9D%B4%EC%A0%90)

```toc

```
