---
emoji: 💻
title: aws ec2에 github action 으로 프론트 자동 배포하기
date: '2023-01-01 23:00:00'
author: vvs-kim
tags: ci/cd
categories: 블로그 ci/cd
---

## github action ?

jenkins 와 더불어 CI/CD 구축을 위해 사용됩니다.
github 에서 가상환경을 제공해줍니다.

### 장점

CI 를 위한 추가 서버가 필요 없다는 게 큰 장점이었습니다.
git hook 에 따라 배포를 실행할 수 있습니다.

### 단점

유료 계정이 아니라서 그런지 몰라도 빌드 시간이 오래걸렸습니다.
jenkins 로 배포할 때 총 20초 정도 걸렸었는데, 2분 정도 소요됐습니다. (s3 업로드 까지)

<br />

## 시작하기

과정을 간단하게 요약한 글입니다
보다 상세한 내용은 해당 글을 보시는걸 추천드립니다.
https://blog.bespinglobal.com/post/github-action-%EC%9C%BC%EB%A1%9C-ec2-%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0/

<br />

### 1. IAM 사용자 추가

github 코드를 s3 로 업로드하기 위해 인증된 사용자라는 검증하기 위해 사용됩니다.

>

1. AWS - IAM > AWS 자격 증명 유형 선택 > 액세스 키 – 프로그래밍 방식 액세스
2. GIHUB - 생성한 액세스 키 ID 와 비밀 액세스키를 자신의 레포지토리에 등록

<br />

### 2. S3 버킷 생성

github 로부터 수신된 빌드파일(압축형태)을 저장합니다.
향후에 스냅샷으로 버전관리를 위해 사용할 수도 있습니다.

> ec2 용 버킷 생성

<br />

### 3. IAM 역할 생성

aws 에서 자동배포를 하기 위해 codedeploy 라는 서비스를 사용합니다.
이때, codedeploy 가 ec2 에 접근해도 되는 역할(서비스)이 맞는지 검증기 위해 사용합니다.

> AWS - IAM > 역할 > 신뢰관계 > 신뢰 정책 편집 > 아래의 코드 복사 붙여넣기

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": [
                    "ec2.amazonaws.com",
                    "codedeploy.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole"
        }
    ]
}

```

<br />

### 4. Codedeploy 배포 그룹 및 애플리케이션 생성

aws 에서 지원하는 자동배포 서비스입니다.
배포 진행상황을 모니터링할 수 있습니다. 문제가 생길시 재시도 하고 이력을 확인할 수 있습니다.

> AWS - Codedeploy > 애플리케이션 생성

배포 그룹 및 애플리케이션을 생성합니다.
주의할 점은 배포 그룹 생성 시 전 단계에서 진행한 IAM 역할을 입력하는 것입니다.

<br />

### 5. CodeDeploy agent 설치하기

CodeDeploy 서비스를 사용하기 위해서 ec2 인스턴스 내에 agent 를 설치해야 합니다.
CodeDeploy agent 를 사용하여, 이전 버전에 대한 스냅샷을 ec2 에 자동 저장함으로서(최대 5개) 배포에 문제가 생길 시 백업할 수 있습니다.

ec2 ubuntu 20 버전에 대해서는 자료가 많이 있습니다.
저는 ubuntu 22 버전을 사용하며 ruby 버전으로 인한 오류가 발생했습니다.
인스턴스가 ubuntu 22 버전이라면 다음과 같이 설치하시면 됩니다.

참고 - https://github.com/aws/aws-codedeploy-agent/issues/301#issuecomment-1129912011

```bash
sudo apt-get update
sudo apt-get install ruby-full ruby-webrick wget -y
cd /tmp
wget https://aws-codedeploy-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/releases/codedeploy-agent_1.3.2-1902_all.deb
mkdir codedeploy-agent_1.3.2-1902_ubuntu22
dpkg-deb -R codedeploy-agent_1.3.2-1902_all.deb codedeploy-agent_1.3.2-1902_ubuntu22
sed 's/Depends:.*/Depends:ruby3.0/' -i ./codedeploy-agent_1.3.2-1902_ubuntu22/DEBIAN/control
dpkg-deb -b codedeploy-agent_1.3.2-1902_ubuntu22/
sudo dpkg -i codedeploy-agent_1.3.2-1902_ubuntu22.deb
systemctl list-units --type=service | grep codedeploy
sudo service codedeploy-agent status
```

<br />

### 6. github action 스크립트 추가

github action 을 사용하기 위해 세 개의 스크립트가 필요합니다.

1. githuc action 스크립트: CI 를 위한 스크립트입니다. s3 로 업로드 되기까지의 모든 과정입니다.
2. appspec.yml: 빌드 파일을 어느 디렉토리로 전송할지, 배포 과정에서 실행하고 싶은 스크립트를 지정하는 스크립트입니다.
3. after_install.yml: ec2 인스턴스가 s3 로 부터 빌드 파일을 전송 받은 후 실행하는 스크립트입니다.

> GITHUB - repository -> new workflow -> actions -> set up a workflow yourself

githuc action workflow 예시입니다. 각 환경에 맞게 변경하시면 됩니다.

```bash
name: CI

on:
  push:
    branches: [ main ]


jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: checkout release
      uses: actions/checkout@v3

    - name: Package install
      run: yarn

    - name: Build
      run: yarn build

    - name: zip distributions
      run: zip -r with-eat-build.zip  ./

    - name: AWS configure credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2

    - name: upload to S3
      run: aws s3 cp --region ap-northeast-2 ./with-eat-build.zip s3://with-eat-bucket/public/

    - name: deploy with AWS codeDeploy
      run: aws deploy create-deployment
        --application-name with-eat-deploy
        --deployment-config-name CodeDeployDefault.OneAtATime
        --deployment-group-name with-eat-deploy-group
        --s3-location bucket=with-eat-bucket,key=public/with-eat-build.zip,bundleType=zip
```

appspec.yml 예시

```bash
version: 0.0
os: linux

files:
  - source: /
    destination: /var/www/html
    overwrite: yes

permissions:
  - object: /var/www/html
    owner: root
    group: root
    mode: 755

hooks:
  AfterInstall:
    - location: scripts/after_install.sh
      timeout: 60
      runas: root
```

after_install.sh 예시

```
echo "Project directory"
cd /var/www/html;

echo "Project restart"
pm2 kill && pm2 start yarn --name yourappname -- start -p 3000 || echo 'Failed pm2 kill';
```

<br />

## 에러 발생시

EC2 + S3 + Codedeploy + githubaction 이렇게 많은 서비스를 이용하다보니 버전, 권한, 전송 등 에러가 발생할겁니다.

제가 주로 해결한 방법은

1. github action 의 error log
2. ec2 인스턴스 var/log/aws/codedeploy-agent/codedeploy-agent.log

두 로그를 확인하는 것입니다.

### 에러 케이스

<br />

> Error: does not give you permission to perform operations in the following AWS service: AmazonEC2

- IAM 의 EC2 접근 권한 문제로 인해 S3 -> EC2 업로드가 안됨
  해결 방법: 다른 EC2 권한을 준다. 안되면, AmazonEC2FullAccess 정책 추가

> Error: CodeDeploy agent did not find an AppSpec file within the unpacked revision directory at revision-relative path "appspec.yml"

- 빌드파일 내에 appspec.yml 파일을 찾지 못해서 오류가 발생함

```toc

```
