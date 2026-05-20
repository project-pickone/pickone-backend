게시글을 생성하는 작업을 수행해줘. 이미지 생성 → 업로드 → 게시글 생성 순서로 진행해.

## 규칙

- 게시글 주제, 카테고리는 사용자가 지정하거나, 미지정 시 기존 게시글과 카테고리 중복 없이 알잘딱으로 정해
- 제목/내용/선택지를 먼저 정한 후, 그 내용에 맞는 이미지 프롬프트를 작성해
- **이미지 프롬프트는 반드시 한국어로 작성** (이미지 내 텍스트가 한국어로 생성되도록)
- 로그인 쿠키는 `/tmp/pickone_cookie.txt` 사용. 없으면 `/add-user` 스킬로 먼저 계정 생성
- 카테고리 목록: 주식(1), 연애(2), 일상(3), 스포츠(4), 핫이슈(5), 정치(6), 롤(7), 오버워치(8)

## 실행 순서

### 1. 이미지 생성

```bash
GEMINI_API_KEY=$(grep '^GEMINI_API_KEY' .env | cut -d '=' -f2-) python3 scripts/generate_image.py \
  "<한국어 프롬프트>" \
  ./public/<파일명>.png
```

### 2. 이미지 업로드

```bash
TOKEN=$(grep accessToken /tmp/pickone_cookie.txt | awk '{print $NF}')
THUMB_URL=$(curl -s -X POST "https://xn--6i0bz4gpon48c.com/api/file/upload" \
  -H "Cookie: accessToken=$TOKEN" \
  -F "file=@./public/<파일명>.png;type=image/png" | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])")
```

### 3. 게시글 생성

```bash
curl -s -X POST "https://xn--6i0bz4gpon48c.com/api/board" \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=$TOKEN" \
  -d '{
    "title": "<제목>",
    "contents": "<내용>",
    "firstOption": "<선택지1>",
    "secondOption": "<선택지2>",
    "category": [<카테고리 idx>],
    "thumbnail": "<$THUMB_URL>"
  }'
```

### 4. 완료 보고

생성된 게시글 idx, 제목, 썸네일 이미지를 보여줘.
