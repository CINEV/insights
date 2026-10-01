# CineV Insights

CineV의 게시글과 기능 소개 페이지를 제공하는 독립 Astro 블로그입니다. Markdown 콘텐츠와 이미지·테마 자산을 빌드해 정적 사이트로 배포합니다. WordPress에서 가져온 콘텐츠와 디자인을 보존하며, 이후 글은 이 저장소에서 관리합니다.

메인 Next.js 앱은 `/insights` 요청을 블로그로 프록시합니다. 블로그는 프론트 앱과 별도로 빌드·배포하므로, **글이나 이미지를 변경하면 이 블로그만 다시 빌드·배포하면 됩니다.** 운영 시 WordPress PHP 서버나 데이터베이스가 필요하지 않습니다.

## 저장소 구조

| 경로 | 역할 |
| --- | --- |
| `content/posts/` | 게시글 Markdown |
| `content/pages/` | 기능 소개 등 콘텐츠 페이지 Markdown |
| `src/content.config.ts` | 콘텐츠 수집과 frontmatter 스키마 |
| `src/pages/` | 게시글·목록 라우트, RSS, 사이트맵, 검색 인덱스 생성 |
| `src/lib/` | 라우트 구성, 원본 템플릿 렌더링, SEO·피드 처리 |
| `public/` | 이미지·영상·폰트·CSS와 브라우저 동작 스크립트 |
| `migration/` | 원본 템플릿, 콘텐츠·분류 카탈로그, 공개 API 백업 |
| `scripts/` | WordPress 가져오기와 빌드 결과 검증 |

게시글과 언어별·카테고리별·태그별·작성자별 목록을 빌드 시 생성합니다. 검색은 정적 검색 인덱스를 사용합니다. 메뉴·FAQ·슬라이더·고정 헤더·무한스크롤은 `public/site.js`, 보완 스타일은 `public/site.css`에서 관리합니다.

## 개발과 빌드

Node.js 22.12 이상이 필요합니다. 모든 명령은 저장소 루트에서 실행합니다.

```sh
npm ci
npm run dev
```

개발 서버의 기본 주소는 [http://localhost:4321/insights/](http://localhost:4321/insights/)입니다. 콘텐츠를 수정하면 개발 서버에서 바로 확인할 수 있습니다.

배포할 정적 파일을 생성하고 확인합니다.

```sh
npm run build
npm run preview
```

빌드 결과는 `dist/`에 생성됩니다. 미리보기는 빌드된 결과를 제공하므로 콘텐츠를 수정한 뒤에는 다시 빌드해야 합니다. 로컬에서도 `/insights/` 경로로 접근합니다.

## 콘텐츠 관리

### 글 작성과 초안 미리보기

새 글은 명령으로 만듭니다. 제목, 날짜, 언어, URL, 작성자, 분류가 채워진 Markdown 초안을 생성합니다.

Codex에서는 `$cinev-new-post` [스킬](.agents/skills/cinev-new-post/SKILL.md)로 기본 양식만 만들 수 있습니다. 스킬은 초안 파일 생성까지만 수행하며 본문은 직접 작성합니다.

```sh
npm run post:new -- new-tutorial --title "새로운 CineV 튜토리얼" --lang ko --category tutorials-ko
npm run dev
```

생성 파일은 `content/posts/ko/new-tutorial.md`입니다. 브라우저에서 [http://localhost:4321/insights/ko/new-tutorial/](http://localhost:4321/insights/ko/new-tutorial/)을 열고 본문을 작성합니다. 개발 서버는 초안도 보여주며 화면에 **Draft · 초안** 표시를 붙입니다. `npm run build`와 운영 배포는 초안을 제외하므로, `npm run preview`에서는 초안이 보이지 않습니다. 초안은 RSS·검색·사이트맵에도 포함되지 않습니다.

`npm run post:new -- --help`에서 옵션과 카테고리를 확인합니다. 같은 URL이나 파일이 이미 있으면 덮어쓰지 않습니다. 영어는 `--lang en`, 일본어는 `--lang ja`로 만들며 각 언어의 카테고리를 선택합니다. 기본 작성자는 CineV(`user`)이며 `--author jay`로 Jay를 선택할 수 있습니다.

생성한 파일의 본문은 일반 Markdown입니다. 대표 이미지를 쓰려면 `public/images/`에 파일을 추가하고 `image`, `imageAlt`를 작성합니다. 본문 제목은 `##`부터 쓰며, 페이지 제목은 `title`에서 자동으로 표시합니다.

```md
---
title: "새로운 CineV 튜토리얼"
date: "2026-10-01T09:00:00+09:00"
lang: "ko"
path: "/insights/ko/new-tutorial/"
categories: ["tutorials-ko"]
tags: []
excerpt: "튜토리얼의 짧은 설명입니다."
image: "/insights/images/tutorial-cover.webp"
imageAlt: "튜토리얼 화면"
draft: true
---

## 시작하기

Markdown으로 본문을 작성합니다.

![튜토리얼 화면](/insights/images/tutorial-cover.webp)
```

예시 이미지는 `public/images/tutorial-cover.webp`에 저장합니다. `public/` 아래 파일은 빌드 결과에 복사되며, 본문과 대표 이미지에는 `/insights/`를 포함한 공개 경로를 사용합니다. 대표 이미지가 없으면 `image`와 `imageAlt`를 생략합니다.

| 항목 | 규칙 |
| --- | --- |
| `title`, `date` | 필수. 날짜는 시간대가 포함된 ISO 형식 권장 |
| `lang`, `path` | 영어 `/insights/slug/`, 한국어 `/insights/ko/slug/`, 일본어 `/insights/ja/slug/` |
| `excerpt` | 글 목록·검색·RSS에 쓰는 요약문 |
| `categories`, `tags` | 기존 분류의 ID 또는 slug. 기존 분류는 `migration/catalog.json` 참조 |
| `draft` | `true`인 콘텐츠는 로컬 개발 서버에서만 미리보기 가능하며 배포·검색·RSS·사이트맵에서 제외 |
| `modified` | 수정 시각을 따로 기록할 때 지정 |

`lang`의 스키마 기본값은 `en`이며, 글 생성 명령의 기본값은 `ko`입니다. `path`를 생략하면 언어와 콘텐츠 파일 ID를 기준으로 주소를 생성합니다. 날짜는 한국 시간으로 표시하며, 시간대 없는 날짜도 한국 시간으로 해석합니다.

### 발행 전 확인

본문, 요약(`excerpt`), 대표 이미지와 대체 텍스트를 확인한 뒤 `draft: false`로 바꿉니다.

```sh
npm run check
npm run preview
```

`check`는 Python 3.9 이상을 사용해 운영 빌드와 글·이미지·링크·RSS·사이트맵 검증을 실행합니다. URL 중복·예약 경로·언어에 맞지 않는 분류·없는 작성자는 빌드를 실패시킵니다. 요약이 비어 있으면 본문에서 목록·검색·RSS 요약을 생성합니다. 새 글은 기존 글의 본문 템플릿을 상속하지 않고 제목·분류·작성자·대표 이미지로 전용 Markdown 화면을 구성합니다.

기본 분류는 `--help`에 표시되는 카테고리 ID 또는 slug를 사용합니다. 새 태그는 frontmatter의 `tags`에 추가하면 목록이 생성됩니다. 새 작성자나 카테고리를 운영에 추가하려면 `migration/catalog.json`의 해당 항목과 메뉴 구성을 함께 관리합니다.

직접 `main`에 push하면 자동 배포됩니다. 리뷰를 거칠 때는 작업 브랜치에서 PR을 만들면 같은 빌드·검증이 실행되며, `main`에 반영된 뒤 배포됩니다. **PR 검증은 배포하지 않습니다.** CI는 `npm run test:publishing`으로 임시 글을 생성해 3개 언어의 새 글 반영과 초안 제외도 검증합니다. 임시 글은 운영 콘텐츠에 추가되지 않습니다.

### 기존 콘텐츠 수정

기능 소개 페이지는 `content/pages/`에서 관리합니다. 기존 WordPress 콘텐츠는 레이아웃을 유지하기 위해 Markdown 안에 HTML을 포함합니다. 기존 글의 `wordpressId`, `snapshotFile`과 HTML 클래스·구조는 원본 템플릿과 디자인을 연결하므로 유지합니다. `migration/`은 빌드에 필요한 자료이며 삭제하지 않습니다.

원본 디자인과 콘텐츠를 보존하지만 WordPress 플러그인 자체를 실행하지는 않습니다. 정상 로드되는 원본 글꼴에 따라 기존 프록시 화면과 일부 줄바꿈이 달라질 수 있으며, 작성자 페이지는 실제 작성자별 글을 표시합니다.

## 발행과 배포

GitHub Pages로 배포합니다. `main`에 push하면 `.github/workflows/deploy.yml`이 Node.js 24에서 `npm ci`, `npm run build`, 빌드 검증을 실행하고 `dist/`를 배포합니다. GitHub Actions 화면에서 수동 실행도 가능합니다.

배포 주소는 [https://cinev.github.io/](https://cinev.github.io/)입니다. 배포 상태와 실패 로그는 저장소의 **Actions → Deploy to GitHub Pages**에서 확인합니다. 빌드나 검증이 실패하면 새 버전은 배포되지 않습니다.

초안은 `draft: true`로 관리하고 발행할 때 `false`로 변경합니다. 글 수정·삭제, 이미지·스타일·스크립트 변경도 `main`에 push한 뒤 배포가 완료되면 반영됩니다. 메인 프론트 앱의 재빌드는 필요하지 않습니다. 이전 버전으로 되돌리려면 해당 변경을 revert하고 `main`에 push합니다.

### 요청 경로

GitHub Pages에서는 루트와 `/insights/` 경로 모두 같은 블로그를 제공합니다. `npm run build`의 postbuild 단계가 `scripts/prepare-pages.mjs`를 실행해 `/insights/` 파일을 추가하므로 서버 rewrite 설정이 필요하지 않습니다.

- `https://cinev.github.io/`: 블로그 홈
- `https://cinev.github.io/insights/`: 기존 경로 형식으로 블로그 접근
- `/insights/feed.xml`: RSS
- `/insights/sitemap_index.xml`, `/insights/sitemap.xml`: 사이트맵
- `/insights/search-index.json`: 검색 인덱스

기존 `/feed/`, `/insights/feed/` 경로에도 RSS XML을 제공합니다. 새 RSS 구독에는 `feed.xml`을 사용합니다. 두 경로를 제공하기 위해 배포 결과에는 자산 사본이 포함되므로 `dist/` 용량은 원본 자산보다 커집니다.

기존 운영 공개 주소와 SEO canonical은 `https://cinev.com/insights/`로 유지합니다. 기존 프론트는 `/insights`를 제거해 `blog.cinev.com`으로 프록시하며, 이 저장소의 Pages 배포만으로 운영 프록시 대상이나 DNS가 변경되지는 않습니다.

```text
cinev.com/insights/글주소/
  → Next.js 프록시
  → blog.cinev.com/글주소/
```

운영 전환 시 Pages에서 글·이미지·언어별 경로·RSS를 확인한 뒤 별도로 `blog.cinev.com`의 Pages 사용자 지정 도메인과 DNS를 설정합니다. 이 도메인을 유지하면 기존 프론트 rewrite를 유지할 수 있습니다. 도메인을 전환하기 전까지 기존 운영 사이트는 WordPress를 계속 제공합니다.

## 유지보수

### 빌드 결과 검증

Python 3.9 이상에서 추가 패키지 없이 실행합니다.

```sh
python3 scripts/verify-build.py
```

기존 경로, 로컬 링크·자산, WordPress 서버 의존성, RSS·사이트맵 설정을 검사합니다. 미리보기 서버가 실행 중이면 실제 HTTP 응답도 검사할 수 있습니다.

```sh
python3 scripts/verify-build.py --base-url http://localhost:4321
```

### WordPress 콘텐츠 다시 가져오기

원본 사이트의 공개 콘텐츠를 다시 수집할 때만 사용합니다. 일반적인 글 발행에는 필요하지 않습니다.

```sh
python3 scripts/import-wordpress.py
```

기존 Markdown은 기본적으로 보존하지만 `migration/`의 카탈로그·템플릿·API 백업과 가져온 자산은 갱신합니다. 기존 Markdown까지 원본으로 덮어쓰려면 별도 백업 후 `--overwrite-content`를 사용합니다. 가져온 뒤에는 변경사항과 `migration/catalog.json`의 `failures`, `skipped`를 확인하고 다시 빌드합니다.

다운로드 캐시는 `.migration-cache/`에 저장합니다. `--use-cache`는 스냅샷과 자산을 재사용하며, API·사이트맵 요청은 계속 수행합니다. 캐시와 달리 `migration/`은 저장소에 유지해야 합니다. WordPress 관리자·비공개 콘텐츠·계정 설정은 이 저장소의 운영 범위에 포함되지 않습니다.
