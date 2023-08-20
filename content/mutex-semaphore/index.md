---
emoji: 💻
title: 뮤텍스(Mutex)와 세마포어(Semaphore)
date: '2023-06-17 23:00:00'
author: devkimc
tags: java
categories: 블로그 java
---

## 📕 개념

### ❌ 교착 상태(Deadlock)

노트북으로 코딩을 하고 싶은 두 사람 A, B(프로세스/스레드) 가 있다.
A는 배터리가 0% 인 노트북(자원)을 가지고 있고(점유) 충전기 를 기다리고 있다(대기).
B는 충전기(자원)를 가지고 있고(점유) 노트북을 기다리고 있다(대기).

이처럼 **서로 자원을 놓아줄 생각은 없고, 자원 요청을 무한정 대기하고 있는 상태** 를 말합니다.

> ### Critical section(임계 영역)
>
> 여기서 노트북과 충전기를 공유 자원이라고 부르고, **공유자원이 속해 있어 교착 상태가 발생할 수 있는 영역**을 임계영역이라고 부릅니다.
> 공유 데이터의 일관성을 보장하기 위해 하나의 프로세스/스레드만 진입해서 실행(상호배제)가능한 영역입니다.

교착 상태가 발생하기 위해서는 네가지 조건을 충족해야 합니다. 이중 상호배제를 중점으로 알아보려 합니다.

1. 상호배제
2. 점유대기
3. 비선점
4. 순환대기

<br />

### Mutual exclusion(상호 배제)

프로세스/스레드가 필요로 하는 공유자원에 대해 배타적인 통제권을 요구하는 것을 말합니다.
다시 말하면, 하나의 프로세스/스레드가 공유자원을 사용할 때 다른 프로세스가 공유자원에 접근할 수 없도록 통제하는 것을 말합니다.

<br />

### 🔑 뮤텍스 (Mut ~~ual~~ ex ~~clusion~~)

화장실(공유자원)이 하나뿐인 식당이 있습니다. 식당에는 A, B, C 라는 손님(프로세스/스레드)이 식사 중입니다.
화장실을 가기 위해서는 카운터 옆에 걸린 열쇠가 있어야 합니다.

A 손님이 열쇠를 들고 화장실에 먼저 들어갔습니다. 잠시 뒤 B 손님이 화장실에 가고 싶어졌습니다. 그러나 카운터에 열쇠가 없기 때문에 카운터 앞에서 기다려야 합니다.

C 손님도 화장실에 가고 싶어졌고, B 손님 뒤에서 대기 해야 합니다.

A 손님이 화장실에서 나와 열쇠를 반납했습니다. 기다리던 손님들 중 맨 앞에 기다리던 B 손님이 열쇠를 갖을 수 있고, 화장실에 갈 수 있습니다.

이것이 뮤텍스가 동작하는 방식입니다.

화장실 열쇠는 공유자원에 접근하기 위한 어떠한 오브젝트이고,
화장실에 가고 싶어서 기다리는 대기줄은 Queue 입니다.

뮤텍스는 **여러 프로세스/스레드를 실행하는 환경에서 자원에 대한 접근에 제한을 강제하기 위한 동기화 매커니즘**이고, 어떠한 오브젝트를 소유한 프로세스/스레드만이 공유자원에 접근할 수 있습니다.

<br />

### 🔢 세마포어

또 다른 식당이 있습니다. 이 식당에는 화장실 2개 있습니다. 화장실 입구에 화장실의 빈칸 개수를 알려주는 전광판(2)이 있습니다.

A 손님이 화장실에 가고 싶어졌습니다. 전광판을 보고 빈칸이 1개 이상이 있다는 걸 확인했습니다. 전광판의 숫자를 하나 차감(1)하고 화장실로 들어갑니다.

이어서 B 손님도 화장실로 들어 갔습니다. 전광판의 숫자는 0입니다. C 손님도 화장실에 가고 싶어졌습니다. 그러나 전광판의 숫자가 1이 될때 까지 기다려야 합니다.

A 손님이 화장실에서 나옵니다. 전광판의 숫자는 1로 바뀌고, 기다리던 C 손님은 화장실로 들어갑니다.

이것은 세마포어가 동작하는 방식입니다.

세마포어는 현재 **공유자원에 접근할 수 있는 프로세스/스레드의 수를 나타내는 값을 두어 상호배제를 달성하는 기법**입니다.

<br />

## 🧑🏻‍💻 예제

### 세마포어

```java
import java.util.concurrent.Semaphore;

public class Toilet implements Runnable
{
    private int guestId;
    private Semaphore semaphore;

    public Toilet(int guestId, Semaphore semaphore)
    {
        this.guestId = guestId;
        this.semaphore = semaphore;
    }

    @Override
    public void run() {
        String threadName = Thread.currentThread().getName();

        System.out.println(
                "Guest went into the toilet :" + threadName + ", for guest id:" + this.guestId
        );

        try {
            semaphore.acquire(); // 취득
            something();
            semaphore.release(); // 해제
        }
        catch(InterruptedException e){}
    }

    public void something() throws InterruptedException
    {
        Thread.sleep(5000);
    }
}
```

Toilet 클래스는 생성자로 게스트 아이디, 세마포어를 매개변수로 받습니다.
사용자는 공유자원이 1 이상일 때, 공유자원을 취득할 수 있고 something(?) 무언가를 합니다.
something 메서드는 5초의 대기시간을 주기 때문에, 5초마다 화장실을 이용하는 손님이 바뀔 거라는 것을 예상할 수 있습니다.

<br />

```java
import org.junit.jupiter.api.Test;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.stream.IntStream;

class SemaphoreTest {

    @Test
    void semaphore() {
        try {
            int totalToilet = 5; // 화장실(공유자원) 5개
            int totalThreadPool = 50; // 쓰레드풀 설정

            Semaphore semaphore= new Semaphore(totalToilet, true); // true == FIFO

            ExecutorService exeService = Executors.newFixedThreadPool(totalThreadPool);
            IntStream.range(0, 100).forEach(i -> exeService.submit(new Toilet(i, semaphore)));

            exeService.shutdown();
            exeService.awaitTermination(1, TimeUnit.MINUTES);
        }
        catch(InterruptedException e){}
    }
}
```

Semaphore 생성자를 이용해 공유자원 개수와 FIFO 설정을 합니다.
newFixedThreadPool 로 쓰레드풀을 설정합니다.
IntStream 으로 100명의 손님을 생성하고, 모두 화장실로 보냅니다.
화장실은 5개 이고 something 메소드를 수행하는데 5초 시간이 걸리므로,
5초마다 손님이 화장실에 입장하는 것을 확인할 수 있습니다.

![](https://velog.velcdn.com/images/kws60000/post/b9abaab3-1114-45b5-9f5e-2540c6f84f3e/image.gif)

<br />

## 참고자료

[뮤텍스(Mutex)와 세마포어(Semaphore)의 차이](https://medium.com/@kwoncharles/%EB%AE%A4%ED%85%8D%EC%8A%A4-mutex-%EC%99%80-%EC%84%B8%EB%A7%88%ED%8F%AC%EC%96%B4-semaphore-%EC%9D%98-%EC%B0%A8%EC%9D%B4-de6078d3c453)

[[10분 테코톡] 🎲 와일더의 Mutex vs Semaphore](https://www.youtube.com/watch?v=oazGbhBCOfU&list=PLgXGHBqgT2TvpJ_p9L_yZKPifgdBOzdVH&index=159)

[All-about-java-semaphore](https://scrutinybykhimaanshu.blogspot.com/2019/08/all-about-java-semaphore.html)

```toc

```
