---
emoji: 🧬
title: Java Set
date: '2023-08-12 17:00:00'
author: vvs-kim
tags: java
categories: 블로그 java
---

## 1. Java set

Set 컬렉션 클래스는 Set 인터페이스를 구현한 클래스입니다. Set 컬렉션 클래스는 요소의 저장 순서를 유지하지 않고, 같은 요소의 중복 저장을 허용하지 않습니다. 따라서 중복을 제거해야 하거나 저장 순서가 중요하지 않을 때 자주 사용하는 컬렉션 클래스입니다.

<br>

## 2. Map 종류

### 2.1 HashSet

해시 알고리즘을 사용하여 검색 속도가 빠르고, 내부적으로 HashMap 인스턴스를 이용하여 요소를 저장합니다.

HashSet은 요소를 삽입할 때 이미 존재하는 요소인지 파악하기 위해 내부적으로 다음과 같은 과정을 거칩니다.

1. 해당 요소에서 hashCode() 메서드를 호출해 반환된 해시 값으로 검색할 범위를 결정한다.
2. 해당 범위 내의 요소들을 equals() 메서드로 비교한다.

```java
		Set<Integer> set = new HashSet<Integer>();

		set.add(2);
		set.add(4);
		set.add(6);
		set.add(10);
		set.add(10);
		set.add(10);
		set.add(30);
		set.add(40);
		set.add(50);

		System.out.println("set = " + set);
```

output

```java
set = [2, 50, 4, 6, 40, 10, 30]
```

<br />

### 2.2 LinkedHashSet

HashSet과 동일한 구조를 가지지만 삽입된 순서를 저장하는 Set 자료구조입니다.

```java
		Set<Integer> set = new LinkedHashSet<Integer>();

		set.add(2);
		set.add(4);
		set.add(6);
		set.add(8);
		set.add(10);
		set.add(20);
		set.add(30);
		set.add(40);
		set.add(50);

		System.out.println("set = " + set);
```

output

```java
set = [2, 4, 6, 10, 30, 40, 50]
```

<br />

### 2.3 TreeSet

TreeSet은 요소를 정렬해서 저장합니다. 내부적으로 레드-블랙 트리를 이용해서 요소를 저장합니다.
Comparator를 구현해서 정렬방법을 지정할 수 있습니다.

```java
		Set<String> set = new TreeSet<String>();

		set.add("z");
		set.add("y");
		set.add("x");
		set.add("w");
		set.add("b");
		set.add("a");

		System.out.println("set = " + set);
```

output

```java
set = [a, b, w, x, y, z]
```

<br />

#### Comparator 구현

유니코드를 기준으로 하여 내림차순 정렬을 하는 Comparator 생성

```java
import java.util.Comparator;

public class DescendingComparator implements Comparator<Character> {

    @Override
    public int compare(Character char1, Character char2) {
        int unicode1 = (int) char1;
        int unicode2 = (int) char2;

        if(unicode1 < unicode2) return  1;
        else if (unicode1 == unicode2) {
            return 0;
        }
        else {
            return -1;
        }
    }
}
```

내림차순 Comparator 사용

```java
		Set<Character> set = new TreeSet<Character>(new DescendingComparator());

		set.add('a');
		set.add('b');
		set.add('c');
		set.add('x');
		set.add('y');
		set.add('z');

		System.out.println("set = " + set);
```

output

```java
set = [z, y, x, c, b, a]
```

<br>

## 3. Set 활용 예제

교집합과 합집합의 데이터를 다루는 예제입니다.

addAll(): 결합을 수행하는 데 사용<br>
retainAll(): 교차를 구하는 데 사용<br>
removeAll(): 제거한 나머지 요소를 구하는 데 사용<br>

```java
		Integer[] A = {2, 4, 6, 8, 10};
		Integer[] B = {4, 8, 12};

		Set<Integer> set1 = new HashSet<Integer>();
		set1.addAll(Arrays.asList(A));
		Set<Integer> set2 = new HashSet<Integer>();
		set2.addAll(Arrays.asList(B));

		// 합집합
		Set<Integer> unionData = new HashSet<Integer>(set1);
		unionData.addAll(set2);
		System.out.println("unionData = " + unionData);

		// 교집합
		Set<Integer> intersectionData = new HashSet<Integer>(set1);
		intersectionData.retainAll(set2);
		System.out.println("intersectionData = " + intersectionData);

		// A에만 존재하는 요소
		Set<Integer> differenceData = new HashSet<Integer>(set1);
		differenceData.removeAll(set2);
		System.out.println("differenceData = " + differenceData);
```

output

```java
unionData = [2, 4, 6, 8, 10, 12]
intersectionData = [4, 8]
differenceData = [2, 6, 10]
```

addAll() 메서드를 사용하여 Set1에 존재하지 않는 요소만 unionData에 추가 했습니다.<br>
retainAll() 메서드를 사용하여 Set1과 Set2의 교차하는 요소만 남기고 나머지는 제거했습니다.<br>
removeAll() 메서드를 사용하여 Set1의 요소중 Set2와 교차하지 않는 요소만 남기고 나머지는 제거했습니다.<br>

<br>

## 📚 참고자료

[Set in Java](https://www.javatpoint.com/set-in-java)

[Set 컬렉션 클래스에 대하여](https://code-lab1.tistory.com/238)

```toc

```
