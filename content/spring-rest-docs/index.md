---
emoji: 💻
title: Spring rest docs 설정
date: '2023-06-01 23:00:00'
author: devkimc
tags: spring
categories: 블로그 spring
---

## 🤔 적용 이유

프론트엔드 개발자는 백엔드 개발자가 작성한 api 문서를 보고 api 를 매핑합니다.
문서를 작성하는 것은 노동력이 들어가는 것이고, 사람이 작성하기 때문에 변경된 사항을 업데이트를 하지 않는 경우도 존재합니다.
spring-rest-docs 는 테스트 코드를 작성해야 하고, 빌드 시 api 문서가 자동으로 생성됩니다.

**테스트 코드를 작성하면서 검증된 api 문서를 자동으로 생성할 수 있다!**

### vs Swagger

Swagger 도 문서화를 위해 많이 사용된다고 했습니다.
보다 UI 가 깔끔해보이는 장점이 있었습니다. spring-rest-docs 와 달리 테스트 코드가 의무가 아니므로 빠른 시간 내의 문서를 작성할 때 용이할 거라 생각이 듭니다.
단점으로는 컨트롤러 코드 주위에 문서를 위한 코드를 작성해야 된다는 점입니다.
가독성이 중요하다고 판단되어 spring-rest-docs 를 사용하기로 결정했습니다.

<br />

## ⚙️ 적용 하기

### 1. build.gradle

```java

plugins {
	id "org.asciidoctor.jvm.convert" version "3.3.2"
}

ext {
	snippetsDir = file('build/generated-snippets') // -- 1 --
}

dependencies {
	testImplementation 'org.springframework.restdocs:spring-restdocs-mockmvc'
}

test {
	outputs.dir snippetsDir
}

asciidoctor {
	dependsOn test
	inputs.dir snippetsDir
}

asciidoctor.doFirst {
	delete file('src/main/resources/static/docs') // -- 2 --
}

task copyDocument(type: Copy) {
	dependsOn asciidoctor
	from file("build/docs/asciidoc")
	into file("src/main/resources/static/docs") // -- 3 --
}

build {
	dependsOn copyDocument
}
```

1. build 시 자동생성될 snippet 의 저장 경로 (ex. request-body)
2. asciidoctor 가 실행되면 우선적으로 저장된 문서를 삭제한다. (초기화)
3. asciidoctor 실행 시 생성되는 index.html 을 정적 경로로 이동

<br />

### 2. MockMvc & restdocs 설정

```java
@SpringBootTest
@ExtendWith(RestDocumentationExtension.class)
public class SpringContainerTest {

    protected MockMvc mockMvc;

    @BeforeEach
    public void setUp(WebApplicationContext webApplicationContext,
                      RestDocumentationContextProvider restDocumentationContextProvider) throws Exception {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(documentationConfiguration(restDocumentationContextProvider))
                .build();
    }
}
```

기존 컨트롤러 테스트에서 추가된 부분은 apply(documentationConfiguration(restDocumentationContextProvider)) 입니다.

**RestDocumentationContextProvider**: RestDocumentationContext 에 대한 액세스 접근을 제공하는 인터페이스
**RestDocumentationContext**: RESTful API의 문서화가 수행되는 컨텍스트 인터페이스

<br />

### 3. 컨트롤러 테스트 작성

```java
public class GroupControllerTest extends SpringContainerTest {

    @Test
    @Transactional
    @DisplayName("그룹 리스트 조회")
    void getGroupList() throws Exception {

        mockMvc.perform(get("/api/groups")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(document("get-groups",
                        PayloadDocumentation.responseFields(
                                PayloadDocumentation.fieldWithPath("success").description("성공 여부"),
                                PayloadDocumentation.fieldWithPath("result.[].groupId").description("그룹 아이디"),
                                PayloadDocumentation.fieldWithPath("result.[].groupName").description("그룹 이름"),
                                PayloadDocumentation.fieldWithPath("result.[].totalUsers").description("그룹 인원수")
                        )));
    }

}

```

상속받은 MockMvc 를 사용하여 작성했습니다.
요청 파라미터 및 데이터가 없기 때문에 응답 필드값과 설명값을 추가했습니다.

<br />

### 4. 문서 스니펫 생성 확인

작성한 테스트를 실행합니다. 테스트가 성공적으로 끝났다면, build 폴더가 생길 것입니다.
요청 필드 값은 입력하지 않았으므로 request-fileds 를 제외한 나머지 스니펫이 생성됐습니다.

```bash
my@notebook build % tree
.
└── generated-snippets
    └── get-groups
        ├── curl-request.adoc
        ├── http-request.adoc
        ├── http-response.adoc
        ├── httpie-request.adoc
        ├── request-body.adoc
        ├── response-body.adoc
        └── response-fields.adoc

3 directories, 7 files
```

<br />

### 5. index.adoc 파일 작성

src/docs/asciidoc/index.adoc 파일을 생성합니다.
문서에 넣고 싶은 스니펫을 작성합니다.
asciidoc 가 adoc 파일을 스타일링 해서 html 파일로 변환시켜줍니다.

```bash
ifndef::snippets[]
:snippets: ./build/generated-snippets
endif::[]

= API Docs
:doctype: book
:icons: font
:source-highlighter: highlightjs
:toc: left
:toclevels: 1
:toc-title: 그룹

== 그룹 리스트 조회
=== REQUEST

include::{snippets}/get-groups/http-request.adoc[]

=== REQEUST FIELD

// include::{snippets}/get-groups/request-fields.adoc[]F

=== RESPONSE

include::{snippets}/get-groups/http-response.adoc[]

=== RESPONSE FIELD

include::{snippets}/get-groups/response-fields.adoc[]
```

<br />

### 6. build 및 문서 확인

문서 저장경로인 src/main/resources/static/docs 에 index.html 이 존재하는지 확인합니다.
http://localhost:8080/docs/index.html 로 이동하면..!
![](https://velog.velcdn.com/images/kws60000/post/5a1135e2-2ced-4690-a02c-fc469d6e2c3a/image.png)

만약 스니펫의 정보가 잘 나오지 않는다면 index.adoc 파일에서 작성한 스니펫 경로가 올바른지 확인해야 합니다.

<br />

## 📄 마치며..

초기 설정만 하면 이후 문서화를 하는 것은 (테스트 코드를 작성한다는 전제) 어렵지 않아 보입니다. **협업하는 개발자에게 검증된 api를 제공한다는 것만으로도 충분히 가치가 있다고 생각합니다.** 기존에 사용하던 노션에 비해서 가독성이 떨어지는 단점은 있었습니다. 다른 사용자들은 swagger ui 를 연동해서 이를 보완한다고 해서 이후에 적용하려 합니다.

<br />

### 참고 사이트

https://velog.io/@bagt/API-%EB%AC%B8%EC%84%9C%ED%99%94%EC%99%80-Spring-Rest-Docs

```toc

```
