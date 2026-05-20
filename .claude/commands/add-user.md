새 테스트 계정을 생성하고 user_file.md에 기록하는 작업을 수행해줘.

## 규칙

- 비밀번호는 항상 `12341234` 고정
- 닉네임, 아이디, 성별, 생년월일은 있을법한 한국인 정보로 자연스럽게 만들어
- userId는 7~20자, 닉네임은 2~8자
- 이미 user_file.md에 있는 계정과 중복되지 않게 해
- 로그인 후 쿠키는 `/tmp/pickone_cookie.txt`에 저장

## 실행 순서

### 1. 회원가입

```bash
curl -s -X POST "https://xn--6i0bz4gpon48c.com/api/user" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<생성한 아이디>",
    "nickname": "<생성한 닉네임>",
    "password": "12341234",
    "gender": <1=남 or 2=여>,
    "birth": "<YYYY-MM-DD>",
    "profileImg": null
  }'
```

### 2. 로그인 (쿠키 저장)

```bash
curl -s -c /tmp/pickone_cookie.txt -X POST "https://xn--6i0bz4gpon48c.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"userId": "<아이디>", "pw": "12341234"}'
```

### 3. user_file.md에 테이블 행 추가

user_file.md가 없으면 새로 만들고, 있으면 기존 테이블에 행 추가.

| 닉네임 | 아이디 | 비밀번호 | 성별 | 생년월일 |
|--------|--------|----------|------|----------|
| (닉네임) | (아이디) | 12341234 | 남/여 | YYYY-MM-DD |

### 4. 완료 보고

회원가입된 계정 정보와 로그인 성공 여부를 알려줘.
