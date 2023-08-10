---
emoji: 💻
title: Unknown system variable 'transaction_isolation'
date: '2023-07-31 23:00:00'
author: vvs-kim
tags: database mariadb
categories: 블로그 Database
---

# 에러 상황

Mac OS 환경에서 Mariadb 를 homebrew로 설치했습니다. 이후 spring 에서 작업 시 MySQL 커넥터를 사용해서 DB를 연동했습니다. 잘 사용하다가 파이썬을 설치한 이후로 해당 에러가 발생하고 JDBC DB 연동이 안됐습니다.

```sql
MariaDB [(none)]> select @@version, @@version_comment;
+----------------+-------------------+
| @@version      | @@version_comment |
+----------------+-------------------+
| 11.0.2-MariaDB | Homebrew          |
+----------------+-------------------+
```

```java
java.sql.SQLException: Unknown system variable 'transaction_isolation'
```

<br />

# 에러 원인

## transaction_isolation

트랜잭션의 격리수준을 설정하는 변수입니다. 격리수준에 따라 다음처럼 나뉩니다. InnoDB의 기본 격리수준은 REPEATABLE READ 입니다.

- READ UNCOMMITTED
- READ COMMITTED
- REPEATEABLE READ
- SERIALIZABLE

<br />
MariaDB 공식 문서를 보니 11.1.1 이전 버전에는 tx_isolation 을 사용하고 이후 버전에서는 transaction_isolation 변수를 사용한다고 했습니다.

> To determine the global and session transaction isolation levels at runtime, check the value of the tx_isolation system variable (note that the variable has been renamed transaction_isolation from MariaDB 11.1.1, to match the option, and the old name deprecated).

저는 11.0.2 버전을 설치했으므로 tx_isolation 변수가 사용된 것 같습니다.

```sql
MariaDB [(none)]> show variables like 't%_isolation';
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| tx_isolation  | REPEATABLE-READ |
+---------------+-----------------+
```

MySQL 5.7.20 이후 버전을 사용하면 tx_isolation 대신 transaction_isolation가 존재해야 한다고 합니다. 저는 MySQL 8.0.29 버전을 사용하려 했기 때문에 'transaction_isolation' 가 필요하다고 에러가 발생한 것이었습니다.

```
implementation 'mysql:mysql-connector-java:8.0.29'
```

<br />

# 해결 과정

## 1. my.cnf 수정 ❌

```
#
# This group is read both by the client and the server
# use it for options that affect everything
#
[client-server]

[mysqld]
transaction-isolation = READ-COMMITED

#
# include *.cnf from the config directory
#
!includedir /opt/homebrew/etc/my.cnf.d
```

윈도우를 사용시 my.ini 파일을 수정해서 해결했다는 글을 보고 /opt/homebrew/etc/my.cnf 파일을 수정했지만, 수정 후 데몬 실행이 안됐습니다.

## 2. MySQL 대신 MariaDB 와 연동하기 ✅

MariaDB 로 연동하면 같은 변수를 사용하기 때문에 문제가 없습니다. 에러없이 연동할 수 있습니다.

```java
//	implementation 'mysql:mysql-connector-java:8.0.29'
	runtimeOnly 'org.mariadb.jdbc:mariadb-java-client'
```

## 3. MariaDB 업그레이드 ❌

11.1.1 이후의 MariaDB의 버전으로 업그레이드하면 transaction_isolation를 사용하기 때문에 되지 않을까? 했지만 homebrew로 설치가능한 11.1.1 이후 버전이 없었기 때문에 현재는 적용 불가능한 방법이었습니다.

```
% brew search mariadb
==> Formulae
mariadb ✔                  mariadb@10.2               mariadb@10.7
mariadb-connector-c        mariadb@10.3               mariadb@10.8
mariadb-connector-odbc     mariadb@10.4               mariadb@10.9
mariadb@10.10              mariadb@10.5               qt-mariadb
mariadb@10.11              mariadb@10.6
```

<br />

# 참고자료

[MariaDB - SET TRANSACTION](https://mariadb.com/kb/en/set-transaction/)
[mysql 8.0 내에서 tx_isolation만 있는 경우](https://trustyou.tistory.com/338)

```toc

```
