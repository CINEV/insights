# JP/KR 폰트 압축 산출물 운영

일반 `npm run build`는 이미 준비된 `public/wp-content/migration-fonts/*.woff2`와 `migration/font-conversions.json`을 사용한다. 빌드를 위해 Python 또는 추가 의존성을 설치하지 않는다. 원본 TTF는 `public/wp-content/migration-external/`에 보존한다.

현재 JP/KR 각각 400/500/600/700 전체 폰트 8개는 45,925,768 bytes에서 17,061,532 bytes로 줄었다(62.85%). subset이나 글리프 삭제를 사용하지 않았으며, 전체 글리프·문자 매핑·outline·metrics·layout·메타데이터 비교 결과는 `migration/font-conversion-report.json`에 있다. WOFF2 컨테이너의 체크섬, offset 형식, [무손실 압축 표시](https://learn.microsoft.com/en-us/typography/opentype/spec/head)만 정규화했다.

원본 폰트가 바뀌면 프로젝트 루트에서 Podman으로 다시 생성한다. 아래 명령은 리포지토리를 읽기 전용으로 마운트하고 임시 디렉토리에만 결과를 기록한다. 로컬 환경에 패키지를 설치하지 않는다.

```sh
TASK_FONT_OUTPUT="$(mktemp -d)"
if ! podman info >/dev/null 2>&1; then podman machine start; fi
podman run --rm \
  -v "$PWD:/repo:ro" \
  -v "$TASK_FONT_OUTPUT:/output:rw" \
  docker.io/library/python@sha256:c89921a0c7b42f27338ed8c279fb370e69e941c92460f91895d08304e844b0b4 \
  sh -c 'pip install --no-cache-dir "fonttools[woff]==4.66.1" "brotli==1.2.0" "zopfli==0.4.3" && python /repo/scripts/compress-wordpress-fonts.py --input /repo/public/wp-content/migration-external --output /output/fonts --manifest /output/font-conversions.json'
```

명령이 성공하고 `fonts/report.json`의 `verified`가 `true`인지 확인한 뒤, 같은 쉘에서 산출물을 배치한다. Manifest는 전수 검증 성공 시에만 생성된다.

```sh
mkdir -p public/wp-content/migration-fonts
cp "$TASK_FONT_OUTPUT"/fonts/*.woff2 public/wp-content/migration-fonts/
cp "$TASK_FONT_OUTPUT"/font-conversions.json migration/font-conversions.json
cp "$TASK_FONT_OUTPUT"/fonts/report.json migration/font-conversion-report.json
npm run check
```

WOFF2 파일, manifest, 전체 보고서를 함께 커밋한다. Manifest의 원본 SHA256은 압축 산출물이 현재 TTF와 일치하는지 확인하기 위한 값이며, 변환 SHA256과 바이트 수는 배포 파일의 무결성을 확인하기 위한 값이다. 빌드가 원본/변환 해시 불일치를 보고하면 폰트를 다시 생성해 갱신한다.

재생성 도구의 `--verify-existing`는 기존 출력 파일이 있을 때 재압축을 생략하고 동일한 전수 검증을 수행한다. `--input`, `--output`, `--manifest`에는 원하는 파일시스템 경로를 지정할 수 있고, 기본 공개 URL 접두사는 `/wp-content/migration-external`과 `/wp-content/migration-fonts`이다.
