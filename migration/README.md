# WordPress 이관 자료

이 디렉터리는 원본을 다시 조회하지 않고 블로그를 빌드하고 이관 결과를 검증하기 위한 자료다. 운영 서버에서 WordPress나 PHP를 실행하지 않는다.

| 자료 | 용도 |
| --- | --- |
| `catalog.json` | 공개 글 17개·페이지 4개·분류·기존 URL·템플릿·페이지에서 참조한 자산 |
| `snapshots/` | 기존 디자인의 HTML 템플릿 |
| `source-api/` | 공개 WordPress API 응답. 미디어는 라이브러리 전체 87개 |
| `source-feeds/` | 영어·한국어·일본어 원본 RSS와 GUID 검증 기준 |
| `media-library.json` | 미디어 원본·비축소본·파생본 398개의 경로·크기·SHA256 |
| `asset-aliases.json` | 내용이 같은 영상의 원본 경로 → 배포 대표 파일 매핑 |
| `font-conversions.json` | 원본 TTF와 전체 글리프 WOFF2의 경로·SHA256·용량 |
| `font-conversion-report.json` | 글리프·문자 매핑·윤곽·메트릭·기능 테이블의 변환 전후 검증 기록 |
| `translations.json` | 확인된 글·페이지·분류 번역 관계 |
| `source-config/` | 원본 커스텀 PHP, Polylang 그룹, 빈 초안의 메타데이터 보존 |

현재 이관은 공개 글 17개, 공개 페이지 4개, 본문이 비어 있는 일본어 초안 1개를 포함한다. 초안은 `content/pages/410-home-ja.md`의 `draft: true`로 보존하고 운영 출력·검색·RSS·사이트맵·짧은 주소 매핑에서 제외한다. Git 저장소가 공개이면 초안 소스도 공개되므로 향후 기밀 초안을 커밋하지 않는다.

미디어 라이브러리 398개 중 기존 페이지에서 보존하지 않았던 파일 228개를 추가했다. 기존 페이지 자산과 합하면 547개다. 라이브러리 원본과 모든 파생 크기를 저장소에 보존하며, 비축소 원본 11개도 포함한다. 배포에는 실제 글·RSS·CSS에서 사용하는 자산만 포함하고, 미사용 원본은 제외한다. 중복 영상은 바이트 일치 확인 후 하나의 대표 파일로 통합한다. 보존용 파일 수와 실제 배포 파일 수는 다르며 배포 목록은 `dist/asset-manifest.json`에서 확인한다. WordPress 댓글은 0개였으며, 추가 발행 글이나 글 초안은 없었다.

## 커스텀 PHP 대응

| 원본 동작 | Astro 대응 |
| --- | --- |
| 글·분류·메뉴·본문·canonical·사이트맵의 프록시 주소 보정 | `src/lib/blog.ts`, `src/lib/seo.ts`, 정적 사이트맵 |
| 로고·언어별 푸터·Astra 스타일·Noto 글꼴 | 보존 템플릿, 로컬 자산, 언어 경로 보정 |
| 기본 WordPress·Polylang canonical 리다이렉트 해제 | PHP 리다이렉트 불필요. 정적 URL과 프론트의 명시적 redirect/rewrite 사용 |
| 직접 WordPress 호스트에만 noindex 응답 헤더 | Pages 원본 robots 수집 차단 + 운영 canonical. 헤더와 동일한 색인 삭제 기능은 아님 |
| 관리자 Gutenberg REST origin 보정 | 관리자 런타임 종료로 불필요 |

서버의 redirect 관련 영구 option 이름을 조회했으며 추가 옵션은 없었다. 기존 커스텀 PHP의 문자열 치환을 그대로 실행하는 대신 실제 공개 경로를 유지하도록 옮겼다. 원본 PHP는 참고 자료이며 `public/`에 복사하거나 실행하지 않는다.

## 관리 원칙

글과 페이지의 운영 원본은 `content/` Markdown이다. 원본 RSS는 기존 GUID 검증 기준이고, 번역 연결의 운영 값은 Markdown `translationKey`다. 카테고리 번역은 `translations.json`을 사용한다. 새 글마다 이관 자료를 갱신할 필요는 없다.

추가 이관 시 공개 API 가져오기 후 `python3 scripts/archive-wordpress-media.py`를 실행한다. `python3 scripts/archive-wordpress-media.py --check`는 네트워크 없이 전체 라이브러리 보존을 검사한다. 원본에서 이미 사라진 파일은 다운로드에 실패할 수 있으므로 원본 서버 종료 전에 검사한다.

운영 전환은 블로그 배포 후 메인 프론트의 프록시 변경을 배포해야 완료된다. 운영 수집 상태와 GA4 실제 수신은 로컬 검증과 별도로 확인한다.
