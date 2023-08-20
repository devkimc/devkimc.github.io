---
emoji: 💻
title: Could not safely identify store assignment for repository candidate interface
date: '2023-06-18 23:00:00'
author: devkimc
tags: spring
categories: 블로그 spring
---

## 🚫 에러 상황

Redis 내의 Refresh token 값을 다루기 위해 CrudRepository 를 사용하고, RDBMS 내의 데이터를 다루기 위해 JpaRepository 를 사용했습니다.

프로젝트를 실행하면 뜨는 여러 로그 중 에러는 아니지만, 반갑지 않은 INFO 로그가 2개의 영역으로 나뉘어 7개 정도 반복되는 것을 확인했습니다. 엔티티 클래스 수 만큼 반복 되었고, 아래처럼 로그가 출력됐습니다.

- A 영역: Spring Data JPA

```
2023-06-18 19:10:30.731  INFO 4986 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2023-06-18 19:10:30.670  INFO 4986 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data JPA - Could not safely identify store assignment for repository candidate interface jparest.practice.auth.jwt.RefreshTokenRepository; If you want this repository to be a JPA repository, consider annotating your entities with one of these annotations: javax.persistence.Entity, javax.persistence.MappedSuperclass (preferred), or consider extending one of the following types with your repository: org.springframework.data.jpa.repository.JpaRepository
```

- B 영역: Spring Data Redis

```
2023-06-18 19:10:30.741  INFO 4986 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface jparest.practice.group.repository.GroupRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2023-06-18 19:10:30.741  INFO 4986 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface jparest.practice.group.repository.UserGroupRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2023-06-18 19:10:30.741  INFO 4986 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface jparest.practice.invite.repository.InviteRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2023-06-18 19:10:30.741  INFO 4986 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface jparest.practice.rest.repository.GroupRestRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2023-06-18 19:10:30.742  INFO 4986 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface jparest.practice.rest.repository.RestRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2023-06-18 19:10:30.742  INFO 4986 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface jparest.practice.user.repository.UserRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
```

로그는 두개의 영역으로 나뉘었고, 읽어보면

"Spring Data JPA: **엔티티의 레포지토리에 대해 식별할 수 없다**. 만약 이 레포지토리를 JPA repository로 만들려면 @Entity 어노테이션을 사용해라"

"Spring Data Redis: **엔티티의 레포지토리에 대해 식별할 수 없다**. 만약 이 레포지토리를 Redis repository로 만들려면 @RedisHash 어노테이션을 사용해라"

이런 내용인 것 같습니다. 왜 레포지토리를 식별할 수 없는지 의문이었습니다.

<br />

## 📜 에러 원인

JpaRepository, CrudRepository 는 모두 Repository 인터페이스를 확장한 것입니다.

문제는 @Entity 를 사용하지 않고 Respository 인터페이스를 사용(Redis 의 경우)했을 때, Spring 이
'**Repository 로부터 생성된 메서드를 어떻게 사용하지?**' 하고 의문을 품고 스스로 찾는다고 합니다.

따라서, 아래처럼 Redis 에서 CrudRepository 를 사용하고 @Entity 를 사용하지 않았으므로
Spring은 각 Repository 의 메서드 들을 어떻게 구현해야하는 지 찾습니다.

```java
package jparest.practice.auth.jwt;

...

@Getter
@RedisHash("refresh")
@NoArgsConstructor
public class RefreshToken {

    @Id
    private String id;

    private String refreshToken;

    ...
}
```

```java
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}

```

그러한 탐색 과정이 (JpaRepository x N) + (CrudRepository x M) 만큼 이루어진거라고 생각이 듭니다. (추측입니다.)

<br />

## 🔑 해결 방법

### 1. EnableRedisRepositories 추가

```java
package jparest.practice.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@Configuration
@EnableRedisRepositories(basePackages = "jparest.practice.auth.jwt")
public class RedisConfig {
}

```

EnableRedisRepositories 어노테이션 을 이용하면,
RedisRepository 를 활성화 시키고, 빈 스캐닝 범위를 지정할 수 있습니다.
이렇게 지정해주니 RedisRepository 에 대한 탐색을 다른 경로해서 하지 않아서 B 영역 로그가 출력되지 않았습니다.

<br />

### 2. EnableJpaRepositories 추가

```java
package jparest.practice.common.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "jparest.practice",
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASPECTJ, pattern = "jparest.practice.auth.jwt.*"
        )
)
public class JpaConfig {
}
```

여전히 A 로그는 출력됐습니다.
그래서 JpaRepository 를 활성화 시키고, 빈 스캐닝 범위를 지정하기 위해 추가 **EnableJpaRepositories** 어노테이션을 추가했습니다.
주의할 점은 @Entity 가 없는데 Repository 를 사용하면 Spring 이 어떻게 메서드를 구현할 지 찾는다고 했습니다.
따라서 Redis 를 사용하는 곳은 빈 스캐닝 범위에서 제외시켰습니다.
EnableJpaRepositories 까지 적용했더니 모든 로그가 사라진 것을 확인할 수 있었습니다.

```
2023-06-18 20:42:02.762  INFO 5431 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 141 ms. Found 6 JPA repository interfaces.
2023-06-18 20:42:02.763  INFO 5431 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2023-06-18 20:42:02.763  INFO 5431 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data Redis repositories in DEFAULT mode.
2023-06-18 20:42:02.772  INFO 5431 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 3 ms. Found 1 Redis repository interfaces.
```

<br />

## 참고 자료

https://stackoverflow.com/questions/47002094/spring-multiple-spring-data-modules-found-entering-strict-repository-configur

```toc

```
