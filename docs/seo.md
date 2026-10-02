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

`src/config/site.json`에서 사이트 이름·설명, 기본 공유 이미지, 조직 로고·소셜 계정, Search Console 검증 값, Google 분석 태그를 관리한다. 공개 주소는 `https://cinev.com/insights/`다. URL을 바꾸면 기존 주소의 리다이렉트와 프론트 프록시도 별도로 변경해야 한다.

빌드 시 canonical, Open Graph, Twitter 카드, Organization·WebSite·WebPage·BlogPosting·BreadcrumbList·이미지 구조화 데이터를 생성한다. 본문에 있던 FAQ 구조화 데이터는 보존한다. 태그 목록은 `noindex`이며 사이트맵에 포함하지 않는다. 작성자 이름은 글에 표시하되 작성자 목록은 기존 WordPress 설정처럼 비활성화한다. 이전 작성자 URL은 홈으로 즉시 이동하는 정적 HTML을 제공한다. GitHub Pages에서는 이 응답 자체가 HTTP 301은 아니며, 메인 프론트에서 영구 리다이렉트를 제공한다.

`/blog/` 같은 목록 별칭은 언어별 홈을 canonical로 사용하고 사이트맵에서는 제외한다. RSS·검색 인덱스·사이트맵·`llms.txt`는 발행된 Markdown에서 매 빌드마다 생성한다. `llms.txt`는 콘텐츠 안내 파일이며 검색 순위나 AI 서비스의 사용을 보장하지 않는다. 번역 관계가 지정되지 않은 글에는 hreflang을 추정해서 붙이지 않는다. 실제 번역본은 같은 `translationKey`를 지정하며, 동일 그룹에서 언어를 중복 지정하면 빌드가 실패한다. 공개된 번역본끼리 언어 전환 링크와 자기 자신을 포함한 상호 hreflang을 생성한다. 초안·noindex 문서는 번역 대안에서 제외한다. 기존 WordPress 번역 관계는 데이터베이스에서 확인한 그룹만 보존했으며 제목이 같다는 이유로 연결하지 않았다. 카테고리 번역은 `migration/translations.json`에서 관리한다.

## RSS와 기존 짧은 주소

영어는 `/feed.xml`, 한국어는 `/ko/feed.xml`, 일본어는 `/ja/feed.xml`을 사용한다. 경로 앞에는 운영 블로그 prefix인 `/insights`가 붙는다. `/all/feed.xml`은 전체 언어다. 기존 `/feed/` 형식은 메인 프론트에서 같은 언어의 `.xml`로 프록시한다. 원본 피드의 GUID·작성자·분류·발행일·영상 첨부를 보존하며, 새 글 생성 명령은 UUID `rssGuid`를 발급한다. 발행 후에는 이 값을 변경하지 않는다. `rssGuid`를 생략한 수동 Markdown은 현재 canonical 주소를 식별자로 사용한다.

원본 WordPress RSS와 최초 이관 결과를 대조하려면 빌드 후 `npm run test:rss -- --migration-baseline`을 실행한다. 이 검사는 원본 작성자·분류·발행일·영상 첨부까지 비교한다. 일반 CI는 현재 글과 RSS의 일치 및 GUID 보존을 검사하므로 이관 후 작성자·분류·발행일을 수정할 수 있다. SEO와 경로 검사도 현재 Markdown의 발행 상태를 기준으로 하며, 기존 글을 초안·noindex로 변경할 수 있다. 이관 당시의 전체 번역 관계와 URL 보존을 별도로 감사할 때는 `npm run test:seo -- --migration-baseline`과 `python3 scripts/verify-build.py --migration-baseline`을 실행한다.

기존 `?p=ID`, `?page_id=ID`는 메인 프론트에서 해당 글·페이지로 308 리다이렉트한다. UTM과 fragment를 유지하고 도착 후 WordPress ID 쿼리만 제거한다. Pages 직접 방문에서도 `legacy-links.js`가 동일한 공개 ID 매핑으로 이동시킨다. 알 수 없는 ID나 비공개 초안은 매핑하지 않는다. Pages는 이 스크립트 기반 이동에 HTTP 308을 제공하지 않는다.

추가 WordPress 콘텐츠를 이관한 경우 `node scripts/export-legacy-redirects.mjs`의 결과를 프론트 redirect 설정에 반영한다. 일반 Markdown 새 글 발행에는 WordPress ID나 프론트 변경이 필요 없다.

## Analytics와 Search Console

Google Tag `GT-TB7PRSX5`를 기존 GA4 `G-TSDWLF9GH0`에 연결된 상태로 이어 쓴다. `public/analytics.js`는 `https://cinev.com`에서만 Google 스크립트를 한 번 불러온다. 로컬·GitHub Pages·개발 호스트와 초안에서는 분석 요청을 보내지 않는다. WordPress 로그인 상태에 따른 제외나 Site Kit 전용 전환 이벤트는 사용하지 않으며, 운영 방문은 기존 GA4 설정에 따라 집계된다.

Search Console의 기존 `https://cinev.com/insights/` 속성과 공개 검증 meta 값을 유지한다. 운영 주소를 유지하므로 주소 변경 신청은 필요하지 않다. 운영 전환 뒤 사이트맵 `https://cinev.com/insights/sitemap_index.xml`의 수집 결과와 실제 색인, GA4 실시간 페이지뷰를 확인한다. 빌드 검증은 실제 Google 수집·분석 수신까지 보장하지 않는다.

## 운영 프록시

블로그 Pages 배포가 완료된 후 메인 프론트의 `vercel.json`에서 `/insights/:path*`를 `https://cinev.github.io/:path*/`, `/insights`를 `https://cinev.github.io/`로 연결한다. 이미지·영상·폰트 폴더는 `https://cinev.github.io/insights/:path`의 단일 자산 디렉터리로 연결한다. 스크립트·RSS·사이트맵 같은 파일 경로는 끝에 `/`를 붙이지 않는 별도 rewrite를 먼저 둔다. Pages의 디렉터리 응답이 `cinev.github.io` 주소로 리다이렉트되지 않도록 글·목록 목적지에만 끝 `/`를 붙인다. 과거 이미지 링크용 `/wp-content/:path*`, `/wp-includes/:path*`도 Pages의 `/insights/` 아래 같은 경로로 연결한다. 중복 영상과 TTF 글꼴의 기존 경로는 일반 자산 규칙보다 앞선 exact rewrite에서 대표 영상·압축 WOFF2 파일로 연결한다. `node scripts/export-asset-rewrites.mjs`로 이 규칙을 생성한다. URL은 그대로 유지되며 추가 리다이렉트는 없다. 기존 `/insights/author/:path*`는 `/insights/`로 영구 리다이렉트한다.

메인 프론트가 소유한 `/robots.txt`의 블로그 사이트맵은 `https://cinev.com/insights/sitemap_index.xml`이어야 한다. 블로그 내부의 `robots.txt`만 바꿔서는 메인 도메인 규칙이 바뀌지 않는다. DNS를 바꾸지 않고 이 프록시로 연결할 수 있다. Pages 원본의 루트 `/robots.txt`는 `Disallow: /`로 중복 호스트 수집을 차단하고, HTML canonical은 운영 주소를 가리킨다. GitHub Pages는 호스트별 응답 헤더를 설정할 수 없어 WordPress의 직접 접근 전용 `X-Robots-Tag: noindex`와 완전히 같은 동작은 아니다. robots 차단은 이미 색인된 URL의 삭제를 보장하지 않으므로, Pages 원본이 색인되어 있다면 별도 제거 처리가 필요하다. 운영 HTML에 공통 noindex를 넣으면 프록시된 운영 글까지 제외되므로 넣지 않는다.

전환 후 운영 주소에서 세 언어의 글·목록·이미지·RSS·사이트맵·404 응답을 확인한 뒤 기존 WordPress 전용 DNS·Lightsail 인스턴스·고정 IP와 인프라 선언을 제거한다. 최종 운영에는 WordPress 서버나 별도 블로그 도메인이 필요 없다. 이관 원본과 RSS GUID의 과거 주소는 기록·식별자로 보존한다. 배포 문제는 마지막 정상 Astro 버전을 Pages에 재배포하고 프론트도 Pages를 가리키는 정상 설정으로 복구한다. 이후 글 발행은 블로그 저장소의 `main` push로 완료하며 메인 앱 재배포는 필요 없다.

## 검증

```sh
npm run check
```

`check`는 빌드와 발행 회귀검증, 메타데이터·이미지·구조화 데이터·번역 연결·색인 정책·분석 호스트 제한, 언어별 RSS, 기존 짧은 주소, 미디어 SHA256과 기존 링크를 검사한다. `test:publishing`은 임시 글로 세 언어의 발행·SEO 기본값/재정의·noindex·초안 제외를 검증한다. GitHub Actions에서도 같은 검사를 실행한다.
