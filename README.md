# devCourse-nodePractice-youtube
## 데브코스 유튜브 실습
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
    - req : X
    - res : 메세지
  - 채널 생성
    - /channel/create
    - post 메소드 이용
    - req : title
    - res : 메세지
  - 채널 수정
    - /channel/edit/:title
    - put 메소드 이용
    - req : title
    - res : 메세지
  - 채널 삭제
    - /channel/delete/:title
    - delete 메소드 이용
    - req : title
    - res : 메세지