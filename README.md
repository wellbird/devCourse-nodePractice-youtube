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