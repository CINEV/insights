# 사이트 글꼴 관리

운영 글꼴은 `public/assets/fonts/`의 WOFF2 파일이다. 원본 TTF와 WordPress 폴더는 제거했으며 빌드에 필요하지 않다. `src/config/asset-integrity.json`의 크기·SHA256으로 현재 산출물을 검증한다.

한·일 Noto 글꼴 8개는 전체 글리프를 유지한 압축 산출물이다. 기존 45,925,768 bytes에서 17,061,532 bytes로 줄었으며, 변환 당시의 글리프·문자 매핑·윤곽·메트릭·기능 테이블 비교 기록은 `docs/font-validation.json`에 남아 있다. 이 기록은 원본 파일 백업이 아니다.

글꼴을 바꿀 때는 새 TTF를 저장소 밖의 디렉터리에 준비하고 `scripts/compress-fonts.py`를 Podman에서 실행한다. 도구의 `--input`, `--output`, `--manifest`에 입력·출력·검증 기록 경로를 지정한다. `--verify-existing`는 이미 생성한 WOFF2를 원본과 비교한다. 추가 패키지는 컨테이너에만 설치한다.

```sh
# /absolute/font-input에는 새 TTF, /absolute/font-output에는 결과를 저장한다.
podman run --rm \
  -v "$PWD:/repo:ro" \
  -v /absolute/font-input:/input:ro \
  -v /absolute/font-output:/output:rw \
  docker.io/library/python@sha256:c89921a0c7b42f27338ed8c279fb370e69e941c92460f91895d08304e844b0b4 \
  sh -c 'pip install --no-cache-dir "fonttools[woff]==4.66.1" "brotli==1.2.0" "zopfli==0.4.3" && python /repo/scripts/compress-fonts.py --input /input --output /output/fonts --manifest /output/conversion.json'
```

검증 성공 후 WOFF2를 `public/assets/fonts/`에 배치하고 CSS 참조와 `src/config/asset-integrity.json`을 함께 갱신한다. 현재 공개 경로를 유지하려면 파일 이름을 유지한다. 이름을 변경할 때는 CSS·템플릿·콘텐츠의 해당 참조를 함께 갱신한다. 옛 WordPress 자산 경로의 호환 파일은 제공하지 않는다. 변환 도구의 manifest는 변환 검증 기록이므로 운영 무결성 목록에 그대로 덮어쓰지 않는다. `npm run check`로 발행·글꼴 경로·무결성을 확인한다.
