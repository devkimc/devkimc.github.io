---
emoji: 🧬
title: Java Stream 최종 처리
date: '2023-08-21 23:00:00'
author: devkimc
tags: java
categories: 블로그 java
---

## 1. 최종 처리

스트림은 중간 처리, 최종 처리 과정을 거친 후에 결과값을 반환합니다.
<br>
최종 처리는 중간 처리에서 정제된 요소들을 반복하거나, 집계(카운팅, 총합, 평균) 작업을 수행합니다.

주의할 점은 최종 처리를 꼭 해줘야 한다는 것입니다.
<br>
최종 처리를 하지 않으면 중간처리도 동작하지 않습니다.

<br>

## 2. 최종 처리 종류

### 2.1 매칭

매칭은 요소들이 특정 조건을 만족하는지 여부를 조사하는 최종 처리 기능입니다.
메서드는 `allMatch`, `anyMatch`, `noneMatch` 가 있습니다.

매개값으로 주어진 `Predicate` 가 리턴하는 값에 따라 boolean 값을 리턴합니다.

<br>

#### 예시

```java
String[] movieArray = {"바비", "오펜하이머", "콘크리트 유토피아", "밀수"};

boolean result = Arrays.stream(movieArray)
		.allMatch(m -> m.length() >= 2);
System.out.println("모든 영화의 길이는 2 이상이다. = " + result);

result = Arrays.stream(movieArray)
		.anyMatch(m -> m.contains(" "));
System.out.println("하나라도 띄어쓰기가 있는 영화가 존재한다. = " + result);

result = Arrays.stream(movieArray)
		.noneMatch(m -> m.startsWith("오"));
System.out.println("'오' 로 시작하는 영화는 존재하지 않는다. = " + result);
```

Output

```java
모든 영화의 길이는 2 이상이다. = true
하나라도 띄어쓰기가 있는 영화가 존재한다. = true
'오' 로 시작하는 영화는 존재하지 않는다. = false
```

<br>

### 2.2 집계

집계는 요소들을 처리해서 카운팅, 합계, 평균값, 최대값, 최소값등과 같이 하나의 값으로 산출하는 최종 처리 기능입니다.

`count`, `findfirst`, `max`, `min`, `average`, `sum`, `reduce` 가 있습니다.

<br>

#### 예시

```java
int[] intArray = {1, 2, 3, 4};

long count = Arrays.stream(intArray)
		.count();
System.out.println("count = " + count);

int first = Arrays.stream(intArray)
		.filter(i -> i > 2)
		.findFirst()
		.getAsInt();
System.out.println("2 보다 큰 first = " + first);

int max = Arrays.stream(intArray)
		.max()
		.getAsInt();
System.out.println("max = " + max);

int min = Arrays.stream(intArray)
		.min()
		.getAsInt();
System.out.println("min = " + min);

double average = Arrays.stream(intArray)
		.average()
		.getAsDouble();
System.out.println("average = " + average);

int sum = Arrays.stream(intArray)
		.sum();
System.out.println("sum = " + sum);

int reduceSum = Arrays.stream(intArray)
		.reduce(0, (a, b) -> a + b);
System.out.println("reduceSum = " + reduceSum);
```

Output

```java
count = 4
2 보다 큰 first = 3
max = 4
min = 1
average = 2.5
sum = 10
reduceSum = 10
```

<br>

### 2.3 수집

수집은 필터링 또는 매핑한 후 요소들을 수집하는 최종 처리 기능입니다. `collect` 메서드를 사용합니다.

`collect` 메서드는 `Collector` 를 매개변수로 사용합니다.

Collect<T, A, R> 에서 T는 요소, A는 누적기, R은 요소가 저장될 컬렉션입니다.
<br>
T요소를 A누적기가 R에 저장한다는 의미입니다.

`Collector` 의 구현 객체는 `Collectors` 클래스의 정적 메서드로 얻을 수 있습니다.

<br>

#### Collector<T, ?, List<T>>

`toList` 메서드를 사용합니다. T를 List에 저장한다는 뜻입니다.

#### Collector<T, ?, Set<T>>

`toSet` 메서드를 사용합니다. T를 Set에 저장한다는 뜻입니다.

#### Collector<T, ?, Map<T>>

`toMap(Function<T,K> keyMapper, Function<T,U> valueMapper)` 메서드를 사용합니다. <br>
T를 K와 U로 매핑하여 K를 키로 U를 값으로 Map에 저장한다는 뜻입니다.

<br>

#### 예시

```java
public class Student {
    private String name;
    private int age;

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

<br>

```java
List<Student> list = new ArrayList<>();
list.add(new Student("추사랑", 12));
list.add(new Student("이강인", 10));
list.add(new Student("윌리엄", 8));
list.add(new Student("이승우", 14));

List<Student> leeList = list.stream()
	.filter(s -> s.getName().startsWith("이"))
	.toList();
System.out.println("leeList size = " + leeList.size());

Map<String, Integer> map = list.stream()
	.collect(
		Collectors.toMap(
			s -> s.getName(),
			s -> s.getAge()
)
);
System.out.println("추사랑 = " + map.get("추사랑"));
System.out.println("윌리엄 = " + map.get("윌리엄"));

```

<br>

Output

```java
leeList size = 2
추사랑 = 12
윌리엄 = 8
```

<br>

### 2.4 그룹핑

`collect` 메서드는 요소를 수집하는 기능 이외에 컬렉션의 요소들을 그룹핑해서 Map 객체를 생성하는 기능도 제공합니다.

그룹핑을 위해 groupingBy(Function<T,K> classfier) 메서드를 사용합니다. <br>
리턴 타입은 Collector<T,?,Map<K,List<T>>> 입니다.

`groupingBy` 는 `Function` 을 이용해서 T를 K로 매핑하고, K를 키로 해서 List<T>를 값으로 갖는 Map 컬렉션을 생성합니다.

<br>

#### 예시

```java
List<Student> list = new ArrayList<>();
list.add(new Student("추사랑", 11));
list.add(new Student("이강인", 10));
list.add(new Student("윌리엄", 10));
list.add(new Student("이승우", 11));

Map<Integer, List<Student>> map = list.stream()
		.collect(
				Collectors.groupingBy(s -> s.getAge())
		);

List<Student> tenList = map.get(10);
tenList.stream().forEach(t -> System.out.println("t = " + t.getName()));

List<Student> elevenList = map.get(11);
elevenList.stream().forEach(e -> System.out.println("e = " + e.getName()));
```

Output

```java
t = 이강인
t = 윌리엄
e = 추사랑
e = 이승우
```

<br>

## 📚 참고자료

📘 이것이 자바다

```toc

```
