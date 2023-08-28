---
emoji: 🧬
title: B-Tree 인덱스
date: '2023-07-30 20:00:00'
author: devkimc
tags: db
categories: 블로그 db
---

## B-Tree

**자식 2개 만을 갖는 이진 트리를 확장하여 N개의 자식을 가질 수 있도록 고안된 것**입니다. 좌우 자식 간의 균형이 맞지 않을 경우에는 매우 비효율적이라, 항상 균형을 맞춘다는 의미에서 Balanced Tree 라고 불립니다.

최상위에 단 하나의 노드 만이 존재하는데, 이를 루트 노트라고 합니다. 중간 노드를 브랜치 노드, 최하위 노드를 리프 노드라고 합니다.

![](https://velog.velcdn.com/images/kws60000/post/7bc89b35-44c2-47c6-aff7-876cc0ab7140/image.png)

**각 노드가 키를 오름차순으로 포함하도록 데이터를 저장합니다.** 이러한 각 키에는 다른 두 개의 하위 노드에 대한 두 개의 참조가 있습니다. 왼쪽 자식 노드 키는 현재 키보다 작고 오른쪽 자식 노드 키는 현재 키보다 큽니다.

<br>

### 페이지

**디스크와 메모리에 데이터를 읽고 쓰는 최소 작업 단위**입니다. 일반적으로 인덱스를 포함해 PK와 테이블 등은 모두 페이지 단위로 관리됩니다. 만약 쿼리를 통해 1개의 레코드를 읽고 싶더라도 하나의 블록을 읽어야 하는 것입니다.

<br>

## B-Tree 인덱스

**가장 일반적인 인덱스로 B-Tree 구조를 사용**합니다. 특수한 경우가 아니라면 대부분 B-Tree 인덱스를 사용하면 됩니다.

인덱스는 페이지 단위로 저장되며, **인덱스 키를 바탕으로 항상 정렬된 상태를 유지**합니다. 정렬된 인덱스 키를 따라서 리프 노드에 도달하면 (Index key, PK)쌍으로 저장되어 있습니다.

![](https://velog.velcdn.com/images/kws60000/post/d5eb2ee8-0e30-47f4-a4f0-d8f4e8763424/image.png)

![](https://velog.velcdn.com/images/kws60000/post/f25e0b34-0d9b-46e5-a998-bc2977a2349a/image.png)

위의 예시는 리프노드를 제외한 나머지 노드를 표시한 B-Tree 입니다. 이름을 인덱스로 할 경우 PK 값이 아닌 이름으로 정렬되어 노드가 저장되는 것을 확인할 수 있습니다.

<br>

## B+Tree 인덱스

B+Tree는 DB의 인덱스를 위해 자식 노드가 2개 이상인 B-Tree를 개선시킨 자료구조입니다. 리프노드만 인덱스와 함께 데이터를 가지고 있고, 나머지 노드들은 데이터를 위한 인덱스만 갖습니다. 리프노드들은 LinkedList로 연결되어 있습니다.

데이터베이스의 인덱스 컬럼은 부등호를 이용한 순차 검색 연산이 자주 발생될 수 있습니다. 이러한 이유로 **B-Tree의 리프노드들을 LinkedList로 연결하여 순차검색을 용이하게 하는 등 B-Tree를 인덱스에 맞게 최적화**하였습니다.

<br>

![](https://velog.velcdn.com/images/kws60000/post/b4c55cb6-32dc-4051-98dd-a5f80e03a292/image.png)

위의 예시를 보면 리프가 아닌 노드에는 레코드가 저장되지 않습니다. 각 리프노드들은 오른쪽 방향의 다음 레코드들 참조합니다. **따라서 DB는 인덱스를 이용한 이진탐색이나 리프노드만 이용해서 모든 요소를 탐색하는 순차탐색을 할 수 있습니다.**

<br />

## 참고자료

[How Database B-Tree Indexing Works ](https://builtin.com/data-science/b-tree-index)<br />
[[Database] 인덱스(index)란?](https://mangkyu.tistory.com/96)<br />
[[MySQL] B-Tree로 인덱스(Index)에 대해 쉽고 완벽하게 이해하기](https://mangkyu.tistory.com/286)

```toc

```
