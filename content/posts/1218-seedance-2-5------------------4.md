---
id: 1218
title: "Seedance 2.5 프롬프트 작성법: 2.0과 달라진 핵심과 구조화 방법"
slug: "seedance-2-5-%ea%b0%80%ec%9e%a5-%ec%9e%98-%ec%93%b0%eb%8a%94-%eb%b2%95-%ea%b3%b5%ec%8b%9d-%ea%b0%80%ec%9d%b4%eb%93%9c-4%ec%a2%85%ec%9c%bc%eb%a1%9c-%ea%b2%80%ec%a6%9d%ed%95%9c-%ed%94%84%eb%a1%ac"
path: "/insights/ko/seedance-2-5-가장-잘-쓰는-법-공식-가이드-4종으로-검증한-프롬/"
date: "2026-08-11T23:42:55"
modified: "2026-09-07T11:33:35"
categories: [45]
tags: []
lang: "ko"
author: 4
sourceUrl: "https://cinev.com/insights/ko/seedance-2-5-%ea%b0%80%ec%9e%a5-%ec%9e%98-%ec%93%b0%eb%8a%94-%eb%b2%95-%ea%b3%b5%ec%8b%9d-%ea%b0%80%ec%9d%b4%eb%93%9c-4%ec%a2%85%ec%9c%bc%eb%a1%9c-%ea%b2%80%ec%a6%9d%ed%95%9c-%ed%94%84%eb%a1%ac/"
excerpt: "TL;DR CineV는 왜 Seedance를 이야기하는가 CineV는 애니메이션을 가장 잘 만드는 생성 AI 플랫폼을 지향한다. 이 문장을 조금 틀어서 읽으면 다른 […]"
format: "wordpress-html"
wordpressId: 1218
snapshotFile: "migration/snapshots/5ca121782a83.html"
image: "/wp-content/uploads/2026/08/seedance2.5-on-cinev-1024x578.png"
readingMinutes: 22
seoTitle: "Seedance 2.5 프롬프트 작성법: 2.0과 달라진 핵심과 구조화 방법 : CineV"
socialImage: "/insights/wp-content/uploads/2026/08/seedance2.5-on-cinev-scaled.png"
rssGuid: "https://cinev.com/insights/?p=1218"
rssEnclosure: {"url": "/insights/wp-content/uploads/2026/08/SD2.5_OneRoom_02-1-1.mp4", "length": 33272361, "type": "video/mp4"}
translationKey: "wordpress-1218"
---

<figure class="wp-block-image alignfull size-large"><img loading="lazy" decoding="async" width="1024" height="578" src="/wp-content/uploads/2026/08/seedance2.5-on-cinev-1024x578.png" alt="" class="wp-image-1222" srcset="/wp-content/uploads/2026/08/seedance2.5-on-cinev-1024x578.png 1024w, /wp-content/uploads/2026/08/seedance2.5-on-cinev-300x169.png 300w, /wp-content/uploads/2026/08/seedance2.5-on-cinev-768x433.png 768w, /wp-content/uploads/2026/08/seedance2.5-on-cinev-1536x867.png 1536w, /wp-content/uploads/2026/08/seedance2.5-on-cinev-2048x1156.png 2048w" sizes="auto, (max-width: 1024px) 100vw, 1024px" /></figure>



<h1 class="wp-block-heading">TL;DR</h1>



<ul class="wp-block-list">
<li>Seedance 2.5는 장면을 길게 설명하기보다 <code>subject / action / location / style / camera</code>처럼 나눠 쓰는 편이 안정적입니다.</li>



<li>레퍼런스는 많이 넣는 것보다, 각 자료의 역할을 분명히 구분하는 것이 중요합니다.</li>



<li>2.0에서 쓰던 감각 그대로보다 2.5 기준으로 프롬프트 구조를 다시 잡는 편이 좋습니다.</li>
</ul>



<p class="wp-block-paragraph"></p>



<h2 class="wp-block-heading">CineV는 왜 Seedance를 이야기하는가</h2>



<p class="wp-block-paragraph">CineV는 <a href="/" type="link" id="https://cinev.com/shorts">애니메이션을 가장 잘 만드는 생성 AI 플랫폼</a>을 지향한다. 이 문장을 조금 틀어서 읽으면 다른 뜻이 하나 나온다.</p>



<p class="wp-block-paragraph">Seedance 공식 문서에는 이런 경고가 있다. <code>Dreamina Seedance 2.5 and Dreamina Seedance 2.0 series models do not support direct uploads of reference images or videos containing real human faces.</code> 실사 인물의 얼굴이 담긴 이미지나 영상은 Reference로 올릴 수 없다는 뜻이다. 인물이 중심인 작업을 하려던 사람은 여기서 한 번 좌절하게 될 것임이 자명하다.</p>



<p class="wp-block-paragraph">그러나 이 공식적인 제한을 비틀어 생각해보자. real human faces가 아니면서, 생성된 애니메이션 캐릭터를 써야 하는 AI Animation 영역이라면 어떨까? 결국 CineV가 지향하는 애니메이션 지향의 AI Creative Platform으로서의 정체성은, 바로 이 지점에서부터 당신이 Seedance의 잠재력을 온전히 사용할 수 있도록 도와줄 것이다.</p>



<p class="wp-block-paragraph">여기에 CineV가 지향하는 3D 기반의 직관적 conditioning이 결합되면 하나가 더 풀린다. &#8216;분명히 원하는 상이 머릿속에 있는데 말로는 도저히 안 풀려서 간지러워 미치겠는&#8217; 경험. Seedance라는 모델의 성능을 끌어내려면 반드시 통과해야 하는 관문인데, 대부분 여기서 지친다.</p>



<p class="wp-block-paragraph">그래서 이번 글에서는 CineV를 소개하고 끝인거냐고? 아니다. 이번 글은 CineV에 대한 설명에 앞서 Seedance family 자체를 제대로 이해할 수 있도록 도와주는 목적으로 작성되었다.</p>



<h2 class="wp-block-heading">이 글의 근거</h2>



<p class="wp-block-paragraph">개발사가 버전을 올리며 학습 데이터와 정렬 방식을 얼마나 변모시켜왔는지는 외부에서 규명할 방법이 없다. 다만 우리는 하나를 가정하고 출발했다. 동일한 팀이 동일한 목표를 향해 점진적으로 개선해온 모델 계열이라면, 개발사가 직접 배포한 프롬프트 가이드 사이에도 버전을 관통하는 공통의 패턴이 잔존하리라는 것이다.</p>



<p class="wp-block-paragraph">이 글은 그 가정을 1.0부터 2.5에 이르기까지의 공식 문서에 실제로 대조해보고 도출한 결과다. ByteDance가 BytePlus ModelArk에 공개한 프롬프트 가이드 네 편과 튜토리얼 세 편을 전수로 독파했으며, 본문에 인용된 문장은 예외 없이 그 안에 존재한다. 여기에 CineV Creative Team이 실무에서 축적한 노하우를 얹었다.</p>



<p class="wp-block-paragraph">가장 적은 실패로 Seedance 2.5에 도달하시기를 바란다. 마침 CineV는 50% 할인 이벤트를 진행 중이다.</p>



<h2 class="wp-block-heading">전제: 당신의 머릿속에 영상이 있어야 한다</h2>



<p class="wp-block-paragraph">Seedance 2.0 이후를 이해하려면 전제 하나를 확실히 깔고 가야 한다. <strong>이 모델의 성능을 극단까지 활용하려면, 모델을 쓰는 당신의 머릿속에 먼저 &#8216;영상&#8217;이 존재해야 한다.</strong></p>



<p class="wp-block-paragraph">닭이 먼저냐 달걀이 먼저냐 같은 이야기로 들릴 것이다. 실제로 그러하다. 표현하고자 하는 sequence가 상(像)으로 맺혀 있지 않다면, 어떤 영상을 만들라고 명확히 지시할 방법이 없다. 지시가 모호하면 모델은 그 공백을 임의로 채운다. 그리고 그렇게 채워진 결과물은 당신이 의도한 것이 아니다.</p>



<p class="wp-block-paragraph">이는 취향의 문제가 아니다. 2.5 공식 가이드가 프롬프트 작성 원칙의 첫 줄에 이렇게 명시해두었다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Treat Seedance 2.5 as a visual content producer, and write structured prompts with a visual storytelling mindset.</p>
</blockquote>



<p class="wp-block-paragraph">Seedance를 &#8216;영상 제작자&#8217;로 대하라는 뜻이다. 제작자에게는 기획이 필요하다. 명확한 지침과 역할 설정이 주어졌을 때 최상의 표현을 산출하는 모델이라면, 그 지침을 만들어낼 주체는 결국 당신이다.</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">머릿속에 상이 없다면</p>



<p class="wp-block-paragraph">CineV의 <strong>스토리보드</strong> 기능은 정확히 이 지점을 위해 존재한다. 한 줄의 logline만 입력하면 전체 sequence의 하이라이트 프레임을 시퀀셜하게 산출해준다. Context가 부재한 상태에서 Context를 조성해주는 도구라고 이해하면 된다. Seedance의 capability를 제대로 활용해보고 싶은데 아직 상이 흐릿하다면, CineV 스토리보드에서 먼저 장면을 구체화해보는 것 <small class="cinev-archived-link-note">(서비스 내 예시 · 아카이브에서는 링크를 제공하지 않습니다.)</small>도 하나의 방법이다.</p>
</div>



<div style="height:56px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">상(像)을 모델의 언어로 옮기는 번역 모듈</h2>



<p class="wp-block-paragraph">머릿속에 상이 맺혔다고 해서 곧바로 프롬프트가 도출되지는 않는다. 그 사이에 번역 모듈이 하나 필요하다.</p>



<p class="wp-block-paragraph">당신이 확보한 것이 <strong>완성된 한 장</strong>인가, <strong>문장으로 풀어낼 수 있는 sequence</strong>인가, 아니면 <strong>흩어진 소재들</strong>인가. 이 셋은 각각 다른 장치로 진입한다.</p>



<figure class="wp-block-image size-full"><img loading="lazy" decoding="async" width="1731" height="2560" src="/wp-content/uploads/2026/08/flowchart-1-scaled.png" alt="" class="wp-image-1228" srcset="/wp-content/uploads/2026/08/flowchart-1-scaled.png 1731w, /wp-content/uploads/2026/08/flowchart-1-203x300.png 203w, /wp-content/uploads/2026/08/flowchart-1-692x1024.png 692w, /wp-content/uploads/2026/08/flowchart-1-768x1136.png 768w, /wp-content/uploads/2026/08/flowchart-1-1038x1536.png 1038w, /wp-content/uploads/2026/08/flowchart-1-1385x2048.png 1385w" sizes="auto, (max-width: 1731px) 100vw, 1731px" /></figure>



<p class="wp-block-paragraph">아래에서 각 단계를 하나씩 본다.</p>



<h3 class="wp-block-heading">Keyframe reference — 그대로 재현되어야 하는 한 장</h3>



<p class="wp-block-paragraph">당신 손에 이미 완성된 씬 한 장이 있다고 해보자. 인물도, style도, acting도, lighting도, camera도 전부 마음에 든다. 그렇다면 그 한 장을 결과물에 그대로 고정하면 된다. 이때 동원하는 것이 <code>Keyframe reference</code>다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Generated visuals align with the keyframes: Input multiple independent images as keyframes, which may include first-frame or last-frame images. The generated video visuals will be relatively strictly aligned with the input images.</p>
</blockquote>



<p class="wp-block-paragraph">여러 장을 순서대로 활용하려면 프롬프트의 <strong>첫 문장</strong>에 <code>Use Images X to X in order as keyframes.</code> 를 기입하라고 가이드가 명시하고 있다. 첫 문장이라는 조건이 붙어 있다는 점을 간과해서는 안 된다.</p>



<p class="wp-block-paragraph">동일한 목적을 달성하는 다른 경로도 존재한다. <code>content.role</code>을 <code>first_frame</code> 또는 <code>last_frame</code>으로 지정하는 방식이다. 이쪽이 더 강하게 고정되는 대신 대가를 수반한다. <strong>화면비가 함께 잠긴다.</strong> 2.5 가이드는 이 경우 <code>ratio</code> 파라미터가 <code>adaptive</code>여야 하며 다른 값은 수용하지 않는다고 적어두었다.</p>



<p class="wp-block-paragraph">여기서 경고를 하나 덧붙여야겠다. 씬 이미지는 인물·style·acting·lighting·camera가 <strong>전부 결합된</strong> 단위다. 그중 하나라도 마음에 들지 않는다면, 그 한 장을 강제하는 선택은 재고해야 한다. 마음에 들지 않는 lighting까지 함께 고정되기 때문이다.</p>



<h3 class="wp-block-heading">Context — 문장으로 확보된 sequence</h3>



<p class="wp-block-paragraph">마음에 드는 씬 이미지는 없으나 머릿속 sequence는 분명한 경우가 있다. 이때 던져야 할 질문은 하나다. <strong>그 sequence를 영상 도메인의 언어로 서술할 수 있는가?</strong></p>



<p class="wp-block-paragraph">서술할 수 있다면 Context가 확보된 상태다. 서술할 수 없다면 아직 아니다. 이 구분이 중요한 이유는, Context가 부재한 상태에서 Reference부터 적재하기 시작하면 모델이 그 조각들을 어떤 원리로 조립할지 알 도리가 없기 때문이다.</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">번역 모듈이 아직 없다면</p>



<p class="wp-block-paragraph">도메인 언어로 옮기는 작업 자체가 익숙하지 않을 수 있다. CineV의 <strong>Prompt Enhance</strong> 기능이 그 번역 모듈의 역할을 대행한다. 당신이 보유한 문장을 모델이 이해하는 형태로 전환해준다.</p>
</div>



<p class="wp-block-paragraph"></p>



<h3 class="wp-block-heading">Reference — Context 안의 모든 주체</h3>



<p class="wp-block-paragraph">Context가 문장이라면, Reference는 그 문장의 주어와 목적어에 해당한다. 2.5는 한 요청에 <strong>최대 50개</strong>의 Reference를 수용한다. 이미지 30장, 영상 10개, 오디오 10개다.</p>



<p class="wp-block-paragraph">공식 문서가 정의한 Reference의 종류는 일곱이다.</p>



<figure class="wp-block-table"><table><thead><tr><th>공식 명칭</th><th>무엇을 참조하는가</th></tr></thead><tbody><tr><td><code>Subject reference</code></td><td>인물·사물·장면·가상 캐릭터의 외형 정체성 및 음성</td></tr><tr><td><code>Motion reference</code></td><td>영상에서 추출하는 움직임과 동적 정보</td></tr><tr><td><code>Style reference</code></td><td>이미지나 영상의 시각적 스타일</td></tr><tr><td><code>Audio reference</code></td><td>음악·대사·음성·톤·음색</td></tr><tr><td><code>Storyboard reference</code></td><td>주체·구도·동작·플롯·장면 전개</td></tr><tr><td><code>Keyframe reference</code></td><td>한 장 이상의 이미지를 keyframe으로 (앞 절 참조)</td></tr><tr><td><code>3D clay-model reference/rendering</code></td><td>3D 클레이 모델 영상을 Motion reference로</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">이 일곱은 기능 분류다. 기획 단계에서 활용하기에는 결이 다소 다르다. 그래서 2.0 가이드가 제시한 <strong>네 가지 기획 역할</strong>을 함께 놓기를 권한다. 이쪽이 실제로 asset을 준비할 때 훨씬 실효적이다.</p>



<figure class="wp-block-table"><table><thead><tr><th>기획 역할</th><th>하는 일</th></tr></thead><tbody><tr><td><code>Character anchoring</code></td><td>인물의 외형을 고정한다</td></tr><tr><td><code>Scene tone-setting</code></td><td>환경과 style을 고정한다</td></tr><tr><td><code>Camera movement reference</code></td><td>화면 언어와 동작 리듬을 고정한다</td></tr><tr><td><code>Rhythmic atmosphere</code></td><td>오디오로 감정과 음색을 통제한다</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">배경과 소품을 별도로 분리하지 않은 것은 누락이 아니다. 공식 분류에서 양자는 모두 <code>Subject reference</code>에 귀속된다. 가이드가 &#8220;a person, object, scene, or virtual character&#8221;라고 명시하고 있다.</p>



<h3 class="wp-block-heading">그렇다면 몇 개를 적재할 것인가</h3>



<p class="wp-block-paragraph">50개를 수용한다고 해서 50개를 충당하라는 의미가 아니다. 오히려 정반대다. 2.0 가이드는 이렇게 못 박아두었다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">It is not recommended to use the full asset limit. Too many assets will make it difficult for the model to judge feature priorities.</p>
</blockquote>



<p class="wp-block-paragraph">동일한 문서가 권장 구성을 수치로 제시한다. <strong>총 4~5개.</strong> 인물 이미지 1~2장, 장면 이미지 1장, 카메라 무브먼트 영상 1개, 오디오 1개다.</p>



<p class="wp-block-paragraph">2.5의 권장치는 항목별로 한층 구체적이다. <code>Subject reference</code>를 이미지로 제공할 경우 1~8개일 때 결과가 안정적이며, 9~12개도 시도해볼 수는 있으나 안정성이 저하되어 다회 시도가 필요할 수 있다고 기술되어 있다. 오디오나 영상으로 제공할 때는 1~5개, 입력 길이는 5~10초가 적절하다.</p>



<p class="wp-block-paragraph">수치를 암기할 필요는 없다. 규칙은 하나다. <strong>한 asset에 한 역할.</strong> 그리고 그 역할이 정말로 필요한 asset만 적재한다.</p>



<h3 class="wp-block-heading">마지막 점검</h3>



<p class="wp-block-paragraph">여기까지 도달했다면 마지막으로 하나만 확인하면 된다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Context 안의 모든 주체가 Reference로 적재되어 있고, 각각이 문장 안에서 자기 이름으로 호명되고 있는가.</p>
</blockquote>



<p class="wp-block-paragraph">하나라도 누락되면 모델은 그 공백을 임의로 채운다. 그것이 실패의 정체다.</p>



<figure class="wp-block-video alignfull"><video height="2160" style="aspect-ratio: 3760 / 2160;" width="3760" controls src="/wp-content/uploads/2026/08/SD2.5_OneRoom_02-1-1.mp4" playsinline></video><figcaption class="wp-element-caption"><a href="/">Seedance 2.5는 CineV에서 사용할 수 있다.</a></figcaption></figure>



<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">Seedance 2.5에서 실제로 무엇이 바뀌었나</h2>



<p class="wp-block-paragraph">여기서부터가 본론이다. 그런데 본론에 들어가기 전에 정리하고 갈 것이 하나 있다. <strong>시중에 도는 2.5 스펙 정보가 서로 어긋난다.</strong></p>



<p class="wp-block-paragraph">어떤 글은 2.5가 4K를 낸다고 쓰고, 어떤 글은 4K는 2.0 이야기라고 반박한다. 실제로 API를 돌리는 쪽에서는 720p라고 문서화해두었다. 독자 입장에서는 무엇을 믿어야 할지 알 수 없다.</p>



<p class="wp-block-paragraph">혼선의 진원지는 공식 문서의 한 문장이다. 2.5 가이드는 Reference 입력 제한을 이렇게 적어두었다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><strong>Images:</strong> Up to 30 images, with resolution up to 4K.</p>
</blockquote>



<p class="wp-block-paragraph"><strong>이 4K는 입력 이미지의 해상도다.</strong> 출력이 아니다. 그리고 2.5 튜토리얼은 출력에 대해 정반대로 명시한다 — <code>Seedance 2.5 does not currently support 1080p and 4K resolutions.</code> 플랫폼 전체 튜토리얼 역시 4K 출력이 가능한 모델은 Seedance 2.0 하나뿐이라고 못 박는다.</p>



<p class="wp-block-paragraph">공식 문서가 실제로 규정하는 2.5의 경계는 이렇다.</p>



<figure class="wp-block-table"><table><thead><tr><th>항목</th><th>2.5</th><th>근거</th></tr></thead><tbody><tr><td>단일 생성 최대 길이</td><td><strong>30초</strong></td><td>2.5 가이드 개요</td></tr><tr><td>출력 해상도</td><td><strong>720p</strong> (1080p·4K 미지원)</td><td>2.5 튜토리얼</td></tr><tr><td>프레임레이트</td><td>24 fps</td><td>플랫폼 튜토리얼</td></tr><tr><td>Reference 총량</td><td><strong>50개</strong> (이미지 30 · 영상 10 · 오디오 10)</td><td>2.5 가이드</td></tr><tr><td>화면비</td><td>[0.4, 2.5] 구간 내 자유</td><td>2.5 가이드</td></tr><tr><td>네이티브 언어</td><td>10개 이상</td><td>2.5 가이드</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">그렇다면 2.0 대비 무엇이 실질적으로 개선되었는가. 이것 역시 추측할 필요가 없다. 2.5 가이드에 <code>Differences from Seedance 2.0</code>라는 절이 통째로 있고, 항목은 정확히 넷이다.</p>



<ol class="wp-block-list">
<li><code>Seedance 2.0 does not respond to timestamps and only responds to shot numbers, while Seedance 2.5 supports integer-second timestamps.</code></li>



<li><code>Seedance 2.0 does not recommend using multi-view images as subject references, while Seedance 2.5 supports them.</code></li>



<li><code>Seedance 2.0 only supports six fixed output aspect ratios, while Seedance 2.5 can support any output aspect ratio between [0.4, 2.5] by controlling the input assets.</code></li>



<li><code>Seedance 2.5 supports MOV output, which better preserves color consistency, brightness consistency, and audio-visual consistency in extension and editing tasks.</code></li>



<li><code>Seedance 2.5 divides tasks into two categories based on whether the input reference assets lock the properties of the output video. Seedance 2.0 does not make this distinction.</code></li>
</ol>



<p class="wp-block-paragraph">다섯 번째 항목은 문서의 다른 절에 적혀 있으나 성격이 같아 여기 함께 놓았다. 입력 asset이 출력 속성을 잠그는지 여부로 과업을 둘로 나눈다는 것인데, 2.0에는 없던 구분이다.</p>



<p class="wp-block-paragraph"><strong>이 중 1번과 5번이 이 글의 나머지 절반을 차지한다.</strong> 둘 다 실무에서 조용히 실패를 만들어내는 항목이기 때문이다.</p>



<h2 class="wp-block-heading">공식 가이드 네 편이 공유하는 하나의 공식</h2>



<p class="wp-block-paragraph">이제 앞서 세운 가설을 검증할 차례다. 1.0부터 2.5까지, 개발사가 직접 배포한 프롬프트 가이드에서 &#8216;프롬프트 공식&#8217;에 해당하는 문장만 뽑아 나란히 놓아보자.</p>



<figure class="wp-block-table"><table><thead><tr><th>버전</th><th>공식 문서가 명시한 프롬프트 공식</th></tr></thead><tbody><tr><td>1.0 pro</td><td><code>Beginner: subject+action</code></td></tr><tr><td>1.5 pro</td><td><code>Subject + Movement + Environment (optional) + Camera movement (optional) + Aesthetic description (optional) + Sound (optional)</code></td></tr><tr><td>2.0 series</td><td><code>precise subject + action details + scene/environment + lighting &amp; color tone + camera movement + visual style + image quality + constraints</code></td></tr><tr><td>2.5</td><td><code>Subject + Location + Event + Genre/Style + Camera movement...</code></td></tr></tbody></table></figure>



<p class="wp-block-paragraph">슬롯의 개수는 둘에서 여섯으로, 다시 여덟으로 늘었다가 다섯으로 줄었다. 명칭도 조금씩 다르다. Movement가 action details가 되었다가 Event가 된다.</p>



<p class="wp-block-paragraph"><strong>그런데 순서는 네 번 모두 동일하다.</strong></p>



<p class="wp-block-paragraph">주체가 첫째다. 그 주체가 무엇을 하는가가 둘째다. 어디에서 벌어지는가가 셋째다. camera는 그 뒤다. 2년에 걸쳐 네 개 문서를 거치면서 이 배열만은 한 번도 흔들리지 않았다. 개발사가 의도적으로 유지한 것인지, 아니면 같은 데이터 풀 위에서 모델이 그렇게 학습되어온 결과인지는 우리가 알 수 없다. 다만 <strong>네 번 반복된 것을 우연이라고 보기는 어렵다.</strong></p>



<p class="wp-block-paragraph">여기서 실무 결론이 나온다. 어떤 버전을 쓰든, 프롬프트를 쓰다 막히면 이 순서로 되돌아가면 된다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">누가 → 무엇을 하는가 → 어디에서 → 카메라는 어떻게</p>
</blockquote>



<p class="wp-block-paragraph">2.5는 여기에 한 겹을 더 씌운다. 위 공식은 2.5에서 <code>One-Sentence Summary</code>라는 이름의 <strong>첫 번째 블록</strong>일 뿐이고, 전체는 네 블록 구조다.</p>



<figure class="wp-block-table"><table><thead><tr><th>블록</th><th>역할</th></tr></thead><tbody><tr><td><code>Asset Referencing for R2V</code></td><td>올린 asset이 각각 무엇을 담당하는지 선언</td></tr><tr><td><code>One-Sentence Summary</code></td><td>위의 관통 공식. 한 문장으로 전체를 요약</td></tr><tr><td><code>Detailed Plot Description</code></td><td>Shot 또는 타임스탬프로 나눈 구간별 서술</td></tr><tr><td><code>Additional Notes</code></td><td>전 구간에 일관되게 유지할 것</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">가이드가 이 네 블록을 그대로 시연한 예시가 있다. 공식 문서에 실린 원문 그대로다.</p>



<pre class="wp-block-code"><code>Realistic nature documentary style, natural lighting and shadows. On a warm
afternoon, on a grassy slope in the forest, a chubby panda cub rolls down the hill.

The panda has fluffy, realistic black-and-white fur, a small round body, and clumsy,
adorable movements. The scene is a green forest slope. The ground is covered with
grass, moss, clover, soil, small stones, dry branches, and a few small yellow flowers.
Tall tree trunks and dense woods are softly blurred in the background. The camera is a
low-angle medium-wide shot with a slight handheld feel. The framing remains mostly
stable, keeping the panda in frame at all times.

0s-3s: A panda cub lies on a green grassy slope, its body round and chubby. It begins
to slowly roll sideways down the slope with clumsy movements, gently bending the grass
beneath its body. A light breeze passes through, and sunlight filters through the trees
from the upper left, creating dappled light and shadow.

3s-8s: The panda rolls toward the lower right of the frame and gradually comes to a
stop, shifting from lying on its side to lying on its belly. Its round face turns toward
the camera, and its front paws press into the grass. The panda lies in the foreground
grass, adjusts into a comfortable position, slightly raises and lowers its head, and
makes a soft little humming sound.

Low camera position, slight handheld feel, subtly following the panda as it moves toward
the lower right. Natural depth of field: the foreground grass is slightly blurred, the
panda remains clear, and the background forest is softly out of focus. Natural
environmental audio only, including wind, rustling grass, and the soft plop of the panda
rolling. The overall mood is warm, realistic, and natural.</code></pre>



<p class="wp-block-paragraph">네 문단이 정확히 네 블록에 대응한다. 첫 문단이 한 문장 요약, 둘째 문단이 고정 정보, 셋째와 넷째가 구간별 서술, 마지막 문단이 전 구간 유지 사항이다. 그리고 이 예시가 <strong>초 단위 구간으로 시간을 나누고 있다</strong>는 점을 기억해두자. 바로 다음 장의 주제다.</p>



<p class="wp-block-paragraph">가이드는 이 구조를 이렇게 한 줄로 요약한다. <code>Treat Seedance 2.5 as a visual content producer, and write structured prompts with a visual storytelling mindset.</code> 앞서 인용했던 그 문장이다. 이제 그 말이 무엇을 요구하는지 구체적으로 보일 것이다.</p>



<h2 class="wp-block-heading">초 단위 타임스탬프 — &#8220;샷 번호를 쓰라&#8221;는 조언은 이제 틀렸다</h2>



<p class="wp-block-paragraph">Seedance 프롬프트를 검색해본 사람이라면 이런 조언을 반드시 마주쳤을 것이다. <em>초 단위로 시간을 못 박지 마라. Shot 1, Shot 2로 순서만 지시하고 페이싱은 모델에게 맡겨라.</em></p>



<p class="wp-block-paragraph">이 조언은 틀린 적이 없었다. <strong>2.0까지는 그랬다.</strong></p>



<p class="wp-block-paragraph">2.0 가이드가 직접 그렇게 규정하고 있다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Do not impose strict limits on the duration of each segment; prioritize allowing the model to naturally generate the pacing based on the plot.</p>
</blockquote>



<p class="wp-block-paragraph">같은 문서가 이유까지 밝힌다. <code>The model's support for precise timing (such as 0–3 seconds) is unstable, and forcibly limiting duration may lead to abnormal generation results.</code> 정밀한 시간 지정이 불안정하니 쓰지 말라는 것이다. 합리적인 지침이었다.</p>



<p class="wp-block-paragraph">그런데 2.5 가이드는 정반대를 말한다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Seedance 2.0 does not respond to timestamps and only responds to shot numbers, while Seedance 2.5 supports integer-second timestamps.</p>
</blockquote>



<p class="wp-block-paragraph">2.0은 타임스탬프에 <strong>반응하지 않았고</strong>, 2.5는 정수 초 단위 타임스탬프를 <strong>지원한다.</strong> 개발사가 자기 문서에서 명시적으로 뒤집은 것이다.</p>



<p class="wp-block-paragraph">문제는 이 전환이 시장에 반영되지 않았다는 데 있다. 국내외를 통틀어 상위에 노출되는 Seedance 프롬프트 가이드 상당수가 2.0 시기에 작성된 글이고, 그 글들은 여전히 &#8216;초를 쓰지 말라&#8217;고 가르친다. 심지어 같은 발행사가 2.0 글과 2.5 글을 동시에 운영하면서 서로 모순되는 지침을 방치하는 경우도 있다. 2.5 글에서는 타임스탬프를 &#8216;예외적으로만 쓰는 수단&#8217;으로 격하해두었는데, 정작 타임스탬프 제어는 2.5가 내세운 대표 개선점이다.</p>



<p class="wp-block-paragraph">그렇다면 2.5에서는 초를 어떻게 써야 하는가. 가이드가 세 가지 방식을 명시한다.</p>



<p class="wp-block-paragraph"><strong>구간 지정.</strong> 가장 기본이다. 다만 조건이 하나 붙는다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Clear time intervals. Pay attention to timeline continuity and avoid gaps such as &#8220;0-3s&#8230; 5-6s&#8230;&#8221;.</p>
</blockquote>



<p class="wp-block-paragraph">구간 사이에 구멍을 내지 말라는 뜻이다. <code>0-3초 … 3-7초 … 7-15초</code>처럼 이어 붙인다.</p>



<p class="wp-block-paragraph"><strong>시점 지정.</strong> 특정 순간에 사건을 못 박는다. <em>&#8220;Quick left sideways transition at the 5-second mark.&#8221;</em></p>



<p class="wp-block-paragraph"><strong>상대 시간 지정.</strong> 절대 시각 대신 사건 기준으로 잡는다. <em>&#8220;John stands there blankly. After 3 seconds, everyone around him shakes their head.&#8221;</em></p>



<p class="wp-block-paragraph">기준 단위는 <strong>1초</strong>다. 가이드가 <code>Use 1-second intervals as the basic unit</code>이라고 명시한다. 그리고 한계도 함께 적어두었다. 초당 세 번 고개를 젓는 식의 고빈도 동작을 타임스탬프로 통제하려 들지 말 것. 한 구간에 사건을 너무 적게 배치하면 모델이 자유롭게 지어내고, 너무 많이 밀어넣으면 컷이 과도하게 쪼개지거나 일부가 누락된다.</p>



<p class="wp-block-paragraph">정리하면 이렇다. <strong>초를 쓰되, 초를 정밀 편집점으로 착각하지 않는 것.</strong> 타임스탬프는 프레임 단위 편집 지시가 아니라 사건에 시간을 배분하는 도구다.</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">한 줄로</p>



<p class="wp-block-paragraph">Shot 번호는 여전히 유효하다. 2.5는 둘 다 받는다. 다만 &#8216;초를 쓰면 망가진다&#8217;는 2.0의 경고는 2.5에 적용되지 않는다.</p>
</div>



<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">Reference 지정과 역할 부여</h2>



<p class="wp-block-paragraph">Reference를 올리는 것과 Reference가 작동하는 것은 다른 문제다. 올려두기만 하고 문장에서 호명하지 않으면, 모델은 그 asset을 무엇에 쓸지 판단하지 못한다.</p>



<p class="wp-block-paragraph">2.0 가이드는 주체를 선언하는 문형을 아예 템플릿으로 제공한다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Define [Core_Subject_Features] in &lt;Image/Video_N&gt; as &lt;Subject_N&gt;</p>
</blockquote>



<p class="wp-block-paragraph">여기에 조건이 붙는다. <code>Use 2–3 clear and stable static features (such as clothing, hairstyle, appearance, or category) to describe the subject and ensure it can be uniquely identified.</code> <strong>2~3개의 안정적이고 정적인 특징</strong>으로 지목하라는 것이다. 표정이나 동작처럼 변하는 요소는 식별자가 될 수 없다.</p>



<p class="wp-block-paragraph">2.5는 asset이 여럿일 때의 대응 관계를 목록으로 적으라고 권한다. 가이드가 든 예시는 이런 형태다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><code>Images 1-2 are Character 1 and correspond to Audio 1; Images 3-4 are Character 2 and correspond to Audio 2.</code></p>



<p class="wp-block-paragraph"><code>Image 1 depicts the protagonist John and uses the voice timbre from Audio 1.</code></p>



<p class="wp-block-paragraph"><code>Refer to Image 1 for lighting and filters.</code></p>
</blockquote>



<p class="wp-block-paragraph">세 번째 예시가 특히 중요하다. 이미지 하나를 통째로 참조하는 것이 아니라 <strong>조명과 필터만</strong> 가져오라고 범위를 좁혔다.</p>



<p class="wp-block-paragraph">인물이 여럿이면 라벨을 붙이고 끝까지 그 라벨만 쓴다. 가이드의 예시가 명료하다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Define the tall man in Video 1 as <strong>police officer</strong>, and define the other short man as <strong>thief</strong>.</p>
</blockquote>



<p class="wp-block-paragraph">이후 문장 전체에서 그 인물은 언제나 <code>police officer</code>이고 <code>thief</code>다. &#8216;그 남자&#8217;나 &#8216;키 큰 쪽&#8217;으로 바꿔 부르는 순간 지시가 끊긴다. 같은 문서가 이 원칙을 적용한 예시를 함께 싣고 있다.</p>



<pre class="wp-block-code"><code>Define the tall man in Video 1 as police officer, and define the other short man as
thief. The scene is set in a crowded daytime market, with bright sunlight, many fruit
stalls, and dense pedestrian traffic, creating a lively street-market atmosphere.
Thief runs forward in panic through the crowded market, while police officer follows
closely behind at full speed. The two quickly weave through the stalls. A handheld
camera rapidly tracks forward, with slight realistic camera shake, creating a tense
chase atmosphere.</code></pre>



<p class="wp-block-paragraph">라벨을 정의한 문장과 그 라벨을 쓰는 문장이 하나의 프롬프트 안에 이어져 있다는 점을 보라. 별도의 설정 블록을 만들지 않는다.</p>



<p class="wp-block-paragraph">그리고 <strong>순서가 의미를 갖는다.</strong> 2.0 가이드는 <code>Place important assets first: The more an asset requires precise reference, the earlier it should be placed in the prompt.</code>라고 적어두었다. 번호는 업로드 순서를 따르므로, 업로드 순서 자체가 우선순위 선언이 된다.</p>



<p class="wp-block-paragraph">2.5는 여기에 두 가지를 더 요구한다. 첫째, <strong>무엇을 참조할 것인지까지 명시하라.</strong> <em>&#8220;Refer to the action of casting the spell in Video 1 and the wrap-around camera movement in Video 2.&#8221;</em> 둘째, <strong>asset이 이미 충분히 정확하면 장면을 다시 서술하지 말라.</strong> 손을 든다, 몸을 돌린다 같은 묘사를 덧붙이는 것이 오히려 간섭이 된다.</p>



<p class="wp-block-paragraph">영상에서 동작을 가져오는 경우의 공식 예시는 이렇다.</p>



<pre class="wp-block-code"><code>Refer to the character movements and shot language in Video 1 to create a fight scene
with the character from Image 2 on the left and the character from Image 1 on the right.
Include intense background music.</code></pre>



<p class="wp-block-paragraph"><code>Video 1</code>에서 가져올 것을 <code>character movements and shot language</code>로 한정하고, <code>Image 1</code>과 <code>Image 2</code>는 좌우 배치까지 지정했다. 참조 범위와 배치를 한 문장에 담은 형태다.</p>



<p class="wp-block-paragraph">반대로 하지 말아야 할 것도 명시되어 있다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">It is not recommended to provide mapping information only inside the image itself.</p>
</blockquote>



<p class="wp-block-paragraph">인물 이미지에 이름을 써넣고 프롬프트에서는 그 이름만 부르는 방식이다. 캐릭터 혼동과 중복 생성의 원인이 된다.</p>



<h3 class="wp-block-heading">표기법은 공식 문서 자신도 통일하지 못했다</h3>



<p class="wp-block-paragraph">여기서 솔직하게 밝혀둘 것이 있다. 2.5 가이드가 규정한 표기는 <code>Image 1 / Video 1 / Audio 1</code>이다. 그런데 <strong>같은 문서의 공식 예시 안에서 네 가지 표기가 전부 등장한다.</strong></p>



<figure class="wp-block-table"><table><thead><tr><th>표기</th><th>등장 위치</th></tr></thead><tbody><tr><td><code>Image 1</code></td><td>규정 자체와 다수 예시</td></tr><tr><td><code>@Image 1</code></td><td>편집·확장 예시</td></tr><tr><td><code>@image1</code></td><td>Locked 과업 트리거 예시</td></tr><tr><td><code>[Image 1]</code></td><td>3D clay-model 예시, asset binding 줄</td></tr><tr><td><code>&lt;1pic&gt;</code> … <code>&lt;10pic&gt;</code></td><td>3D clay-model 상세 예시</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">어느 하나가 정답이라고 단정할 근거가 없다. 다만 실무 원칙은 도출된다. <strong>한 프롬프트 안에서는 하나로 통일할 것.</strong> 표기를 섞는 순간 모델이 같은 asset을 다른 것으로 취급할 여지가 생긴다.</p>



<h2 class="wp-block-heading">오디오·대사·자막의 괄호 문법</h2>



<p class="wp-block-paragraph">2.0 가이드는 정보 종류를 문장부호로 구분하는 규약을 표로 제시한다.</p>



<figure class="wp-block-table"><table><thead><tr><th>정보 종류</th><th>기호</th><th>예시</th></tr></thead><tbody><tr><td>음악</td><td><code>（）</code></td><td><code>（fast-paced rock music is playing in the background）</code></td></tr><tr><td>효과음</td><td><code>&lt;&gt;</code></td><td><code>&lt; dog barking can be heard in the distance &gt;</code></td></tr><tr><td>대사</td><td><code>{}</code></td><td><code>{Hello, world}</code></td></tr><tr><td>자막</td><td><code>【】</code></td><td><code>【Chapter One: Departure】</code></td></tr></tbody></table></figure>



<p class="wp-block-paragraph">대사에는 조건이 하나 붙는다. 중국어와 영어가 아닌 언어라면 <strong>언어를 함께 명시</strong>해야 한다. <code>says in Japanese {こんにちは}</code>처럼 쓴다.</p>



<p class="wp-block-paragraph">그런데 여기서 주의할 점이 있다. <strong>2.5 가이드에는 이 표가 없다.</strong> 중괄호 <code>{}</code> 표기 자체가 문서 전체에 한 번도 등장하지 않는다. 대신 2.5는 다른 장치를 제공한다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Supports negative control for subtitles. … Supports negative audio control for finer dimensions, including sound effects, background music (BGM), and dialogue.</p>
</blockquote>



<p class="wp-block-paragraph"><code>Do not add subtitles.</code> <code>No BGM; generate only environmental sounds and action sounds.</code> 처럼 <strong>부정형으로 통제</strong>하는 방식이다. 2.5 가이드는 기본 원칙을 <code>Use positive descriptions whenever possible</code>로 두되, 자막과 오디오에 한해서만 부정 지시를 허용한다고 명시한다.</p>



<p class="wp-block-paragraph">그렇다면 2.5에서 괄호 문법은 폐기된 것인가? 그렇게 단정할 근거는 없다. 2.5 가이드는 <code>Subject reference</code>·<code>Motion reference</code>·<code>Audio reference</code>·<code>Style reference</code>의 사용법이 2.0과 동일하며 상세 예시는 2.0 문서를 참조하라고 안내한다. 다만 <strong>2.5 문서가 직접 보증하는 것은 부정 통제 쪽</strong>이라는 사실은 알고 쓰는 편이 낫다.</p>



<h2 class="wp-block-heading">30초 한 컷을 설계하는 법</h2>



<p class="wp-block-paragraph">2.5의 30초는 2.0의 15초를 두 배로 늘린 것이 아니다. 가이드의 표현으로는 <code>presenting a complete story without multi-segment stitching</code> — 이어 붙이지 않고 하나의 이야기를 담으라는 것이다. 그만큼 설계가 필요해진다.</p>



<p class="wp-block-paragraph">가이드가 제시하는 골격은 앞서 본 네 블록이다. 실제 배치는 이렇게 흐른다.</p>



<pre class="wp-block-code"><code>&#91;1] 한 문장 요약
    Subject + Location + Event + Genre/Style + Camera movement

&#91;2] 고정 정보
    인물 외형, 공간, 카메라 기본 세팅

&#91;3] 구간별 서술
    0-3s: …
    3-8s: …
    8-15s: …

&#91;4] 전 구간 유지 사항
    카메라 성향, 조명, 사운드, 전체 무드</code></pre>



<p class="wp-block-paragraph">구간을 나눌 때 2.0이 제시한 순서 규칙이 여전히 유효하다. 한 구간 안에서는 <strong>카메라 움직임 → 주체의 동작과 표정 → 위치 변화 → 소리</strong> 순으로 적는다.</p>



<p class="wp-block-paragraph">동작 묘사에는 2.5가 별도의 원칙을 둔다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Actions: Give priority to general descriptions … Only write specific details for a few memorable actions, and avoid repeating the same actions.</p>



<p class="wp-block-paragraph">Expressions: Use descriptive sentences and reduce the use of idioms.</p>
</blockquote>



<p class="wp-block-paragraph">동작은 큰 덩어리로 쓰고 인상적인 몇 개만 세부를 적으라는 것이다. 표정은 관용구를 줄이고 서술문으로 쓰라고 한다. 2.0 가이드는 이 원칙을 훨씬 구체적인 표로 제공하는데, 감정을 라벨이 아니라 <strong>관찰 가능한 신체 반응</strong>으로 치환하라는 취지다. &#8216;슬픔&#8217; 대신 *lowering the head, shoulders trembling slightly, eyes reddening, fingers unconsciously clutching the corner of clothing*처럼 쓴다.</p>



<p class="wp-block-paragraph">카메라 용어는 2.5가 목록으로 제공한다. 화면 크기는 <code>extreme wide shot/wide shot/medium shot/medium close-up/close-up</code>, 움직임은 <code>push in/pull out/pan/track/follow/orbit/dive/pull back/tilt up/handheld shake</code>, 앵글은 <code>low angle/overhead shot/first-person perspective</code>다. 목록에 없는 전문 용어를 쓸 때의 규칙도 있다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">For overly niche or technical terms, convert them into [term + descriptive explanation].</p>
</blockquote>



<p class="wp-block-paragraph">용어만 던지지 말고 설명을 붙이라는 것이다. <code>Rack focus</code>를 쓸 것이라면 초점이 어디에서 어디로 옮겨가는지를 함께 적는다.</p>



<h2 class="wp-block-heading">Locked와 Unlocked — 요청이 조용히 무시될 때</h2>



<p class="wp-block-paragraph">이제 2.5가 새로 도입한 구분을 볼 차례다. 이것이 실무에서 가장 자주, 그리고 가장 알아채기 어렵게 실패를 만든다.</p>



<p class="wp-block-paragraph">증상은 대개 이런 식으로 나타난다. 16:9로 뽑으려고 <code>ratio</code>를 지정했는데 결과물이 세로다. 10초를 요청했는데 7초짜리가 나온다. 분명히 파라미터를 넣었고 에러도 없었다. <strong>그런데 반영되지 않았다.</strong></p>



<p class="wp-block-paragraph">원인은 과업 유형이다. 2.5 가이드의 설명은 이렇다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Seedance 2.5 divides tasks into two categories based on whether the input reference assets lock the properties of the output video. Seedance 2.0 does not make this distinction.</p>
</blockquote>



<p class="wp-block-paragraph"><code>Locked</code>는 입력 asset이 출력 타임라인에 그대로 얹히는 경우다. 모델이 입력에 맞추므로 화면비가, 경우에 따라 길이까지 잠긴다. <code>Unlocked</code>는 입력을 의미적 참조로만 쓰므로 화면비와 길이를 직접 지정할 수 있다.</p>



<p class="wp-block-paragraph">Locked에 해당하는 과업은 셋이다.</p>



<figure class="wp-block-table"><table><thead><tr><th>과업</th><th>잠기는 것</th><th>요구되는 값</th></tr></thead><tbody><tr><td>영상 편집</td><td>화면비 <strong>+ 길이</strong></td><td><code>ratio</code>=<code>adaptive</code>, <code>duration</code>=<code>-1</code></td></tr><tr><td>첫/끝 프레임 지정</td><td>화면비</td><td><code>ratio</code>=<code>adaptive</code> (길이는 지정 가능)</td></tr><tr><td>영상 확장</td><td>화면비</td><td><code>ratio</code>=<code>adaptive</code> (길이는 지정 가능)</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">편집의 경우 길이까지 잠긴다. 그리고 완전히 같아지지도 않는다. 가이드는 <code>the output duration may differ slightly from the input, by up to about 0.3 seconds</code>라고 적어두었다. 프레임 처리 방식 때문에 전환 구간이 일부 압축된다는 설명이다. 다만 2.5가 생성한 영상을 다시 편집 입력으로 쓰면 이 차이가 발생하지 않는다.</p>



<p class="wp-block-paragraph">여기서 더 까다로운 부분이 있다. <strong>과업 유형은 프롬프트의 단어로 판정된다.</strong> 편집으로 인식되려면 <code>edit video</code>, <code>add</code>, <code>insert</code>, <code>remove</code>, <code>delete</code>, <code>modify</code>, <code>replace</code>, <code>change to</code> 같은 트리거가 프롬프트에 들어가야 한다. 확장은 <code>extend forward</code>, <code>extend backward</code>, <code>continue</code>, <code>continue from</code>, <code>extend the story</code>다.</p>



<p class="wp-block-paragraph">즉 의도와 다른 단어를 쓰면 모델이 과업을 오판하고, 그 결과 예상과 다른 파라미터 규칙이 적용된다. 영상 여러 개를 올린 경우에는 <code>the model determines which video to edit based on the prompt</code> — 어느 영상을 편집할지도 프롬프트가 결정한다.</p>



<p class="wp-block-paragraph">편집 지시를 쓰는 방식에 대해서도 가이드가 원칙과 예시를 함께 제공한다. 원칙은 <strong>무엇에서 무엇으로 바꿀지를 적으라</strong>는 것이다.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><code>Change the man's action from drinking coffee to mopping the floor from 4-6 seconds in Video 1, and leave the rest of the content unchanged.</code></p>



<p class="wp-block-paragraph"><code>Editing task: Replace the Asian woman on the right in Video 1 with the Latina woman from Image 1.</code></p>
</blockquote>



<p class="wp-block-paragraph">첫 예시는 구간까지 지정했고, 나머지는 건드리지 말라는 문장을 덧붙였다. 두 번째는 <code>Editing task:</code>라는 말로 과업 유형을 아예 앞에 못 박았다. 트리거 단어가 확실히 들어가게 하는 안전장치로 볼 수 있다.</p>



<p class="wp-block-paragraph">편집과 확장에는 출력 포맷 권장도 붙어 있다. <code>It is recommended to set output_format to mov.</code> 색과 밝기, 음영상 연속성이 더 잘 보존된다는 이유다.</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">증상으로 기억하기</p>



<p class="wp-block-paragraph">화면비가 멋대로 바뀌었다면 Locked 과업에 들어간 것이다. 길이가 0.3초 어긋난다면 편집 과업이 정상 동작한 것이다. 지시한 편집이 통째로 무시됐다면 트리거 단어가 없어 편집으로 인식되지 않은 것이다.</p>
</div>



<div style="height:70px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">애니메이션 작업에 맞춘 프롬프트</h2>



<p class="wp-block-paragraph">여기까지가 공식 문서에서 도출한 내용이다. 이제 CineV Creative Team이 애니메이션 작업에서 실제로 쓰는 형태로 옮겨보자. 아래 예시는 공식 문서의 원칙을 따르되 문장 자체는 우리가 작성한 것이다.</p>



<p class="wp-block-paragraph"><strong>캐릭터 하나를 30초 동안 유지하는 경우</strong></p>



<pre class="wp-block-code"><code>Use Images 1 to 3 in order as keyframes.

A hooded courier in a rain-soaked neon alley delivers a sealed package,
2D cel-shaded anime, slow push-in.

Subject 1: the courier in a mustard-yellow hooded jacket with a frayed
left sleeve and a cracked visor. Refer to Image 4 for the character design.
Environment refers to Image 5 for the alley's color and signage.

0-6s: Subject 1 walks toward camera through standing water. Camera pushes
in slowly from a wide shot. Reflected signage ripples underfoot.
6-14s: Subject 1 stops, looks down at the package, and adjusts the strap.
Medium shot, camera holds.
14-24s: Subject 1 raises the visor. Close-up. The face stays consistent
with Image 4.
24-30s: Subject 1 turns away and walks into the alley depth. Camera pulls
back to a wide shot.

Throughout: 2D cel-shaded anime with hand-painted backgrounds, cool cyan
and magenta palette, rain ambience and distant traffic only. No BGM.
No subtitles. Keep the character design consistent with Image 4 in every
shot.</code></pre>



<p class="wp-block-paragraph">이 프롬프트에서 확인할 것은 넷이다. 첫 문장에 keyframe 선언이 왔다. 주체를 2~3개의 정적 특징으로 지목했다. 구간이 끊김 없이 이어진다. 그리고 마지막 블록이 전 구간 유지 사항을 모아둔다. 전부 앞에서 인용한 공식 원칙 그대로다.</p>



<p class="wp-block-paragraph"><strong>동작만 다른 영상에서 가져오는 경우</strong></p>



<pre class="wp-block-code"><code>Refer to the fight choreography and camera work in Video 1 to generate a
rooftop duel between Subject 1 and Subject 2.

Subject 1: the silver-haired swordsman in a black high-collar coat,
refer to Image 1.
Subject 2: the masked opponent in red armor plating, refer to Image 2.
Refer to Image 3 for the rooftop environment and its lighting.

Keep the motion timing consistent with Video 1. 2D anime with strong
key-light rim separation.</code></pre>



<p class="wp-block-paragraph"><code>Refer to … in Video 1</code>이라는 문형은 2.0 가이드가 Motion reference 템플릿으로 제시한 것이다. 무엇을 참조할지를 <code>fight choreography and camera work</code>로 좁혀 적은 것도 2.5의 요구 사항을 따른 것이다.</p>



<p class="wp-block-paragraph">애니메이션 작업에서는 앞서 언급한 제한이 오히려 유리하게 작동한다. 실사 인물 얼굴 업로드가 막혀 있다는 것은, 반대로 말하면 <strong>생성된 캐릭터 디자인을 Reference로 쓰는 흐름이 정공법</strong>이라는 뜻이다. 공식 문서가 제시한 우회 경로 중 첫 번째가 정확히 그것이다.</p>



<h2 class="wp-block-heading">결과가 어긋날 때 점검하는 순서</h2>



<p class="wp-block-paragraph">실패에는 대체로 정해진 원인이 있다. 2.0 가이드의 FAQ가 다루는 증상들이 실무에서 가장 자주 마주치는 것들이고, 아래는 그 처방을 점검 순서로 재배열한 것이다.</p>



<p class="wp-block-paragraph"><strong>캐릭터 얼굴이 중간에 바뀐다.</strong> 2.0 가이드는 이를 <code>ID drift</code>라 부른다. 처방은 얼굴 클로즈업 한 장을 별도로 준비하는 것이다. 표정이 없고, 어깨나 목이나 배경 같은 간섭 요소를 최소화한 정면 얼굴이 가장 좋다. 인물 Reference는 <strong>얼굴 클로즈업 한 장과 전신 사진 한 장이면 충분</strong>하며, 삼면도나 다시점 이미지는 권장되지 않는다.</p>



<p class="wp-block-paragraph"><strong>같은 인물이 화면에 둘 나온다.</strong> 가이드는 이를 <code>twin problem</code>이라 부르고, 프롬프트 말미에 붙이는 전역 제약문을 제공한다. <em>Throughout the video, characters with completely identical appearance, clothing, and accessories are prohibited. Do not generate duplicate avatars or a twin effect.</em> 인물이 넷을 넘어가면 안정성이 떨어진다는 수치도 함께 제시된다.</p>



<p class="wp-block-paragraph"><strong>스타일이 중간에 이탈한다.</strong> 스타일 제약어를 명시적으로 박는다. 2D 일본 애니메이션 스타일인지 3D인지를 문장으로 적는다. 더 확실하게 하려면 Reference 이미지 자체를 목표 스타일로 먼저 변환한 뒤 입력한다.</p>



<p class="wp-block-paragraph"><strong>원치 않는 자막이 붙는다.</strong> <code>Keep it subtitle-free</code> 또는 <code>Avoid generating any text or subtitles</code>를 넣는다. 2.5라면 <code>Do not add subtitles.</code>가 공식 예시다. 참고로 2.0 가이드는 세로 화면이 가로 화면보다 자막 생성 확률이 유의미하게 높다고 적어두었다.</p>



<p class="wp-block-paragraph"><strong>확장할 때마다 화질이 떨어진다.</strong> 확장을 반복해서 쌓지 말라는 것이 가이드의 권고다. 고화질 원본을 Reference로 쓰고, 확장 횟수를 통제한다.</p>



<p class="wp-block-paragraph">그리고 이 모든 것에 앞서 확인할 것이 하나 있다. <strong>asset을 너무 많이 올리지 않았는가.</strong> 2.0 가이드가 권장하는 총량은 4~5개다. 50개를 받는다는 것은 상한일 뿐, 목표치가 아니다.</p>



<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">CineV에서 Seedance 2.5 사용하기</h2>



<p class="wp-block-paragraph">여기까지가 Seedance family를 읽어서 얻을 수 있는 것이다. 남은 것은 이 원칙들을 실제 작업에 옮기는 일인데, 그 과정에서 반복적으로 발목을 잡는 지점이 둘 있다.</p>



<p class="wp-block-paragraph">머릿속에 상이 맺히지 않아 Context를 만들지 못하는 경우, 그리고 상은 있는데 도메인 언어로 옮기지 못하는 경우다. 앞에서 각각 <strong>스토리보드</strong>와 <strong>Prompt Enhance</strong>를 언급했다. 이 둘이 번역 모듈의 앞단과 뒷단을 맡는다.</p>



<p class="wp-block-paragraph">여기에 애니메이션 지향 플랫폼이라는 정체성이 더해진다. 실사 인물 얼굴 제한에 부딪히지 않는 경로로 작업하게 된다는 것, 그리고 3D 기반의 직관적 conditioning으로 &#8216;말로 풀리지 않는 상&#8217;을 다룰 수 있다는 것. 서두에서 말한 그 이야기다.</p>



<p class="wp-block-paragraph">가장 적은 실패로 Seedance 2.5를 써보시기 바란다. <a href="/">CineV는 현재 50% 할인 이벤트를 진행 중이다.</a></p>



<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">자주 묻는 질문</h2>



<p class="wp-block-paragraph"><strong>Seedance 2.5 프롬프트에 초 단위 타임스탬프를 써도 되는가?</strong> 쓸 수 있다. 2.5 가이드가 정수 초 단위 타임스탬프 지원을 명시한다. 기준 단위는 1초이며, 구간 사이에 빈틈을 두지 않는 것이 조건이다.</p>



<p class="wp-block-paragraph"><strong>2.0에서 쓰던 &#8220;Shot 1, Shot 2&#8221; 방식은 2.5에서도 유효한가?</strong> 유효하다. 2.5는 Shot 번호와 타임스탬프를 모두 받는다. 다만 &#8216;초를 쓰면 결과가 불안정해진다&#8217;는 2.0의 경고는 2.5에 적용되지 않는다.</p>



<p class="wp-block-paragraph"><strong>Seedance 2.5는 4K를 지원하는가?</strong> 출력은 지원하지 않는다. 2.5 튜토리얼이 1080p와 4K를 지원하지 않는다고 명시한다. 4K는 입력 이미지의 최대 해상도이며, 4K 출력이 가능한 모델은 Seedance 2.0이다.</p>



<p class="wp-block-paragraph"><strong>한 번에 몇 초까지 만들 수 있는가?</strong> 단일 생성 기준 최대 30초다.</p>



<p class="wp-block-paragraph"><strong>영상 편집 시 화면비와 길이를 바꿀 수 있는가?</strong> 바꿀 수 없다. 편집은 Locked 과업이라 <code>ratio</code>는 <code>adaptive</code>, <code>duration</code>은 <code>-1</code>이어야 한다. 출력 길이는 입력과 최대 0.3초 정도 차이가 날 수 있다.</p>



<p class="wp-block-paragraph"><strong>Reference는 몇 개까지 쓸 수 있는가?</strong> 2.5 기준 총 50개다. 이미지 30장, 영상 10개, 오디오 10개. 다만 2.0 가이드는 총 4~5개를 권장하며, 상한을 채우면 모델이 우선순위를 판단하기 어려워진다고 경고한다.</p>



<p class="wp-block-paragraph"><strong>실사 인물 사진을 Reference로 쓸 수 있는가?</strong> 쓸 수 없다. 공식 문서가 실사 인물 얼굴이 포함된 이미지·영상의 직접 업로드를 지원하지 않는다고 명시한다. 대안으로 모델이 생성한 결과물, 사전 제작된 디지털 캐릭터, 권리 처리가 완료된 소재를 제시한다.</p>



<p class="wp-block-paragraph"><strong>Seedance 2.5 공식 프롬프트 가이드는 어디서 볼 수 있는가?</strong> BytePlus ModelArk 문서에 공개되어 있다. 아래 출처 목록에 전부 링크해두었다.</p>



<h2 class="wp-block-heading">참고한 공식 문서</h2>



<p class="wp-block-paragraph">이 글의 모든 인용은 아래 문서에서 나왔다.</p>



<ul class="wp-block-list">
<li><a href="https://docs.byteplus.com/en/docs/ModelArk/1631633" target="_blank" rel="noreferrer noopener">Seedance-1.0-pro&amp;pro-fast prompt guide — BytePlus ModelArk</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2168087" target="_blank" rel="noreferrer noopener">Seedance-1.5-pro prompt guide — BytePlus ModelArk</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2222480" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.0 series prompt guide — BytePlus ModelArk</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2607689" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.5 prompt guide — BytePlus ModelArk</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2291680" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.0 series tutorial — BytePlus ModelArk</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2607688" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.5 tutorial — BytePlus ModelArk</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/1366799" target="_blank" rel="noreferrer noopener">Video generation tutorial — BytePlus ModelArk</a></li>
</ul>



<p class="wp-block-paragraph">문서는 계속 갱신된다. 이 글은 2026년 8월 기준으로 작성되었다.</p>



<p class="wp-block-paragraph">인용된 문장의 권리는 각 문서의 발행사에 있다.</p>



<p class="wp-block-paragraph"></p>
