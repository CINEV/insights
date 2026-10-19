---
id: 1235
title: "Seedance 2.5を最大限に使いこなす"
slug: "seedance-2-5%e3%82%92%e6%9c%80%e5%a4%a7%e9%99%90%e3%81%ab%e4%bd%bf%e3%81%84%e3%81%93%e3%81%aa%e3%81%99"
path: "/insights/ja/seedance-2-5を最大限に使いこなす/"
date: "2026-08-12T00:17:49"
modified: "2026-08-13T19:01:05"
categories: [20]
tags: []
lang: "ja"
author: 4
excerpt: "この記事は Seedance 2.5 専用である。2.0 向けの記述とどこが違うかは「Seedance 2.5で実際に何が変わったのか」の章にまとめた。 CineVがSeedanceを語る理由 CineVは、アニメーションを最もうまく作れる生成AIプラットフォームを目指している。この一文を少しひねって読むと、別の意味がひとつ立ち上がる。 Seedanceの公式ドキュメントには次の警告がある。Dreamina Seedance 2.5 and Dreamina Seedance 2.0 series models do not support […]"
format: "html"
legacyId: 1235
templateFile: "src/templates/239dfa18afc1.html"
image: "/insights/assets/media/0844bcb56a-seedance2-5-on-cinev-1024x578.png"
readingMinutes: 9
seoTitle: "Seedance 2.5を最大限に使いこなす : CineV"
socialImage: "/insights/assets/media/b33f764b90-seedance2-5-on-cinev-scaled.png"
rssGuid: "https://cinev.com/insights/?p=1235"
rssEnclosure: {"url": "/insights/assets/media/dcfc3a97ab-SD2-5_OneRoom_02-1-1.mp4", "length": 33272361, "type": "video/mp4"}
translationKey: "wordpress-1218"
---

<p class="wp-block-paragraph"><em>この記事は Seedance 2.5 専用である。2.0 向けの記述とどこが違うかは「Seedance 2.5で実際に何が変わったのか」の章にまとめた。</em></p>



<div class="wp-block-uagb-image alignfull uagb-block-136cc885 wp-block-uagb-image--layout-default wp-block-uagb-image--effect-static wp-block-uagb-image--align-full"><figure class="wp-block-uagb-image__figure"><img decoding="async" srcset="/insights/assets/media/841f1bc580-seedance2-5-on-cinev-1-scaled.png ,/insights/assets/media/841f1bc580-seedance2-5-on-cinev-1-scaled.png 780w, /insights/assets/media/841f1bc580-seedance2-5-on-cinev-1-scaled.png 360w" sizes="auto, (max-width: 480px) 150px" src="/insights/assets/media/841f1bc580-seedance2-5-on-cinev-1-scaled.png" alt="" class="uag-image-1236" width="2560" height="1445" title="seedance2.5-on-cinev" loading="lazy" role="img"/></figure></div>



<h2 class="wp-block-heading">CineVがSeedanceを語る理由</h2>



<p class="wp-block-paragraph">CineVは、<a href="/">アニメーションを最もうまく作れる生成AIプラットフォーム</a>を目指している。この一文を少しひねって読むと、別の意味がひとつ立ち上がる。</p>



<p class="wp-block-paragraph">Seedanceの公式ドキュメントには次の警告がある。<code>Dreamina Seedance 2.5 and Dreamina Seedance 2.0 series models do not support direct uploads of reference images or videos containing real human faces.</code> 実写の人物の顔が写った画像や映像はReferenceとして投入できない、という意味である。人物を軸にした制作を考えていた者は、ここで一度つまずくことになる。</p>



<p class="wp-block-paragraph">しかし、この公式の制限をひねって考えてみよう。real human facesではなく、生成されたアニメーションキャラクターを使うAI Animationの領域ならどうか。CineVが掲げるアニメーション志向のAI Creative Platformとしての立ち位置は、まさにこの地点から、Seedanceの潜在能力を余さず引き出す助けになる。</p>



<p class="wp-block-paragraph">ここにCineVの3Dベースの直感的なconditioningが加わると、もうひとつの結び目がほどける。頭の中には像がはっきりあるのに、言葉ではどうしてもほどけずもどかしい、あの感覚。Seedanceというモデルの性能を引き出すには必ず通らねばならない関門だが、多くの人はここで力尽きる。</p>



<p class="wp-block-paragraph">では、この記事はCineVの紹介で終わるのか。そうではない。この記事は、CineVの説明に先立って、Seedance familyそのものを正しく理解してもらうために書かれた。</p>



<h2 class="wp-block-heading">この記事の根拠</h2>



<p class="wp-block-paragraph">開発元がバージョンを重ねる過程で学習データやアラインメント手法をどれだけ変えてきたのかは、外部から確かめる術がない。ただ我々はひとつの仮定を置いて出発した。同じチームが同じ目標に向けて改良を重ねてきたモデル系列であるならば、開発元自身が公開したプロンプトガイドの間にも、バージョンを貫く共通のパターンが残っているはずだ、という仮定である。</p>



<p class="wp-block-paragraph">この記事は、その仮定を1.0から2.5までの公式ドキュメントに実際に突き合わせて得られた結果である。ByteDanceがBytePlus ModelArkで公開したプロンプトガイド4本とチュートリアル3本をすべて読み通しており、本文に引用した文はいずれもその中に存在する。ここにCineV Creative Teamが実務で蓄積した知見を重ねた。</p>



<p class="wp-block-paragraph">最も少ない失敗でSeedance 2.5に到達されることを願う。</p>



<h2 class="wp-block-heading">前提：頭の中に映像がなければならない</h2>



<p class="wp-block-paragraph">Seedance 2.0以降を理解するには、前提をひとつ確実に置いておく必要がある。<strong>このモデルの性能を極限まで使うには、モデルを使うあなたの頭の中に、まず「映像」が存在していなければならない。</strong></p>



<p class="wp-block-paragraph">鶏が先か卵が先か、という話に聞こえるだろう。実際そのとおりである。表現したいsequenceが像として結ばれていなければ、どんな映像を作れと明確に指示する術がない。指示が曖昧であれば、モデルはその空白を任意に埋める。そうして埋められた結果物は、あなたが意図したものではない。</p>



<p class="wp-block-paragraph">これは好みの問題ではない。2.5の公式ガイドは、プロンプト作成原則の一行目にこう明記している。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Treat Seedance 2.5 as a visual content producer, and write structured prompts with a visual storytelling mindset.</p>
</blockquote>



<p class="wp-block-paragraph">Seedanceを「映像制作者」として扱え、という意味である。制作者には企画が要る。明確な指針と役割設定が与えられたときに最良の表現を出すモデルであるならば、その指針を作る主体は結局あなたである。</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">頭の中に像がないなら</p>



<p class="wp-block-paragraph">CineVの<strong>ストーリーボード</strong>機能は、まさにこの地点のために存在する。一行のloglineを入力すれば、sequence全体のハイライトフレームを順に生成してくれる。Contextが不在の状態でContextを組成してくれる道具だと理解すればよい。Seedanceのcapabilityをきちんと引き出したいが、像がまだ曖昧なら、CineVのストーリーボードで先にシーンを具体化してみる <small class="cinev-archived-link-note">(サービス内の作例です。アーカイブではリンクを提供していません。)</small>のもひとつの方法である。</p>
</div>



<div style="height:76px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">像をモデルの言語に移す翻訳モジュール</h2>



<p class="wp-block-paragraph">頭の中に像が結ばれたからといって、すぐにプロンプトが出てくるわけではない。その間に翻訳モジュールがひとつ必要になる。</p>



<p class="wp-block-paragraph">あなたが手にしているのは、<strong>完成した一枚</strong>か、<strong>文章に落とせるsequence</strong>か、それとも<strong>散らばった素材</strong>か。この三つはそれぞれ別の入口から入る。</p>



<div class="wp-block-uagb-image uagb-block-727c083c wp-block-uagb-image--layout-default wp-block-uagb-image--effect-static wp-block-uagb-image--align-none"><figure class="wp-block-uagb-image__figure"><img decoding="async" srcset="/insights/assets/media/077086b00d-flowchart-ja-scaled.png ,/insights/assets/media/077086b00d-flowchart-ja-scaled.png 780w, /insights/assets/media/077086b00d-flowchart-ja-scaled.png 360w" sizes="auto, (max-width: 480px) 150px" src="/insights/assets/media/077086b00d-flowchart-ja-scaled.png" alt="" class="uag-image-1237" width="1700" height="2560" title="flowchart-ja" loading="lazy" role="img"/></figure></div>



<p class="wp-block-paragraph">以下、各段階を順に見ていく。</p>



<h3 class="wp-block-heading">Keyframe reference — そのまま再現されるべき一枚</h3>



<p class="wp-block-paragraph">すでに完成したシーンが一枚、手元にあるとしよう。人物もstyleもactingもlightingもcameraも、すべて申し分ない。であれば、その一枚を結果物にそのまま固定すればよい。このとき用いるのが<code>Keyframe reference</code>である。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Generated visuals align with the keyframes: Input multiple independent images as keyframes, which may include first-frame or last-frame images. The generated video visuals will be relatively strictly aligned with the input images.</p>
</blockquote>



<p class="wp-block-paragraph">複数枚を順に使う場合は、プロンプトの<strong>一文目</strong>に<code>Use Images X to X in order as keyframes.</code>と書けとガイドが明記している。一文目という条件が付いている点を見落としてはならない。</p>



<p class="wp-block-paragraph">同じ目的を果たす別の経路もある。<code>content.role</code>を<code>first_frame</code>または<code>last_frame</code>に指定する方式である。こちらはより強く固定される代わりに代償を伴う。<strong>アスペクト比まで固定される。</strong> 2.5のガイドは、この場合<code>ratio</code>パラメータは<code>adaptive</code>でなければならず、他の値は受け付けないと記している。</p>



<p class="wp-block-paragraph">ここで警告をひとつ添えておきたい。シーン画像は人物・style・acting・lighting・cameraが<strong>すべて結合された</strong>単位である。そのうちひとつでも気に入らない要素があるなら、その一枚を強制する選択は再考すべきである。気に入らないlightingまで一緒に固定されてしまうからだ。</p>



<h3 class="wp-block-heading">Context — 文章として確保されたsequence</h3>



<p class="wp-block-paragraph">気に入るシーン画像はないが、頭の中のsequenceははっきりしている、という場合がある。このとき問うべきことはひとつである。<strong>そのsequenceを映像ドメインの言語で記述できるか。</strong></p>



<p class="wp-block-paragraph">記述できるならContextが確保された状態である。記述できないなら、まだそうではない。この区別が重要なのは、Contextが不在のままReferenceから積み始めると、モデルがその断片をどんな原理で組み立てるべきか判断できないからである。</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">翻訳モジュールがまだないなら</p>



<p class="wp-block-paragraph">ドメイン言語に移す作業そのものに慣れていない場合もあるだろう。CineVの<strong>Prompt Enhance</strong>機能がその翻訳モジュールの役割を代行する。あなたが持っている文章を、モデルが理解できる形に変換してくれる。</p>
</div>



<p class="wp-block-paragraph"></p>



<h3 class="wp-block-heading">Reference — Contextの中のすべての主体</h3>



<p class="wp-block-paragraph">Contextが文章であるなら、Referenceはその文章の主語と目的語にあたる。2.5は一回のリクエストで<strong>最大50個</strong>のReferenceを受け付ける。画像30枚、動画10本、音声10本である。</p>



<p class="wp-block-paragraph">公式ドキュメントが定義するReferenceの種類は七つである。</p>



<figure class="wp-block-table"><table><thead><tr><th>公式名称</th><th>何を参照するか</th></tr></thead><tbody><tr><td><code>Subject reference</code></td><td>人物・物体・場面・仮想キャラクターの外見的同一性および音声</td></tr><tr><td><code>Motion reference</code></td><td>映像から取り出す動きと動的情報</td></tr><tr><td><code>Style reference</code></td><td>画像や映像の視覚的スタイル</td></tr><tr><td><code>Audio reference</code></td><td>音楽・セリフ・声・トーン・音色</td></tr><tr><td><code>Storyboard reference</code></td><td>主体・構図・動作・プロット・場面の展開</td></tr><tr><td><code>Keyframe reference</code></td><td>一枚以上の画像をkeyframeとして使用（前節を参照）</td></tr><tr><td><code>3D clay-model reference/rendering</code></td><td>3Dクレイモデル映像をMotion referenceとして使用</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">この七つは機能上の分類である。企画段階で使うには粒度がやや合わない。そこで、2.0のガイドが提示した<strong>四つの企画上の役割</strong>を併せて置くことを勧める。実際にassetを準備する際にはこちらのほうが手に馴染む。</p>



<figure class="wp-block-table"><table><thead><tr><th>企画上の役割</th><th>担うもの</th></tr></thead><tbody><tr><td><code>Character anchoring</code></td><td>人物の外見を固定する</td></tr><tr><td><code>Scene tone-setting</code></td><td>環境とstyleを固定する</td></tr><tr><td><code>Camera movement reference</code></td><td>画面言語と動きのリズムを固定する</td></tr><tr><td><code>Rhythmic atmosphere</code></td><td>音声で感情と音色を制御する</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">背景と小道具を別立てにしていないのは、抜け落ちたからではない。公式の分類では、両者はいずれも<code>Subject reference</code>に属する。ガイドが &#8220;a person, object, scene, or virtual character&#8221; と明記している。</p>



<h3 class="wp-block-heading">では何個積むべきか</h3>



<p class="wp-block-paragraph">50個を受け付けるからといって、50個を充当せよという意味ではない。むしろ逆である。2.0のガイドはこう釘を刺している。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">It is not recommended to use the full asset limit. Too many assets will make it difficult for the model to judge feature priorities.</p>
</blockquote>



<p class="wp-block-paragraph">同じドキュメントが推奨構成を数値で示している。<strong>合計4〜5個。</strong> 人物画像1〜2枚、場面画像1枚、カメラムーブメントの映像1本、音声1本である。</p>



<p class="wp-block-paragraph">2.5の推奨値は項目別にさらに具体的である。<code>Subject reference</code>を画像で与える場合、1〜8個であれば結果が安定し、9〜12個も試せるが安定性が下がり複数回の試行が必要になることがある、と記されている。音声や映像で与える場合は1〜5個、入力の長さは5〜10秒が適切だとされる。</p>



<p class="wp-block-paragraph">数値を暗記する必要はない。規則はひとつである。<strong>ひとつのassetにひとつの役割。</strong> そして、その役割が本当に必要なassetだけを積む。</p>



<h3 class="wp-block-heading">最後の点検</h3>



<p class="wp-block-paragraph">ここまで来たら、最後にひとつだけ確認すればよい。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Contextの中のすべての主体がReferenceとして積まれており、それぞれが文章の中で自分の名前で呼ばれているか。</p>
</blockquote>



<p class="wp-block-paragraph">ひとつでも欠ければ、モデルはその空白を任意に埋める。それが失敗の正体である。</p>



<figure class="wp-block-video alignfull"><video height="2160" style="aspect-ratio: 3760 / 2160;" width="3760" controls src="/insights/assets/media/dcfc3a97ab-SD2-5_OneRoom_02-1-1.mp4" playsinline></video><figcaption class="wp-element-caption"><a href="/">Seedance 2.5はCineVで利用できます。</a></figcaption></figure>



<div style="height:66px" aria-hidden="true" class="wp-block-spacer"></div>



<p class="wp-block-paragraph"></p>



<h2 class="wp-block-heading">Seedance 2.5で実際に何が変わったのか</h2>



<p class="wp-block-paragraph">ここからが本題である。ただ、本題に入る前に整理しておくことがひとつある。<strong>巷に流れている2.5のスペック情報は互いに食い違っている。</strong></p>



<p class="wp-block-paragraph">ある記事は2.5が4Kを出力すると書き、別の記事は4Kは2.0の話だと反論する。実際にAPIを運用している側は720pだと文書化している。読者の立場からは何を信じるべきか判断がつかない。</p>



<p class="wp-block-paragraph">混乱の発生源は公式ドキュメントの一文である。2.5のガイドはReferenceの入力上限をこう記している。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><strong>Images:</strong> Up to 30 images, with resolution up to 4K.</p>
</blockquote>



<p class="wp-block-paragraph"><strong>この4Kは入力画像の解像度である。</strong> 出力ではない。そして2.5のチュートリアルは出力について正反対に明記している。<code>Seedance 2.5 does not currently support 1080p and 4K resolutions.</code> プラットフォーム全体のチュートリアルもまた、4K出力が可能なモデルはSeedance 2.0のみだと断じている。</p>



<p class="wp-block-paragraph">公式ドキュメントが実際に定めている2.5の境界は次のとおりである。</p>



<figure class="wp-block-table"><table><thead><tr><th>項目</th><th>2.5</th><th>根拠</th></tr></thead><tbody><tr><td>単一生成の最大長</td><td><strong>30秒</strong></td><td>2.5ガイド 概要</td></tr><tr><td>出力解像度</td><td><strong>720p</strong>（1080p・4Kは非対応）</td><td>2.5チュートリアル</td></tr><tr><td>フレームレート</td><td>24 fps</td><td>プラットフォームチュートリアル</td></tr><tr><td>Reference総数</td><td><strong>50個</strong>（画像30・動画10・音声10）</td><td>2.5ガイド</td></tr><tr><td>アスペクト比</td><td>[0.4, 2.5] の範囲で自由</td><td>2.5ガイド</td></tr><tr><td>ネイティブ対応言語</td><td>10言語以上</td><td>2.5ガイド</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">では2.0に比べて実質的に何が改善されたのか。これもまた推測する必要はない。2.5のガイドには<code>Differences from Seedance 2.0</code>という節が丸ごとあり、項目はちょうど四つである。</p>



<ol class="wp-block-list">
<li><code>Seedance 2.0 does not respond to timestamps and only responds to shot numbers, while Seedance 2.5 supports integer-second timestamps.</code></li>



<li><code>Seedance 2.0 does not recommend using multi-view images as subject references, while Seedance 2.5 supports them.</code></li>



<li><code>Seedance 2.0 only supports six fixed output aspect ratios, while Seedance 2.5 can support any output aspect ratio between [0.4, 2.5] by controlling the input assets.</code></li>



<li><code>Seedance 2.5 supports MOV output, which better preserves color consistency, brightness consistency, and audio-visual consistency in extension and editing tasks.</code></li>



<li><code>Seedance 2.5 divides tasks into two categories based on whether the input reference assets lock the properties of the output video. Seedance 2.0 does not make this distinction.</code></li>
</ol>



<p class="wp-block-paragraph">五番目の項目はドキュメントの別の節に記されているが、性格が同じなのでここに並べた。入力assetが出力の属性をロックするか否かでタスクを二つに分けるというもので、2.0にはなかった区別である。</p>



<p class="wp-block-paragraph"><strong>このうち1番と5番が、この記事の残り半分を占める。</strong> どちらも実務で静かに失敗を生む項目だからである。</p>



<h2 class="wp-block-heading">公式ガイド4本が共有するひとつの公式</h2>



<p class="wp-block-paragraph">先に立てた仮定を検証する番である。1.0から2.5まで、開発元自身が公開したプロンプトガイドから「プロンプトの公式」にあたる一文だけを抜き出し、並べてみよう。</p>



<figure class="wp-block-table"><table><thead><tr><th>バージョン</th><th>公式ドキュメントが明記するプロンプトの公式</th></tr></thead><tbody><tr><td>1.0 pro</td><td><code>Beginner: subject+action</code></td></tr><tr><td>1.5 pro</td><td><code>Subject + Movement + Environment (optional) + Camera movement (optional) + Aesthetic description (optional) + Sound (optional)</code></td></tr><tr><td>2.0 series</td><td><code>precise subject + action details + scene/environment + lighting &amp; color tone + camera movement + visual style + image quality + constraints</code></td></tr><tr><td>2.5</td><td><code>Subject + Location + Event + Genre/Style + Camera movement...</code></td></tr></tbody></table></figure>



<p class="wp-block-paragraph">スロットの数は二つから六つへ、さらに八つに増えたのち五つに減っている。名称も少しずつ違う。Movementがaction detailsになり、やがてEventになる。</p>



<p class="wp-block-paragraph"><strong>しかし順序は四度とも同一である。</strong></p>



<p class="wp-block-paragraph">主体が最初に来る。その主体が何をするかが二番目。どこで起きるかが三番目。cameraはその後ろである。二年をまたぐ四つのドキュメントを通じて、この配列だけは一度も動かなかった。開発元が意図的に維持したのか、それとも同じデータプールの上でモデルがそう学習されてきた結果なのかは、外部からは判断できない。ただ、<strong>四度繰り返されたものを偶然と見るのは難しい。</strong></p>



<p class="wp-block-paragraph">ここから実務上の結論が出る。どのバージョンを使っていようと、プロンプトで行き詰まったらこの順序に立ち返ればよい。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">誰が → 何をするか → どこで → cameraはどう動くか</p>
</blockquote>



<p class="wp-block-paragraph">2.5はここにもう一枚を重ねる。上の公式は2.5では<code>One-Sentence Summary</code>という名の<strong>最初のブロック</strong>にすぎず、全体は四ブロック構成である。</p>



<figure class="wp-block-table"><table><thead><tr><th>ブロック</th><th>役割</th></tr></thead><tbody><tr><td><code>Asset Referencing for R2V</code></td><td>投入したassetがそれぞれ何を担うかを宣言する</td></tr><tr><td><code>One-Sentence Summary</code></td><td>上記の公式。全体を一文で要約する</td></tr><tr><td><code>Detailed Plot Description</code></td><td>Shotまたはタイムスタンプで区切った区間ごとの記述</td></tr><tr><td><code>Additional Notes</code></td><td>全区間で一貫して保つべきもの</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">ガイドはこの四ブロックを自ら実演した例を載せている。公式ドキュメントの原文そのままである。</p>



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



<p class="wp-block-paragraph">四つの段落がちょうど四ブロックに対応している。第一段落が一文要約、第二段落が固定情報、第三・第四が区間ごとの記述、最終段落が全区間で保つべき事項である。そして、この例が<strong>秒単位の区間で時間を分けている</strong>点を覚えておきたい。次章の主題である。</p>



<p class="wp-block-paragraph">ガイドはこの構造を一行でこう要約している。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Treat Seedance 2.5 as a visual content producer, and write structured prompts with a visual storytelling mindset.</p>
</blockquote>



<p class="wp-block-paragraph">先に引用したのと同じ一文である。それが何を要求しているのか、いまなら具体的に見えるはずだ。</p>



<h2 class="wp-block-heading">秒単位タイムスタンプ — 「Shot番号を使え」という助言はもう正しくない</h2>



<p class="wp-block-paragraph">Seedanceのプロンプトを検索したことがあれば、必ずこの助言に出会っているはずである。<em>秒単位で時間を打つな。Shot 1、Shot 2と順序だけを指示して、ペーシングはモデルに委ねよ。</em></p>



<p class="wp-block-paragraph">この助言が間違っていたことはない。<strong>2.0まではそうだった。</strong></p>



<p class="wp-block-paragraph">2.0のガイドが直接そう定めている。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Do not impose strict limits on the duration of each segment; prioritize allowing the model to naturally generate the pacing based on the plot.</p>
</blockquote>



<p class="wp-block-paragraph">同じドキュメントが理由まで明かしている。<code>The model's support for precise timing (such as 0–3 seconds) is unstable, and forcibly limiting duration may lead to abnormal generation results.</code> 精密な時間指定は不安定だから使うな、というわけである。合理的な指針だった。</p>



<p class="wp-block-paragraph">ところが2.5のガイドは正反対を述べる。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Seedance 2.0 does not respond to timestamps and only responds to shot numbers, while Seedance 2.5 supports integer-second timestamps.</p>
</blockquote>



<p class="wp-block-paragraph">2.0はタイムスタンプに<strong>反応しなかった</strong>。2.5は整数秒単位のタイムスタンプを<strong>サポートする</strong>。開発元が自らのドキュメントで明示的にひっくり返したのである。</p>



<p class="wp-block-paragraph">問題は、この転換が市場に反映されていないことにある。上位に表示されるSeedanceのプロンプトガイドの相当数は2.0の時期に書かれた記事であり、それらはいまだに「秒を使うな」と教えている。同じ発行元が2.0の記事と2.5の記事を並行して運用しながら、互いに矛盾する指針を放置している例さえある。2.5の記事ではタイムスタンプを「例外的に使う手段」に格下げしているのだが、タイムスタンプ制御こそ2.5が掲げた代表的な改善点である。</p>



<p class="wp-block-paragraph">では2.5では秒をどう使うべきか。ガイドが三つの方式を明記している。</p>



<p class="wp-block-paragraph"><strong>区間指定。</strong> 最も基本である。ただし条件がひとつ付く。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Clear time intervals. Pay attention to timeline continuity and avoid gaps such as &#8220;0-3s&#8230; 5-6s&#8230;&#8221;.</p>
</blockquote>



<p class="wp-block-paragraph">区間と区間の間に穴を空けるな、という意味である。<code>0-3秒 … 3-7秒 … 7-15秒</code>のように繋げる。</p>



<p class="wp-block-paragraph"><strong>時点指定。</strong> 特定の瞬間に出来事を打ち込む。<em>&#8220;Quick left sideways transition at the 5-second mark.&#8221;</em></p>



<p class="wp-block-paragraph"><strong>相対時間指定。</strong> 絶対時刻ではなく出来事を基準に取る。<em>&#8220;John stands there blankly. After 3 seconds, everyone around him shakes their head.&#8221;</em></p>



<p class="wp-block-paragraph">基準単位は<strong>1秒</strong>である。ガイドが<code>Use 1-second intervals as the basic unit</code>と明記している。そして限界も併記されている。一秒に三度首を振るような高頻度の動作をタイムスタンプで制御しようとしてはならない。ひとつの区間に出来事を少なく置きすぎるとモデルが自由に作り込み、詰め込みすぎるとカットが過剰に割れるか一部が脱落する。</p>



<p class="wp-block-paragraph">まとめるとこうなる。<strong>秒を使え。ただし秒を精密な編集点と取り違えるな。</strong> タイムスタンプはフレーム単位の編集指示ではなく、出来事に時間を配分する道具である。</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">一行で</p>



<p class="wp-block-paragraph">Shot番号はいまも有効である。2.5は両方を受け付ける。ただし「秒を使うと壊れる」という2.0の警告は2.5には当てはまらない。</p>
</div>



<h2 class="wp-block-heading">Referenceの指定と役割の付与</h2>



<p class="wp-block-paragraph">Referenceを投入することと、Referenceが機能することは別の問題である。投入しただけで文章の中で呼ばなければ、モデルはそのassetを何に使うべきか判断できない。</p>



<p class="wp-block-paragraph">2.0のガイドは主体を宣言する文型をテンプレートとして提供している。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Define [Core_Subject_Features] in &lt;Image/Video_N&gt; as &lt;Subject_N&gt;</p>
</blockquote>



<p class="wp-block-paragraph">ここに条件が付く。<code>Use 2–3 clear and stable static features (such as clothing, hairstyle, appearance, or category) to describe the subject and ensure it can be uniquely identified.</code> <strong>2〜3個の安定した静的特徴</strong>で指し示せ、ということである。表情や動作のように変化する要素は識別子になり得ない。</p>



<p class="wp-block-paragraph">2.5はassetが複数ある場合の対応関係をリストで書くことを勧めている。ガイドが挙げた例はこうした形である。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><code>Images 1-2 are Character 1 and correspond to Audio 1; Images 3-4 are Character 2 and correspond to Audio 2.</code></p>



<p class="wp-block-paragraph"><code>Image 1 depicts the protagonist John and uses the voice timbre from Audio 1.</code></p>



<p class="wp-block-paragraph"><code>Refer to Image 1 for lighting and filters.</code></p>
</blockquote>



<p class="wp-block-paragraph">三つ目の例がとりわけ重要である。画像を丸ごと参照するのではなく、<strong>照明とフィルターだけ</strong>に範囲を絞っている。</p>



<p class="wp-block-paragraph">人物が複数いる場合はラベルを付け、最後までそのラベルだけを使う。ガイドの例が明快である。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Define the tall man in Video 1 as <strong>police officer</strong>, and define the other short man as <strong>thief</strong>.</p>
</blockquote>



<p class="wp-block-paragraph">以降、文章全体を通じてその人物は常に<code>police officer</code>であり<code>thief</code>である。「あの男」や「背の高いほう」に呼び替えた瞬間、指示は切れる。同じドキュメントがこの原則を適用した例を併載している。</p>



<pre class="wp-block-code"><code>Define the tall man in Video 1 as police officer, and define the other short man as
thief. The scene is set in a crowded daytime market, with bright sunlight, many fruit
stalls, and dense pedestrian traffic, creating a lively street-market atmosphere.
Thief runs forward in panic through the crowded market, while police officer follows
closely behind at full speed. The two quickly weave through the stalls. A handheld
camera rapidly tracks forward, with slight realistic camera shake, creating a tense
chase atmosphere.</code></pre>



<p class="wp-block-paragraph">ラベルを定義した文と、そのラベルを使う文が、ひとつのプロンプトの中に続けて置かれている点に注目したい。別途の設定ブロックは作らない。</p>



<p class="wp-block-paragraph">そして<strong>順序が意味を持つ。</strong> 2.0のガイドは<code>Place important assets first: The more an asset requires precise reference, the earlier it should be placed in the prompt.</code>と記している。番号は投入順に従うため、投入順そのものが優先度の宣言になる。</p>



<p class="wp-block-paragraph">2.5はここにさらに二つを要求する。第一に、<strong>何を参照させるのかまで明示せよ。</strong> <em>&#8220;Refer to the action of casting the spell in Video 1 and the wrap-around camera movement in Video 2.&#8221;</em> 第二に、<strong>assetがすでに十分正確であれば、場面を改めて記述するな。</strong> 手を上げる、体を回す、といった描写を付け足すことがかえって干渉になる。</p>



<p class="wp-block-paragraph">映像から動きを取り出す場合の公式の例はこうである。</p>



<pre class="wp-block-code"><code>Refer to the character movements and shot language in Video 1 to create a fight scene
with the character from Image 2 on the left and the character from Image 1 on the right.
Include intense background music.</code></pre>



<p class="wp-block-paragraph"><code>Video 1</code>から取り出すものを<code>character movements and shot language</code>に限定し、<code>Image 1</code>と<code>Image 2</code>は左右の配置まで指定している。参照範囲と配置をひとつの文に収めた形である。</p>



<p class="wp-block-paragraph">やってはならないことも明記されている。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">It is not recommended to provide mapping information only inside the image itself.</p>
</blockquote>



<p class="wp-block-paragraph">人物画像に名前を書き込み、プロンプトではその名前だけを呼ぶ方式である。キャラクターの取り違えと重複生成の原因になる。</p>



<h3 class="wp-block-heading">表記法は公式ドキュメント自身が統一できていない</h3>



<p class="wp-block-paragraph">ここで正直に明かしておくべきことがある。2.5のガイドが定めた表記は<code>Image 1 / Video 1 / Audio 1</code>である。ところが<strong>同じドキュメントの公式例の中に、四つの表記がすべて登場する。</strong></p>



<figure class="wp-block-table"><table><thead><tr><th>表記</th><th>登場箇所</th></tr></thead><tbody><tr><td><code>Image 1</code></td><td>規定そのものと大半の例</td></tr><tr><td><code>@Image 1</code></td><td>編集・拡張の例</td></tr><tr><td><code>@image1</code></td><td>Lockedタスクのトリガー例</td></tr><tr><td><code>[Image 1]</code></td><td>3D clay-modelの例、asset binding行</td></tr><tr><td><code>&lt;1pic&gt;</code> … <code>&lt;10pic&gt;</code></td><td>3D clay-modelの詳細例</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">どれかひとつが正解だと断ずる根拠はない。ただし実務上の原則は導き出せる。<strong>ひとつのプロンプトの中では一種類に統一すること。</strong> 表記を混ぜた瞬間、モデルが同じassetを別物として扱う余地が生まれる。</p>



<h2 class="wp-block-heading">音声・セリフ・字幕の括弧文法</h2>



<p class="wp-block-paragraph">2.0のガイドは、情報の種類を記号で区別する規約を表として提示している。</p>



<figure class="wp-block-table"><table><thead><tr><th>情報の種類</th><th>記号</th><th>例</th></tr></thead><tbody><tr><td>音楽</td><td><code>（）</code></td><td><code>（fast-paced rock music is playing in the background）</code></td></tr><tr><td>効果音</td><td><code>&lt;&gt;</code></td><td><code>&lt; dog barking can be heard in the distance &gt;</code></td></tr><tr><td>セリフ</td><td><code>{}</code></td><td><code>{Hello, world}</code></td></tr><tr><td>字幕</td><td><code>【】</code></td><td><code>【Chapter One: Departure】</code></td></tr></tbody></table></figure>



<p class="wp-block-paragraph">セリフには条件がひとつ付く。中国語と英語以外の言語であれば、<strong>言語を併記</strong>しなければならない。<code>says in Japanese {こんにちは}</code>のように書く。</p>



<p class="wp-block-paragraph">ただし注意すべき点がある。<strong>2.5のガイドにはこの表がない。</strong> 波括弧<code>{}</code>という表記自体がドキュメント全体に一度も現れない。代わりに2.5は別の仕組みを用意している。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Supports negative control for subtitles. … Supports negative audio control for finer dimensions, including sound effects, background music (BGM), and dialogue.</p>
</blockquote>



<p class="wp-block-paragraph"><code>Do not add subtitles.</code> <code>No BGM; generate only environmental sounds and action sounds.</code> のように<strong>否定形で制御</strong>する方式である。2.5のガイドは基本原則を<code>Use positive descriptions whenever possible</code>と置いたうえで、字幕と音声に限って否定指示を許容すると明記している。</p>



<p class="wp-block-paragraph">では2.5で括弧文法は廃止されたのか。そう断ずる根拠はない。2.5のガイドは<code>Subject reference</code>・<code>Motion reference</code>・<code>Audio reference</code>・<code>Style reference</code>の使い方が2.0と同一であり、詳細な例は2.0のドキュメントを参照せよと案内している。ただ、<strong>2.5のドキュメントが直接保証しているのは否定制御のほう</strong>だという事実は、知ったうえで使うほうがよい。</p>



<h2 class="wp-block-heading">30秒ワンショットを設計する</h2>



<p class="wp-block-paragraph">2.5の30秒は、2.0の15秒を二倍にしたものではない。ガイドの表現では<code>presenting a complete story without multi-segment stitching</code> — 繋ぎ合わせずにひとつの物語を収めよ、ということである。その分だけ設計が要る。</p>



<p class="wp-block-paragraph">骨格は先に見た四ブロックである。実際の配置はこう流れる。</p>



<pre class="wp-block-code"><code>&#91;1] 一文要約
    Subject + Location + Event + Genre/Style + Camera movement

&#91;2] 固定情報
    人物の外見、空間、カメラの基本設定

&#91;3] 区間ごとの記述
    0-3s: …
    3-8s: …
    8-15s: …

&#91;4] 全区間で保つ事項
    カメラの性向、照明、サウンド、全体のムード</code></pre>



<p class="wp-block-paragraph">区間を分ける際、2.0が示した順序の規則はいまも有効である。ひとつの区間の中では<strong>カメラの動き → 主体の動作と表情 → 位置の変化 → 音</strong>の順に書く。</p>



<p class="wp-block-paragraph">動作の描写について、2.5は別途の原則を置いている。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Actions: Give priority to general descriptions … Only write specific details for a few memorable actions, and avoid repeating the same actions.</p>



<p class="wp-block-paragraph">Expressions: Use descriptive sentences and reduce the use of idioms.</p>
</blockquote>



<p class="wp-block-paragraph">動作は大きな塊で書き、印象的なものだけ細部を記せということである。表情は慣用句を減らし記述文で書けとある。2.0のガイドはこの原則をはるかに具体的な表で提供しており、その趣旨は感情をラベルではなく<strong>観察可能な身体反応</strong>に置き換えよということである。「悲しみ」ではなく <em>lowering the head, shoulders trembling slightly, eyes reddening, fingers unconsciously clutching the corner of clothing</em> のように書く。</p>



<p class="wp-block-paragraph">カメラ用語は2.5がリストで提供している。画面サイズは<code>extreme wide shot/wide shot/medium shot/medium close-up/close-up</code>、動きは<code>push in/pull out/pan/track/follow/orbit/dive/pull back/tilt up/handheld shake</code>、アングルは<code>low angle/overhead shot/first-person perspective</code>である。リストにない専門用語を使う場合の規則もある。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">For overly niche or technical terms, convert them into [term + descriptive explanation].</p>
</blockquote>



<p class="wp-block-paragraph">用語だけを投げず、説明を添えよということである。<code>Rack focus</code>を使うなら、焦点がどこからどこへ移るのかを併記する。</p>



<h2 class="wp-block-heading">LockedとUnlocked — リクエストが黙って無視されるとき</h2>



<p class="wp-block-paragraph">2.5が新たに導入した区別を見る番である。これが実務で最も頻繁に、そして最も気づきにくい形で失敗を生む。</p>



<p class="wp-block-paragraph">症状はたいていこう現れる。16:9で出そうと<code>ratio</code>を指定したのに結果物が縦になっている。10秒を要求したのに7秒のものが返ってくる。たしかにパラメータを入れたし、エラーも出なかった。<strong>それなのに反映されていない。</strong></p>



<p class="wp-block-paragraph">原因はタスクの種類である。2.5のガイドの説明はこうだ。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Seedance 2.5 divides tasks into two categories based on whether the input reference assets lock the properties of the output video. Seedance 2.0 does not make this distinction.</p>
</blockquote>



<p class="wp-block-paragraph"><code>Locked</code>は入力assetが出力のタイムラインにそのまま載る場合である。モデルが入力に合わせるため、アスペクト比が、場合によっては長さまで固定される。<code>Unlocked</code>は入力を意味的な参照としてのみ使うため、アスペクト比と長さを自分で指定できる。</p>



<p class="wp-block-paragraph">Lockedに該当するタスクは三つである。</p>



<figure class="wp-block-table"><table><thead><tr><th>タスク</th><th>固定されるもの</th><th>要求される値</th></tr></thead><tbody><tr><td>映像編集</td><td>アスペクト比 <strong>+ 長さ</strong></td><td><code>ratio</code>=<code>adaptive</code>, <code>duration</code>=<code>-1</code></td></tr><tr><td>最初/最後のフレーム指定</td><td>アスペクト比</td><td><code>ratio</code>=<code>adaptive</code>（長さは指定可）</td></tr><tr><td>映像の拡張</td><td>アスペクト比</td><td><code>ratio</code>=<code>adaptive</code>（長さは指定可）</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">編集の場合は長さまで固定される。しかも完全に同じになるわけでもない。ガイドは<code>the output duration may differ slightly from the input, by up to about 0.3 seconds</code>と記している。フレーム処理の仕組み上、遷移区間が一部圧縮されるという説明である。ただし2.5が生成した映像を再び編集の入力に使えば、この差は生じない。</p>



<p class="wp-block-paragraph">さらに厄介な部分がある。<strong>タスクの種類はプロンプトの単語で判定される。</strong> 編集として認識されるには<code>edit video</code>、<code>add</code>、<code>insert</code>、<code>remove</code>、<code>delete</code>、<code>modify</code>、<code>replace</code>、<code>change to</code>といったトリガーがプロンプトに入っていなければならない。拡張は<code>extend forward</code>、<code>extend backward</code>、<code>continue</code>、<code>continue from</code>、<code>extend the story</code>である。</p>



<p class="wp-block-paragraph">つまり意図と異なる単語を使えばモデルがタスクを誤判定し、その結果として想定と違うパラメータ規則が適用される。映像を複数投入した場合は<code>the model determines which video to edit based on the prompt</code> — どの映像を編集するかもプロンプトが決める。</p>



<p class="wp-block-paragraph">編集指示の書き方についても、ガイドは原則と例を併せて提供している。原則は<strong>何から何へ変えるのかを書け</strong>というものである。</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><code>Change the man's action from drinking coffee to mopping the floor from 4-6 seconds in Video 1, and leave the rest of the content unchanged.</code></p>



<p class="wp-block-paragraph"><code>Editing task: Replace the Asian woman on the right in Video 1 with the Latina woman from Image 1.</code></p>
</blockquote>



<p class="wp-block-paragraph">一つ目は区間まで指定し、残りは触るなという文を添えている。二つ目は<code>Editing task:</code>という語でタスクの種類を冒頭に打ち込んでいる。トリガー語が確実に入るようにする安全装置と見ることができる。</p>



<p class="wp-block-paragraph">編集と拡張には出力フォーマットの推奨も付いている。<code>It is recommended to set output_format to mov.</code> 色と明るさ、音と映像の連続性がより良く保たれるという理由である。</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">症状で覚える</p>



<p class="wp-block-paragraph">アスペクト比が勝手に変わったならLockedタスクに入っている。長さが0.3秒ずれるなら編集タスクが正常に動作している。指示した編集が丸ごと無視されたなら、トリガー語がなく編集として認識されなかったのである。</p>
</div>



<div style="height:66px" aria-hidden="true" class="wp-block-spacer"></div>



<div class="wp-block-uagb-call-to-action uagb-block-b720f71d wp-block-button"><div class="uagb-cta__wrap"><h3 class="uagb-cta__title">Seedance 2.5を実際の制作フローに取り入れる</h3><p class="uagb-cta__desc">CineVのStoryboardでシーンを整理し、Prompt Enhanceでプロンプトを整えてみましょう。</p></div><div class="uagb-cta__buttons"><a href="https://cinev.com/?utm_source=blog&amp;utm_medium=content&amp;utm_campaign=seedance_2_5_guide&amp;utm_content=end" class="uagb-cta__button-link-wrapper wp-block-button__link" target="_self" rel="noopener noreferrer">CineVで始める<svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504.3 273.6l-112.1 104c-6.992 6.484-17.18 8.218-25.94 4.406c-8.758-3.812-14.42-12.45-14.42-21.1L351.9 288H32C14.33 288 .0002 273.7 .0002 255.1S14.33 224 32 224h319.9l0-72c0-9.547 5.66-18.19 14.42-22c8.754-3.809 18.95-2.075 25.94 4.41l112.1 104C514.6 247.9 514.6 264.1 504.3 273.6z"></path></svg></a></div></div>



<div style="height:66px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">アニメーション制作に合わせたプロンプト</h2>



<p class="wp-block-paragraph">ここまでが公式ドキュメントから導いた内容である。これをCineV Creative Teamがアニメーション制作で実際に使う形に移してみよう。以下の例は公式の原則に従っているが、文章そのものは我々が書いたものである。</p>



<p class="wp-block-paragraph"><strong>キャラクター一人を30秒間保持する場合</strong></p>



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



<p class="wp-block-paragraph">このプロンプトで確認すべきは四点である。一文目にkeyframeの宣言が来ている。主体を2〜3個の静的特徴で指し示している。区間が途切れずに繋がっている。そして最後のブロックが全区間で保つ事項をまとめている。いずれも先に引用した公式原則そのままである。</p>



<p class="wp-block-paragraph"><strong>動きだけを別の映像から取る場合</strong></p>



<pre class="wp-block-code"><code>Refer to the fight choreography and camera work in Video 1 to generate a
rooftop duel between Subject 1 and Subject 2.

Subject 1: the silver-haired swordsman in a black high-collar coat,
refer to Image 1.
Subject 2: the masked opponent in red armor plating, refer to Image 2.
Refer to Image 3 for the rooftop environment and its lighting.

Keep the motion timing consistent with Video 1. 2D anime with strong
key-light rim separation.</code></pre>



<p class="wp-block-paragraph"><code>Refer to … in Video 1</code>という文型は2.0のガイドがMotion referenceのテンプレートとして示したものである。何を参照するかを<code>fight choreography and camera work</code>に絞って書いたのも、2.5の要求に従ったものである。</p>



<p class="wp-block-paragraph">アニメーション制作においては、冒頭で述べた制限がむしろ有利に働く。実写の人物の顔を投入できないということは、裏を返せば<strong>生成されたキャラクターデザインをReferenceとして使う流れが正攻法</strong>だという意味である。公式ドキュメントが提示した回避経路のうち一つ目が、まさにそれである。</p>



<h2 class="wp-block-heading">結果がずれたときの点検順序</h2>



<p class="wp-block-paragraph">失敗にはたいてい決まった原因がある。2.0のガイドのFAQが扱う症状が実務で最も頻繁に出会うものであり、以下はその処方を点検の順序に並べ替えたものである。</p>



<p class="wp-block-paragraph"><strong>キャラクターの顔が途中で変わる。</strong> 2.0のガイドはこれを<code>ID drift</code>と呼ぶ。処方は顔のクローズアップを一枚、別途用意することである。表情がなく、肩や首や背景といった干渉要素を最小化した正面の顔が最も良い。人物のReferenceは<strong>顔のクローズアップ一枚と全身写真一枚があれば十分</strong>であり、三面図や多視点画像は推奨されない。</p>



<p class="wp-block-paragraph"><strong>同じ人物が画面に二人現れる。</strong> ガイドはこれを<code>twin problem</code>と呼び、プロンプトの末尾に付ける全域制約を提供している。<em>Throughout the video, characters with completely identical appearance, clothing, and accessories are prohibited. Do not generate duplicate avatars or a twin effect.</em> 人物が四人を超えると安定性が落ちるという数値も併記されている。</p>



<p class="wp-block-paragraph"><strong>スタイルが途中で逸脱する。</strong> スタイルの制約語を明示的に打ち込む。2Dの日本アニメスタイルなのか3Dなのかを文章で書く。より確実にするなら、Reference画像自体を目標のスタイルに変換してから投入する。</p>



<p class="wp-block-paragraph"><strong>望まない字幕が付く。</strong> <code>Keep it subtitle-free</code>または<code>Avoid generating any text or subtitles</code>を入れる。2.5であれば<code>Do not add subtitles.</code>が公式の例である。なお2.0のガイドは、縦画面が横画面より字幕の生成確率が有意に高いと記している。</p>



<p class="wp-block-paragraph"><strong>拡張のたびに画質が落ちる。</strong> 拡張を繰り返し重ねるなというのがガイドの勧告である。高画質の原本をReferenceとして使い、拡張の回数を制御する。</p>



<p class="wp-block-paragraph">そしてこれらすべてに先立って確認すべきことがひとつある。<strong>assetを多く投入しすぎていないか。</strong> 2.0のガイドが推奨する総量は4〜5個である。50個を受け付けるというのは上限にすぎず、目標値ではない。</p>



<h2 class="wp-block-heading">CineVでSeedance 2.5を使う</h2>



<p class="wp-block-paragraph">ここまでがSeedance familyを読み込んで得られるものである。残るのはこれらの原則を実際の制作に移すことだが、その過程で繰り返し足を引っ張る地点が二つある。</p>



<p class="wp-block-paragraph">頭の中に像が結ばれずContextを作れない場合と、像はあるがドメイン言語に移せない場合である。先にそれぞれ<strong>ストーリーボード</strong>と<strong>Prompt Enhance</strong>に触れた。この二つが翻訳モジュールの前段と後段を担う。</p>



<p class="wp-block-paragraph">そこにアニメーション志向のプラットフォームという立ち位置が加わる。実写の人物の顔という制限に突き当たらない経路で作業できること、そして3Dベースの直感的なconditioningで「言葉にならない像」を扱えること。冒頭で述べたのがその話である。</p>



<p class="wp-block-paragraph">最小限の失敗でSeedance 2.5を使いこなせることを願っている。<a href="/">CineVでは現在50%オフキャンペーンを実施中です。</a></p>



<p class="wp-block-paragraph"></p>



<h2 class="wp-block-heading">よくある質問</h2>



<p class="wp-block-paragraph"><strong>Seedance 2.5のプロンプトで秒単位のタイムスタンプを使ってよいか。</strong> 使える。2.5のガイドが整数秒単位のタイムスタンプへの対応を明記している。基準単位は1秒で、区間の間に隙間を空けないことが条件である。</p>



<p class="wp-block-paragraph"><strong>2.0で使っていた「Shot 1, Shot 2」の方式は2.5でも有効か。</strong> 有効である。2.5はShot番号とタイムスタンプの両方を受け付ける。ただし「秒を使うと結果が不安定になる」という2.0の警告は2.5には当てはまらない。</p>



<p class="wp-block-paragraph"><strong>Seedance 2.5は4Kに対応しているか。</strong> 出力は対応していない。2.5のチュートリアルが1080pと4Kに非対応と明記している。4Kは入力画像の最大解像度であり、4K出力が可能なモデルはSeedance 2.0である。</p>



<p class="wp-block-paragraph"><strong>一度に何秒まで作れるか。</strong> 単一生成で最大30秒である。</p>



<p class="wp-block-paragraph"><strong>映像編集の際にアスペクト比と長さを変えられるか。</strong> 変えられない。編集はLockedタスクであるため<code>ratio</code>は<code>adaptive</code>、<code>duration</code>は<code>-1</code>でなければならない。出力の長さは入力と最大0.3秒程度ずれることがある。</p>



<p class="wp-block-paragraph"><strong>Referenceは何個まで使えるか。</strong> 2.5で合計50個である。画像30枚、動画10本、音声10本。ただし2.0のガイドは合計4〜5個を推奨しており、上限まで埋めるとモデルが優先度を判断しにくくなると警告している。</p>



<p class="wp-block-paragraph"><strong>実写の人物写真をReferenceとして使えるか。</strong> 使えない。公式ドキュメントが、実写の人物の顔を含む画像・映像の直接投入に対応していないと明記している。代替として、モデルが生成した結果物、事前に用意されたデジタルキャラクター、権利処理済みの素材の三つを挙げている。</p>



<p class="wp-block-paragraph"><strong>Seedance 2.5の公式プロンプトガイドはどこで読めるか。</strong> BytePlus ModelArkのドキュメントで公開されている。すべて下記にリンクしている。</p>



<h2 class="wp-block-heading">参照した公式ドキュメント</h2>



<p class="wp-block-paragraph">この記事の引用はすべて下記のドキュメントから採られている。</p>



<ul class="wp-block-list">
<li><a href="https://docs.byteplus.com/en/docs/ModelArk/1631633" target="_blank" rel="noreferrer noopener">Seedance-1.0-pro&amp;pro-fast prompt guide（BytePlus ModelArk）</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2168087" target="_blank" rel="noreferrer noopener">Seedance-1.5-pro prompt guide（BytePlus ModelArk）</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2222480" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.0 series prompt guide（BytePlus ModelArk）</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2607689" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.5 prompt guide（BytePlus ModelArk）</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2291680" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.0 series tutorial（BytePlus ModelArk）</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2607688" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.5 tutorial（BytePlus ModelArk）</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/1366799" target="_blank" rel="noreferrer noopener">Video generation tutorial（BytePlus ModelArk）</a></li>
</ul>



<p class="wp-block-paragraph">ドキュメントは継続的に更新される。この記事は2026年8月時点の内容にもとづく。引用した文の権利は各ドキュメントの発行元に帰属する。</p>
