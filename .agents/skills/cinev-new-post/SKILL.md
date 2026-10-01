---
name: cinev-new-post
description: CineV 블로그의 새 글 양식이나 Markdown 초안 파일을 만들 때 사용한다. npm으로 기본 양식만 생성하며 본문 작성이나 실제 발행은 수행하지 않는다.
---

# 새 글 기본 양식 만들기

이 저장소의 `npm run post:new`로 frontmatter와 기본 안내문이 들어 있는 Markdown 파일을 만든다. 본문은 사람이 작성한다.

## 범위

- CLI가 생성한 `draft: true` 파일을 그대로 남긴다.
- 본문, 목차, 예시 문단을 추가하거나 생성된 안내문을 수정하지 않는다.
- 요약·태그·이미지 등 선택 항목은 사용자가 제공한 값만 넣는다. 콘텐츠 조사나 이미지 제작은 하지 않는다.
- 개발 서버 실행, 빌드, 검증, `draft: false` 변경, 커밋, push, 배포는 이 스킬의 작업에 포함하지 않는다.

## 실행

1. 이 스킬이 있는 `.agents/skills/`의 상위 저장소 루트에서 실행한다. `package.json`의 `post:new` 명령을 확인한다. CLI는 Node.js 내장 모듈만 사용하므로 `npm ci`나 추가 패키지 설치는 필요하지 않다.
2. 사용자가 지정한 제목과 slug를 사용한다. 제목이 없으면 제목을 요청한다. slug를 지정하지 않았다면 제목에 맞는 짧은 소문자 영문·숫자·하이픈 slug를 정한다. 언어의 기본값은 `ko`, 작성자의 기본값은 `user`(CineV)다. 카테고리를 지정하지 않으면 생략한다.
3. 옵션이나 언어별 카테고리를 확인할 때 아래 명령을 사용한다.

   ```sh
   npm run post:new -- --help
   npm run post:new -- --list-categories --lang ko
   ```

4. 저장소 루트에서 새 파일을 만든다. 아래 값은 예시이며 실제 요청의 제목·slug·언어·카테고리를 전달한다.

   ```sh
   npm run post:new -- new-tutorial --title "새로운 CineV 튜토리얼" --lang ko --category tutorials-ko
   ```

   사용자가 제공한 선택 항목은 CLI의 `--author`, `--tags`, `--excerpt`, `--image`, `--image-alt`로 전달한다. 주소 충돌이나 입력 오류가 나면 기존 파일을 덮어쓰거나 CLI를 우회하지 말고 오류와 필요한 입력을 알린다.
5. 명령이 출력한 파일을 읽어 `draft: true`와 기본 양식이 생성됐는지만 확인한다. 생성 위치는 `content/posts/<lang>/<slug>.md`다. 본문을 편집하지 않고 여기서 종료한다.

## 완료 응답

생성 파일, 공개 예정 경로, 초안 상태를 짧게 알린다. 기본 양식 생성이 완료됐으며 본문은 사용자가 작성하면 된다고 안내한다. 실제 발행이나 배포가 완료됐다고 표현하지 않는다.
