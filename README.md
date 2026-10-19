# CineV Insights

CineV의 게시글과 기능 소개 페이지를 제공하는 독립 Astro 블로그입니다. Markdown 콘텐츠와 이미지·테마 자산을 빌드해 정적 사이트로 배포합니다. WordPress에서 가져온 콘텐츠와 디자인을 보존하며, 이후 글은 이 저장소에서 관리합니다.

메인 Next.js 앱은 `/insights` 요청을 블로그로 프록시합니다. 블로그는 프론트 앱과 별도로 빌드·배포하므로, **글이나 이미지를 변경하면 이 블로그만 다시 빌드·배포하면 됩니다.** 운영 시 WordPress PHP 서버나 데이터베이스가 필요하지 않습니다.

## 저장소 구조

| 경로 | 역할 |
| --- | --- |
| `content/posts/` | 게시글 Markdown |
| `content/pages/` | 기능 소개 등 콘텐츠 페이지 Markdown |
| `src/config/site.json` | 사이트·조직·SEO·Search Console 공통 설정 |
| `src/content.config.ts` | 콘텐츠 수집과 frontmatter 스키마 |
| `src/pages/` | 게시글·목록 라우트, RSS, 사이트맵, 검색 인덱스 생성 |
| `src/lib/` | 라우트 구성, 사이트 템플릿 렌더링, SEO·피드 처리 |
| `public/` | 이미지·영상·폰트·CSS와 브라우저 동작 스크립트 |
| `src/templates/` | 본문을 분리한 HTML 레이아웃 |
| `src/config/` | 분류·번역 설정과 자산 무결성 목록 |
| `tests/fixtures/` | RSS 구독 식별자와 메타데이터 검증 기준 |
| `scripts/` | 새 글 생성과 빌드 결과 검증 |

게시글과 언어별·카테고리별·태그별 목록을 빌드 시 생성합니다. 작성자 이름은 글에 표시하며, 작성자 목록 URL은 홈으로 이동합니다. 검색은 정적 검색 인덱스를 사용합니다. 메뉴·FAQ·슬라이더·고정 헤더·무한스크롤은 `public/site.js`, 보완 스타일은 `public/site.css`에서 관리합니다.

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

빌드 결과는 `dist/`에 생성되며, 실제 Pages 배포 폴더는 `dist/insights/`입니다. `npm run preview`는 `dist/`를 루트로 제공하므로 `/insights/`로 접근하면 배포와 같은 URL로 확인할 수 있습니다. 미리보기는 빌드된 결과를 제공하므로 콘텐츠를 수정한 뒤에는 다시 빌드해야 합니다.

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

예시 이미지는 `public/images/tutorial-cover.webp`에 저장합니다. `public/images/`에 추가한 파일은 빌드 결과에 포함됩니다. 기존 디자인에 필요한 자산은 `public/assets/`에서 관리하며, 본문과 대표 이미지에는 `/insights/`를 포함한 공개 경로를 사용합니다. 대표 이미지가 없으면 `image`와 `imageAlt`를 생략합니다.

| 항목 | 규칙 |
| --- | --- |
| `title`, `date` | 필수. 날짜는 시간대가 포함된 ISO 형식 권장 |
| `lang`, `path` | 영어 `/insights/slug/`, 한국어 `/insights/ko/slug/`, 일본어 `/insights/ja/slug/` |
| `excerpt` | 글 목록·검색·RSS에 쓰는 요약문 |
| `categories`, `tags` | 기존 분류의 ID 또는 slug. 기존 분류는 `src/config/catalog.json` 참조 |
| `draft` | `true`인 콘텐츠는 로컬 개발 서버에서만 미리보기 가능하며 배포·검색·RSS·사이트맵에서 제외 |
| `seoTitle`, `description`, `socialImage` | 검색·공유 표시를 따로 지정할 때만 사용. 기본값은 제목·요약·대표 이미지 |
| `noindex` | 공개 상태로 검색 색인·사이트맵·llms.txt에서 제외. 비공개 기능이 아님 |
| `modified` | 수정 시각을 따로 기록할 때 지정 |
| `translationKey` | 실제 번역본끼리 같은 값 지정. 언어별 1개만 허용하며 공개 번역 링크·hreflang 생성 |
| `rssGuid` | 생성 명령이 자동 부여하는 구독 식별자. 발행 후 URL·제목을 바꿔도 유지 |

`lang`의 스키마 기본값은 `en`이며, 글 생성 명령의 기본값은 `ko`입니다. `path`를 생략하면 언어와 콘텐츠 파일 ID를 기준으로 주소를 생성합니다. 날짜는 한국 시간으로 표시하며, 시간대 없는 날짜도 한국 시간으로 해석합니다.

### 기존 글 번역

Codex의 `$cinev-translate-post` [스킬](.agents/skills/cinev-translate-post/SKILL.md)에 원문 파일·제목·URL과 대상 언어를 지정하면 제목·본문·SEO 문구까지 번역한 Markdown 초안을 만듭니다. 영어·한국어·일본어를 지원합니다.

예: `$cinev-translate-post content/posts/ko/my-post.md를 영어와 일본어로 번역해줘` (원문 경로는 실제 파일로 바꿉니다.)

번역본은 `content/posts/<lang>/<slug>.md`에 `draft: true`로 생성됩니다. 원문과 번역본은 같은 `translationKey`로 연결하고 이미지·영상을 재사용합니다. 같은 언어의 번역이 이미 있으면 새로 만들거나 덮어쓰지 않습니다. 내용을 검토한 뒤 아래 발행 절차를 진행합니다. 공개·색인 가능한 번역본끼리 언어 전환 링크와 `hreflang`이 자동으로 생성됩니다.

### 발행 전 확인

본문, 요약(`excerpt`), 대표 이미지와 대체 텍스트를 확인한 뒤 `draft: false`로 바꿉니다.

```sh
npm run check
npm run preview
```

`check`는 Python 3.9 이상을 사용해 운영 빌드와 글·이미지·링크·RSS·사이트맵 검증을 실행합니다. URL 중복·예약 경로·언어에 맞지 않는 분류·없는 작성자는 빌드를 실패시킵니다. 요약이 비어 있으면 본문에서 목록·검색·RSS 요약을 생성합니다. 새 글은 기존 글의 본문 템플릿을 상속하지 않고 제목·분류·작성자·대표 이미지로 전용 Markdown 화면을 구성합니다.

기본 분류는 `--help`에 표시되는 카테고리 ID 또는 slug를 사용합니다. 새 태그는 frontmatter의 `tags`에 추가하면 목록이 생성됩니다. 새 작성자나 카테고리를 운영에 추가하려면 `src/config/catalog.json`의 해당 항목과 메뉴 구성을 함께 관리합니다.

직접 `main`에 push하면 자동 배포됩니다. 리뷰를 거칠 때는 작업 브랜치에서 PR을 만들면 같은 빌드·검증이 실행되며, `main`에 반영된 뒤 배포됩니다. **PR 검증은 배포하지 않습니다.** CI는 `npm run test:publishing`으로 임시 글을 생성해 3개 언어의 새 글 반영과 초안 제외도 검증합니다. 임시 글은 운영 콘텐츠에 추가되지 않습니다.

### 기존 콘텐츠 수정

기능 소개 페이지는 `content/pages/`에서 관리합니다. 기존 WordPress 콘텐츠는 레이아웃을 유지하기 위해 Markdown 안에 HTML을 포함합니다. 자동 관련 글·이전/다음 글 링크는 현재 발행 상태와 경로에 맞춰 갱신합니다. 직접 작성한 본문의 링크는 자동 변경하지 않으므로 대상 글을 내리거나 주소를 바꿀 때 함께 수정합니다. 기존 글의 `legacyId`는 예전 짧은 URL 호환용이며 `templateFile`은 `src/templates/`의 레이아웃을 지정합니다. 본문 HTML의 클래스는 현재 CSS와 연결되므로 유지합니다. WordPress 원본 백업과 `migration/` 폴더는 빌드에 사용하지 않습니다.

원본 디자인과 콘텐츠를 보존하지만 WordPress 플러그인 자체를 실행하지는 않습니다. 사이트에 포함된 WOFF2 글꼴을 사용하며, 검색 제목·설명은 글의 frontmatter에서 관리합니다.

## 발행과 배포

`CINEV/insights` 저장소의 GitHub Pages 프로젝트 사이트로 배포합니다. `main`에 push하면 `.github/workflows/deploy.yml`이 Node.js 24에서 `npm ci`, `npm run build`, 빌드 검증을 실행하고 `dist/insights/`를 배포합니다. GitHub Actions 화면에서 수동 실행도 가능합니다.

배포 주소는 [https://cinev.github.io/insights/](https://cinev.github.io/insights/)입니다. `cinev.github.io` 저장소와 루트 주소는 별도 프로젝트에서 사용할 수 있습니다. 배포 상태와 실패 로그는 저장소의 **Actions → Deploy to GitHub Pages**에서 확인합니다. 빌드나 검증이 실패하면 새 버전은 배포되지 않습니다.

서비스 프론트가 운영되는 동안에는 `/insights/` 요청을 이 프로젝트 Pages의 같은 경로로 프록시합니다. 서비스 종료 후에는 조직 Pages 사이트에 `cinev.com`을 연결하고, 독립 프로젝트 Pages인 Insights를 `/insights/`에서 계속 제공합니다. 메인 저장소에 블로그 빌드 결과를 복사하지 않습니다.

초안은 `draft: true`로 관리하고 발행할 때 `false`로 변경합니다. 글 수정·삭제, 이미지·스타일·스크립트 변경도 `main`에 push한 뒤 배포가 완료되면 반영됩니다. 메인 프론트 앱의 재빌드는 필요하지 않습니다. 이전 버전으로 되돌리려면 해당 변경을 revert하고 `main`에 push합니다.

### 요청 경로

GitHub Pages는 배포 폴더의 파일을 저장소 이름에 따라 `/insights/` 아래에서 제공합니다. `npm run build`의 postbuild 단계는 문서·피드·이미지·영상·폰트를 `dist/insights/`에 모읍니다. 이 폴더만 업로드해야 `/insights/insights/`가 중복되지 않습니다. `dist/` 루트의 문서·피드 사본은 로컬 검증용이며 배포하지 않습니다. 메인 프론트는 문서와 자산 모두 `/insights/` 접두사를 유지해 프록시합니다.

- `https://cinev.github.io/insights/`: 블로그 홈
- `/insights/feed.xml`: 영어 RSS
- `/insights/ko/feed.xml`, `/insights/ja/feed.xml`: 한국어·일본어 RSS
- `/insights/all/feed.xml`: 전체 언어 RSS
- `/insights/sitemap_index.xml`, `/insights/sitemap.xml`: 사이트맵
- `/insights/search-index.json`: 검색 인덱스

기존 `/insights/feed/`, `/insights/ko/feed/`, `/insights/ja/feed/` 구독 주소를 유지합니다. 메인 프론트는 이 주소를 실제 `.xml` 파일로 프록시해 XML 응답 형식을 보존합니다. Pages 직접 접근에서는 디렉터리 별칭에 XML 본문을 제공하지만 응답 형식은 `text/html`이므로 새 구독에는 언어별 `feed.xml`을 사용합니다. 큰 자산은 복제하지 않습니다.

운영 공개 주소와 SEO canonical은 `https://cinev.com/insights/`로 유지합니다. 서비스 종료 전에는 프론트 프록시를, 종료 후에는 조직 Pages의 도메인 연결을 사용합니다. 블로그 배포만으로 프론트 설정이나 DNS가 바뀌지는 않습니다.

```text
cinev.com/insights/글주소/
  → 메인 프론트 프록시
  → cinev.github.io/insights/글주소/
```

검색 메타데이터·사이트 인증·색인 정책과 프론트 전환 방법은 [SEO와 운영 연결](docs/seo.md)을 참고합니다. `llms.txt`도 발행된 글에서 자동 생성합니다.

## 유지보수

### 배포 용량 관리

`public/assets/media/`, `fonts/`, `styles/`에는 현재 사이트에 필요한 파일만 보관합니다. 미사용 원본 283개(원본 TTF 8개와 중복 영상 4개 포함)는 제거했고, WordPress 플러그인 JavaScript를 실행하지 않습니다. 이미지·영상·WOFF2는 재인코딩하지 않고 기존 배포 파일의 바이트를 유지했습니다. CSS는 새 자산 경로를 참조합니다.

`src/config/asset-integrity.json`은 관리 자산 271개의 경로·크기·SHA256입니다. 빌드는 이를 검증하며 `dist/asset-manifest.json`에 실제 배포 목록을 기록합니다. 새 글의 `public/images/`와 사이트 스크립트도 배포합니다. 검증된 한·일 글꼴은 원본 TTF 없이 사용할 수 있으며, 교체 절차는 [글꼴 관리](docs/font-optimization.md)를 참고합니다.

자산 URL은 `/insights/assets/`로 전환했습니다. `/wp-content/`·`/wp-includes/`의 옛 경로에는 호환 파일이나 rewrite를 제공하지 않습니다. 따라서 외부에 저장된 옛 자산 링크와 구독기의 과거 캐시 본문에서는 이미지가 표시되지 않을 수 있습니다. 기존 글·RSS 구독 주소와 GUID는 이번 자산 이전에서 유지하며, 새 HTML·RSS·CSS는 모두 새 자산 경로를 사용합니다. 서비스 프론트가 있는 동안에는 `/insights/` 아래의 같은 파일 경로를 Pages로 프록시하고, 종료 후 조직 Pages에 연결된 도메인에서도 프로젝트 Pages의 `/insights/` 경로로 제공합니다.

### 빌드 결과 검증

Python 3.9 이상에서 추가 패키지 없이 실행합니다.

```sh
python3 scripts/verify-build.py
```

현재 발행 경로, 로컬 링크·자산, WordPress 서버 의존성, RSS·사이트맵 설정을 검사합니다. 이관 당시 모든 URL이 유지되는지 확인할 때만 `--migration-baseline`을 추가합니다. 미리보기 서버가 실행 중이면 실제 HTTP 응답도 검사할 수 있습니다.

```sh
python3 scripts/verify-build.py --base-url http://localhost:4321
```

### 원본 제거 이후의 자료

WordPress 원본 HTML·RSS 내보내기·API 응답·PHP 설정·미디어 보관 폴더와 수집 도구는 제거했습니다. `src/templates/`에는 본문이 없는 레이아웃, `src/config/catalog.json`에는 경로·분류와 카드 표시 정보, `tests/fixtures/rss-baseline.json`에는 구독 호환성 검사에 필요한 메타데이터만 남습니다. 본문은 `content/`에서 관리합니다.

`npm run test:media`는 네트워크 없이 관리 자산의 크기·SHA256을 검사합니다. 폐기한 호스트가 들어 있던 RSS GUID 3개는 앞선 정리에서 고정 UUID로 변경했으며 이번 원본 제거에서 다시 바꾸지 않았습니다. 외부 CSS의 저작권·라이선스 표시는 유지합니다. 파일 삭제는 Git 과거 이력을 삭제하지 않습니다.
