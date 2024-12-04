# devCourse-nodePractice-youtube
## 데브코스 유튜브 실습
### 실행 방법
1. npm install 
2. .env 파일 생성 후 PRIVATE_KEY 설정
3. docker를 이용하여 MySql(MariaDB) 실행(3306 포트)
4. app.js 실행(node ./app.js)

### 화면 설계
- 회원
  - 로그인

    ![login](https://github.com/user-attachments/assets/60d6f6c1-7725-4593-a0e7-cfc132a32413)

  - 회원 가입

    ![register](https://github.com/user-attachments/assets/02a938ba-8e8d-403e-8d33-ad2bfa6fcd25)

  - 내 정보 조회 & 회원 탈퇴
  
    ![myPage](https://github.com/user-attachments/assets/2475d6e4-092d-49a9-9aef-24b07a157d94)

- 채녈
  - 채널 관리

    ![manageChannel](https://github.com/user-attachments/assets/df727e1c-0c27-449f-9322-91cb3cb6d016)


  - 채널 생성

    ![createChannel](https://github.com/user-attachments/assets/432b3ed7-1c86-4173-860e-a6dc0ba468f0)


  - 채널 수정
    
    ![editChannel](https://github.com/user-attachments/assets/63f2a25d-2f08-4d17-94e1-9191dba4f821)


### API 설계
- 회원
  - 로그인
    - /login
    - post 메소드 이용
    - req : id, pwd
    - res : 메세지
  - 로그아웃
    - /logout
    - /post 메소드 이용
    - req : X
    - res : 메세지
  - 회원가입
    - /register
    - post 메소드 이용
    - req : id, pwd, name
    - res : 메세지
  - 내 정보 조회
    - /user/:id
    - get 메소드 이용
    - req : id
    - res : id, name
  - 회원 탈퇴
    - /user/:id
    - delete 메소드 이용
    - req : id
    - res : 메세지

- 채널
  - 채널 조회
    - /channel
    - get 메소드 이용
    - req : id
    - res : 메세지
  - 채널 생성
    - /channel/create
    - post 메소드 이용
    - req : id, title
    - res : 메세지
  - 채널 수정
    - /channel/edit/:title
    - put 메소드 이용
    - req : id, title
    - res : 메세지
  - 채널 삭제
    - /channel/delete/:title
    - delete 메소드 이용
    - req : id, title
    - res : 메세지

### 데이터베이스 설계

![diagram](https://github.com/user-attachments/assets/d525ab0e-4c04-49c2-be79-5fc0200099d7)

### 데이터베이스 생성
- users 테이블

  ![tableUsers](https://github.com/user-attachments/assets/b85c63ea-6354-44e5-8e3f-fe55da510566)

- channels 테이블

  ![tableChannels](https://github.com/user-attachments/assets/467c3102-bc3d-46a9-9d11-a9d63ebd4138)

### 문제 및 해결방안
- user에서 로그인 한 정보를 channel로 넘겨주는 방법
  - express-session 패키지를 이용하여 유저 정보를 세션에 저장