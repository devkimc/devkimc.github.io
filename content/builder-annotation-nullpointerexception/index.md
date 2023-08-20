---
emoji: 💻
title: Builder 어노테이션 사용시, List 추가에 대한 NullPointerException
date: '2023-05-23 23:00:00'
author: devkimc
tags: spring
categories: 블로그 spring
---

## 🚫 에러 상황

builder 패턴을 사용하여 유저 인스턴스를 생성했고, userGroups 필드(List)에 데이터를 추가하자 NullPointException 이 발생했다.

> java.lang.NullPointerException: Cannot invoke "java.util.List.add(Object)" because the return value of "user.domain.User.getUserGroups()" is null

<br/>

### User 엔티티

```java
@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    ...

    @OneToMany(mappedBy = "user")
    private List<UserGroup> userGroups = new ArrayList<UserGroup>();

    @OneToMany(mappedBy = "recvUser")
    private List<Invite> invites = new ArrayList<Invite>();

}
```

<br/>

### User 생성 - builder 사용

```java
    @Override
    @Transactional
    public User join(SocialJoinRequest socialJoinRequest) {

        User user = User.builder()
                .socialUserId(socialJoinRequest.getSocialUserId())
                .email(socialJoinRequest.getEmail())
                .nickname(socialJoinRequest.getNickname())
                .loginType(socialJoinRequest.getLoginType())
                .userType(UserType.ROLE_GENERAL)
                .build()
                ;

        return userRepository.save(user);
    }
```

<br/>

## 📜 에러 원인

null 인 리스트에 데이터를 추가할 수 없다는 것이다.
엔티티에서 리스트 필드를 초기화 했음에도 불구하고 null 인 상황인다..

의심가는 건 builder 메서드를 사용 시 List 의 값은 입력하지 않았다.
알아보니 builder 패턴은 엔티티에서 초기화한 값을 무시하고 초기화를 한다.

따라서 builder 패턴 사용 시, 생성된 유저의 List 필드는 아래와 같았을 것이다.

```java
    @OneToMany(mappedBy = "user")
    private List<UserGroup> userGroups;
```

<br />

## 🔑 해결 방법

### 1. 기본 생성자 사용

```java
User user = new(socialJoinRequest.getSocialUserId(),socialJoinRequest.getEmail()...);
```

기본 생성자 사용시, 엔티티에서 초기화한 값으로 인스턴스를 생성하므로 List 는 null 이 아니다.

<br />

### 2. builder 메서드 사용 시, List 필드 초기화

```java
    @Override
    @Transactional
    public User join(SocialJoinRequest socialJoinRequest) {

        User user = User.builder()
                ...
                .userGroups(new ArrayList<UserGroup>())
                .build()
                ;

        return userRepository.save(user);
    }
```

builder 메서드를 사용할 때마다 list 를 초기화 시켜줘야 하는 단점이 있다.

<br />

### 3. Builder.Default 어노테이션 사용

```java
    @Builder.Default
    @OneToMany(mappedBy = "user")
    private List<UserGroup> userGroups = new ArrayList<UserGroup>();
```

builder 패턴으로 인스턴스 생성시, 지정한 값으로 초기화 시켜주는 방법이다.

<br />

## 참고 사이트

https://bbeomgeun.tistory.com/174

```toc

```
