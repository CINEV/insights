# SEO와 운영 연결

## 새 글 작성

기본적으로 `title`에서 검색 제목, `excerpt`(없으면 본문)에서 검색 설명, `image`에서 공유 이미지를 생성한다. 대표 이미지가 없으면 사이트 기본 공유 이미지를 쓴다. 새 글마다 SEO 항목을 따로 작성할 필요는 없다.

검색·공유 표시를 본문 제목이나 카드와 다르게 쓰려면 frontmatter에 필요한 항목만 추가한다.

```yaml
seoTitle: "검색 결과에 표시할 제목"
description: "검색 결과와 공유 카드에 표시할 설명"
socialImage: "/insights/images/social-cover.webp"
```

기존 글의 검색 제목·설명·공유 이미지는 이 항목으로 보존되어 있다. 이후에는 Markdown의 값을 편집한다. `imageAlt`는 이미지 대체 텍스트로도 사용한다. 기존 소개 페이지의 `pageType: AboutPage`는 구조화 데이터 유형이다.

`draft: true`는 배포에서 완전히 제외된다. `noindex: true`는 공개 페이지를 유지하되 검색엔진에 색인 제외를 요청하고 사이트맵과 `llms.txt`에서 제외한다. **noindex는 비공개 기능이 아니다.** 공개 목록·사이트 내부 검색·RSS에는 나타날 수 있다.

## 공통 설정과 자동 생성

`src/config/site.json`에서 사이트 이름·설명, 기본 공유 이미지, 조직 로고·소셜 계정, Search Console 검증 값을 관리한다. 공개 주소는 `https://cinev.com/insights/`다. URL을 바꾸면 기존 주소의 리다이렉트와 프론트 프록시도 별도로 변경해야 한다.

빌드 시 canonical, Open Graph, Twitter 카드, Organization·WebSite·WebPage·BlogPosting·BreadcrumbList·이미지 구조화 데이터를 생성한다. 본문에 있던 FAQ 구조화 데이터는 보존한다. 태그 목록은 `noindex`이며 사이트맵에 포함하지 않는다. 작성자 이름은 글에 표시하되 작성자 목록은 기존 WordPress 설정처럼 비활성화한다. 이전 작성자 URL은 홈으로 즉시 이동하는 정적 HTML을 제공한다. GitHub Pages에서는 이 응답 자체가 HTTP 301은 아니며, 메인 프론트에서 영구 리다이렉트를 제공한다.

`/blog/` 같은 목록 별칭은 언어별 홈을 canonical로 사용하고 사이트맵에서는 제외한다. RSS·검색 인덱스·사이트맵·`llms.txt`는 발행된 Markdown에서 매 빌드마다 생성한다. `llms.txt`는 콘텐츠 안내 파일이며 검색 순위나 AI 서비스의 사용을 보장하지 않는다. 번역 관계가 지정되지 않은 글에는 hreflang을 추정해서 붙이지 않는다. 실제 번역본은 같은 `translationKey`를 지정하며, 동일 그룹에서 언어를 중복 지정하면 빌드가 실패한다. 공개된 번역본끼리 자기 자신을 포함한 상호 hreflang 메타데이터를 생성한다. 화면의 상단 언어 선택은 번역본이 있으면 같은 콘텐츠로, 없으면 언어별 홈으로 연결한다. 초안·noindex 문서는 번역 대안에서 제외한다. 기존 WordPress 번역 관계는 데이터베이스에서 확인한 그룹만 보존했으며 제목이 같다는 이유로 연결하지 않았다. 카테고리 번역은 `src/config/translations.json`에서 관리한다.

## RSS와 기존 짧은 주소

영어는 `/feed.xml`, 한국어는 `/ko/feed.xml`, 일본어는 `/ja/feed.xml`을 사용한다. 경로 앞에는 운영 블로그 prefix인 `/insights`가 붙는다. `/all/feed.xml`은 전체 언어다. 기존 `/feed/` 형식은 메인 프론트에서 같은 언어의 `.xml`로 프록시한다. 원본 피드의 작성자·분류·발행일·영상 첨부를 보존하며, 새 글 생성 명령은 UUID `rssGuid`를 발급한다. 발행 후에는 이 값을 변경하지 않는다. `rssGuid`를 생략한 수동 Markdown은 현재 canonical 주소를 식별자로 사용한다.

보관된 RSS 메타데이터 기준과 대조하려면 빌드 후 `npm run test:rss -- --migration-baseline`을 실행한다. 이 검사는 원본 작성자·분류·발행일·영상 첨부까지 비교한다. 일반 CI는 현재 글과 RSS의 일치 및 GUID 보존을 검사하므로 이관 후 작성자·분류·발행일을 수정할 수 있다. SEO와 경로 검사도 현재 Markdown의 발행 상태를 기준으로 하며, 기존 글을 초안·noindex로 변경할 수 있다. 이관 당시의 전체 번역 관계와 URL 보존을 별도로 감사할 때는 `npm run test:seo -- --migration-baseline`과 `python3 scripts/verify-build.py --migration-baseline`을 실행한다.

기존 `?p=ID`, `?page_id=ID`는 메인 프론트에서 해당 글·페이지로 308 리다이렉트한다. UTM과 fragment를 유지하고 도착 후 WordPress ID 쿼리만 제거한다. Pages 직접 방문에서도 `legacy-links.js`가 동일한 공개 ID 매핑으로 이동시킨다. 알 수 없는 ID나 비공개 초안은 매핑하지 않는다. Pages는 이 스크립트 기반 이동에 HTTP 308을 제공하지 않는다.

기존 글의 경로를 변경한 경우 `node scripts/export-legacy-redirects.mjs`의 결과를 프론트 redirect 설정에 반영한다. 일반 Markdown 새 글 발행에는 WordPress ID나 프론트 변경이 필요 없다.

## Search Console

Search Console의 기존 `https://cinev.com/insights/` 속성과 공개 검증 meta 값을 유지한다. 운영 주소를 유지하므로 주소 변경 신청은 필요하지 않다. 운영 전환 뒤 사이트맵 `https://cinev.com/insights/sitemap_index.xml`의 수집 결과와 실제 색인을 확인한다. 빌드 검증은 실제 Google 색인 수집까지 보장하지 않는다.

## 운영 프록시

현재 서비스 프론트는 `/insights/` 요청을 `https://cinev.github.io/insights/` 아래의 같은 경로로 프록시한다. 파일 경로에는 끝 `/`를 붙이지 않는다. Vercel에서는 문서의 끝 `/`를 유지하며, 기존 ID 리다이렉트와 RSS 별칭은 끝 `/` 유무를 모두 허용해야 한다. 새 자산 경로를 도입할 때는 `/insights/assets/`를 지원하는 프론트 설정을 먼저 배포한 뒤 블로그를 배포한다. 서비스 종료 후에는 조직 Pages 사이트에 `cinev.com`을 연결하여 별도 프로젝트 Pages인 Insights를 같은 도메인의 `/insights/`에서 제공한다. 메인 저장소에 Insights 빌드 결과를 복사하지 않는다.

자산은 `/insights/assets/`로 이전했으며 옛 `/wp-content/`·`/wp-includes/` 주소의 호환 파일과 rewrite는 제공하지 않는다. 현재 글·RSS·CSS는 새 경로를 사용한다. 외부에 남은 옛 파일 주소와 구독기의 과거 캐시 본문에서는 이미지가 깨질 수 있다. 글 주소·RSS 구독 주소·GUID는 이번 자산 이전에서 유지한다.

크롤러가 사용하는 `/robots.txt`는 메인 사이트가 관리한다. `/insights/robots.txt`는 호스트의 수집 정책을 제어하지 않는다. 메인 robots는 수집을 허용하고 메인·Insights 사이트맵을 안내한다. Insights canonical은 현재 프록시 운영 주소이자 전환 후 주소인 `https://cinev.com/insights/`를 유지한다. GitHub Pages 중복 주소는 canonical로 정규화하며 공통 noindex나 Disallow로 차단하지 않는다.

공통 홈 버튼은 시점과 관계없는 언어별 `CINEV Home` 문구로 같은 호스트의 `/`에 연결한다. 공통 메뉴와 로고는 해당 언어의 블로그로 연결한다. 언어 메뉴는 번역본 또는 해당 언어 홈으로 이동하며 본문의 별도 언어 선택은 표시하지 않는다. 검색엔진용 hreflang은 확인된 번역 관계만 사용한다. Pinterest 공유 이미지도 `/insights/` 아래의 정규 자산 URL로 생성한다. 기존 글·피드 주소와 YouTube 임베드는 유지하며 옛 자산 파일 경로를 위한 호환 처리는 제공하지 않는다.

블로그 빌드와 운영에는 저장소의 콘텐츠·템플릿·자산만 사용하며, 별도 콘텐츠 서버나 데이터베이스에 연결하지 않는다. 서버 설정 백업과 재수집 도구, 폐기한 호스트의 주소는 RSS GUID까지 제거했다. 해당 GUID 3개는 고정 UUID로 변경해 기존 구독기에서 중복 표시될 수 있다. 배포 문제는 마지막 정상 Astro 버전을 Pages에 재배포하고 프론트도 Pages를 가리키는 정상 설정으로 복구한다. 이후 글 발행은 블로그 저장소의 `main` push로 완료하며 메인 앱 재배포는 필요 없다.

## 검증

```sh
npm run check
```

`check`는 빌드와 발행 회귀검증, 메타데이터·이미지·구조화 데이터·번역 연결·색인 정책·추적 스크립트 제외, 언어별 RSS, 기존 짧은 주소, 미디어 SHA256과 기존 링크를 검사한다. `test:publishing`은 임시 글로 세 언어의 발행·SEO 기본값/재정의·noindex·초안 제외를 검증한다. GitHub Actions에서도 같은 검사를 실행한다.

## 서비스 종료 후 링크

서비스 이용 CTA는 같은 호스트의 `/`로 연결하며 언어별 CINEV 홈 문구를 쓴다. 글의 설명용 서비스 링크도 홈으로 연결한다. 특정 프로젝트·템플릿 링크는 본문과 로컬 예시 미디어를 유지하면서 링크를 해제하고 아카이브에서 링크를 제공하지 않는다는 안내를 표시한다. 본문은 작성 당시의 기록이므로 과거 프로모션·기능 설명까지 현행 안내로 재작성하지 않는다. 기존 WordPress 언어 드롭다운은 제거하고 상단 언어 선택 메뉴 하나만 유지하며, 번역본이 있으면 같은 글·페이지 또는 카테고리로, 없으면 해당 언어의 블로그 홈으로 이동한다.

일반 홈·목록·게시글의 데스크톱/모바일 메뉴는 Trends → News → Tutorials → Showcase 순서로 통일하고 언어별로 표시한다. 카테고리 목록에서는 현재 카테고리를 강조하며, 페이지를 넘겨도 선택 상태를 유지한다.

for IP Creators 소개는 영어 콘텐츠이므로 Features → for IP Creators 메뉴는 영어의 데스크톱·모바일·푸터에만 표시한다. 소개 페이지의 전용 헤더를 유지하고 모든 언어 주소에서 언어 선택 UI를 숨기되 기존 주소의 직접 접근은 유지한다.
