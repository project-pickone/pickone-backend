아래 형식으로 이미지 생성 요청을 파악해서 Python 스크립트를 실행해줘.

## 사용법

사용자가 이미지 생성을 요청하면:
1. 프롬프트(영문으로 변환), 출력 경로, 사이즈를 파악해
2. 아래 명령어를 실행해

```bash
python scripts/generate_image.py "프롬프트(영문)" [출력경로] [--size 512|1K|2K]
```

## 규칙

- 프롬프트는 **한국어**로 작성해 (이미지 내 텍스트가 한국어로 생성됨)
- 출력 경로를 명시하지 않으면 `./public/generated-image.png` 사용
- 사이즈를 명시하지 않으면 기본값(`1K`) 사용
- GEMINI_API_KEY 환경변수가 필요하다고 안내해줘 (없으면 스크립트가 에러 출력함)

## 예시

사용자: "산 위에 노을 이미지 생성해줘"
실행: `python3 scripts/generate_image.py "산 위에 아름다운 노을, 따뜻한 색감의 일러스트" ./public/generated-image.png`

사용자: "로고 이미지 고해상도로 만들어줘 ./public/logo.png에"
실행: `python3 scripts/generate_image.py "심플하고 모던한 로고 디자인" ./public/logo.png --size 2K`
