---
id: 1231
title: "Empowering Seedance 2.5: From Vision to Sequence"
slug: "empowering-seedance-2-5-from-vision-to-sequence"
path: "/insights/empowering-seedance-2-5-from-vision-to-sequence/"
date: "2026-08-12T00:02:31"
modified: "2026-08-13T19:04:05"
categories: [10]
tags: []
lang: "en"
author: 4
excerpt: "A prompt guide built from ByteDance’s four official Seedance guides. Why CineV is writing about Seedance CineV is built to […]"
format: "html"
legacyId: 1231
templateFile: "src/templates/bcdb31b1df1e.html"
image: "/insights/assets/media/0844bcb56a-seedance2-5-on-cinev-1024x578.png"
readingMinutes: 28
seoTitle: "Empowering Seedance 2.5: From Vision to Sequence : CineV"
socialImage: "/insights/assets/media/b33f764b90-seedance2-5-on-cinev-scaled.png"
rssGuid: "https://cinev.com/insights/?p=1231"
rssEnclosure: {"url": "/insights/assets/media/dcfc3a97ab-SD2-5_OneRoom_02-1-1.mp4", "length": 33272361, "type": "video/mp4"}
translationKey: "wordpress-1218"
---

<p class="wp-block-paragraph"><em>A prompt guide built from ByteDance&#8217;s four official Seedance guides.</em></p>



<figure class="wp-block-image alignfull size-large"><img loading="lazy" decoding="async" width="1024" height="578" src="/insights/assets/media/0844bcb56a-seedance2-5-on-cinev-1024x578.png" alt="" class="wp-image-1222" srcset="/insights/assets/media/0844bcb56a-seedance2-5-on-cinev-1024x578.png 1024w, /insights/assets/media/b8b8a6356a-seedance2-5-on-cinev-300x169.png 300w, /insights/assets/media/3a9c56b2c1-seedance2-5-on-cinev-768x433.png 768w, /insights/assets/media/3dd9ae274b-seedance2-5-on-cinev-1536x867.png 1536w, /insights/assets/media/8c086f183d-seedance2-5-on-cinev-2048x1156.png 2048w" sizes="auto, (max-width: 1024px) 100vw, 1024px" /></figure>



<h2 class="wp-block-heading">Why CineV is writing about Seedance</h2>



<p class="wp-block-paragraph">CineV is built to be <a href="/">the generative AI platform that makes animation best</a>. Read that sentence sideways and a second meaning falls out.</p>



<p class="wp-block-paragraph">The official Seedance documentation carries this warning: <code>Dreamina Seedance 2.5 and Dreamina Seedance 2.0 series models do not support direct uploads of reference images or videos containing real human faces.</code> Photographs and footage of real human faces cannot be used as reference material. Anyone planning character-driven work hits that wall on day one.</p>



<p class="wp-block-paragraph">But turn the restriction over and look at the other side. What if the characters are not real human faces at all? What if they are generated animation characters, which is exactly what AI animation work runs on? CineV&#8217;s identity as an animation-first AI creative platform starts precisely here, and it is what lets you reach the full range of what Seedance can do.</p>



<p class="wp-block-paragraph">Add CineV&#8217;s 3D-based intuitive conditioning and a second knot comes loose. That maddening experience where the image in your head is perfectly clear and no combination of words will bring it out. Getting past that is a mandatory checkpoint on the way to Seedance&#8217;s real capability, and it is where most people give up.</p>



<p class="wp-block-paragraph">So is this article just a CineV pitch? No. Before any of the platform talk, this article exists to help you understand the Seedance family itself.</p>



<h2 class="wp-block-heading">What this article is built on</h2>



<p class="wp-block-paragraph">There is no way for anyone outside ByteDance to verify how much the training data and alignment methods changed from version to version. So we started from an assumption. If a single team has been improving one model family toward one goal, then the prompt guides that team published should carry a common pattern that survives across versions.</p>



<p class="wp-block-paragraph">This article is what happened when we tested that assumption against the official documentation from 1.0 through 2.5. We read all four prompt guides and all three tutorials ByteDance published on BytePlus ModelArk, and every sentence quoted here comes from inside them. On top of that sits what the CineV Creative Team has learned in production.</p>



<p class="wp-block-paragraph">We hope you reach Seedance 2.5 with the fewest failed generations possible.</p>



<h2 class="wp-block-heading">The premise: the video has to exist in your head first</h2>



<p class="wp-block-paragraph">Understanding anything after Seedance 2.0 requires one premise up front. <strong>To use this model to its limit, the video has to exist in your head before it exists anywhere else.</strong></p>



<p class="wp-block-paragraph">That will sound like a chicken-and-egg problem. It is one. If the sequence you want has not resolved into an image in your mind, there is no way to give a clear instruction about it. And when the instruction is vague, the model fills the gap on its own terms. What comes back is not what you wanted.</p>



<p class="wp-block-paragraph">This is not a matter of taste. The official 2.5 guide opens its prompting principles with this line.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Treat Seedance 2.5 as a visual content producer, and write structured prompts with a visual storytelling mindset.</p>
</blockquote>



<p class="wp-block-paragraph">Treat it as a producer, in other words. Producers need a brief. If this is a model that performs at its best when given clear direction and defined roles, then the person who has to supply that direction is you.</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">If the image is not there yet</p>



<p class="wp-block-paragraph">CineV&#8217;s storyboard feature exists for exactly this gap. Give it a one-line logline and it produces the highlight frames of the entire sequence in order. Think of it as a way to create context when you have none. If you want to unlock Seedance&#8217;s full potential but the image in your head is still blurry, start by shaping the scene with CineV Storyboard. <small class="cinev-archived-link-note">(Service example; the original link is not available in this archive.)</small></p>
</div>



<div style="height:62px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">The module that translates the image into the model&#8217;s language</h2>



<p class="wp-block-paragraph">Having the image does not immediately produce a prompt. Something has to sit in between and translate.</p>



<p class="wp-block-paragraph">What you are holding is one of three things: <strong>a finished frame</strong>, <strong>a sequence you can put into sentences</strong>, or <strong>a pile of scattered material</strong>. Each one enters through a different door.</p>



<div class="wp-block-uagb-image uagb-block-5aaba704 wp-block-uagb-image--layout-default wp-block-uagb-image--effect-static wp-block-uagb-image--align-none"><figure class="wp-block-uagb-image__figure"><img decoding="async" srcset="/insights/assets/media/c727b1e43a-flowchart-en-scaled.png ,/insights/assets/media/c727b1e43a-flowchart-en-scaled.png 780w, /insights/assets/media/c727b1e43a-flowchart-en-scaled.png 360w" sizes="auto, (max-width: 480px) 150px" src="/insights/assets/media/c727b1e43a-flowchart-en-scaled.png" alt="" class="uag-image-1232" width="1675" height="2560" title="flowchart-en" loading="lazy" role="img"/></figure></div>



<p class="wp-block-paragraph">Each stage in turn.</p>



<h3 class="wp-block-heading">Keyframe reference: the frame that must survive intact</h3>



<p class="wp-block-paragraph">Suppose you already have a finished frame in hand. The character, the style, the acting, the lighting, the camera: all of it works. In that case you pin that frame directly into the output. The instrument for this is <code>Keyframe reference</code>.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Generated visuals align with the keyframes: Input multiple independent images as keyframes, which may include first-frame or last-frame images. The generated video visuals will be relatively strictly aligned with the input images.</p>
</blockquote>



<p class="wp-block-paragraph">To use several frames in sequence, the guide says to write <code>Use Images X to X in order as keyframes.</code> as the <strong>first sentence</strong> of the prompt. That condition on placement is not decoration. Do not skip past it.</p>



<p class="wp-block-paragraph">There is a second route to the same destination. Set <code>content.role</code> to <code>first_frame</code> or <code>last_frame</code>. This binds harder, and it charges you for the privilege. <strong>The aspect ratio locks along with it.</strong> The 2.5 guide states that in this case the <code>ratio</code> parameter must be <code>adaptive</code> and no other value is accepted.</p>



<p class="wp-block-paragraph">One warning belongs here. A scene image is a unit with the character, style, acting, lighting and camera <strong>all fused together</strong>. If even one of those elements does not work for you, reconsider forcing that frame. The lighting you dislike gets pinned right alongside the parts you wanted.</p>



<h3 class="wp-block-heading">Context: the sequence you can put into sentences</h3>



<p class="wp-block-paragraph">Sometimes there is no scene image you like, but the sequence in your head is perfectly clear. The question to ask at that point is single. <strong>Can you describe that sequence in the language of the video domain?</strong></p>



<p class="wp-block-paragraph">If you can, Context is secured. If you cannot, it is not. This distinction matters because starting to load References without Context leaves the model no principle by which to assemble the pieces.</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">If the translation module is missing</p>



<p class="wp-block-paragraph">Putting things into domain language is a skill in itself, and not everyone has it. CineV&#8217;s <strong>Prompt Enhance</strong> stands in for that module. It converts the sentences you have into a form the model understands.</p>
</div>



<p class="wp-block-paragraph"></p>



<h3 class="wp-block-heading">Reference: every subject inside the Context</h3>



<p class="wp-block-paragraph">If Context is the sentence, References are its subjects and objects. Seedance 2.5 accepts <strong>up to 50</strong> reference assets in a single request: 30 images, 10 videos, 10 audio clips.</p>



<p class="wp-block-paragraph">The official documentation defines seven kinds.</p>



<figure class="wp-block-table"><table><thead><tr><th>Official name</th><th>What it references</th></tr></thead><tbody><tr><td><code>Subject reference</code></td><td>Appearance identity and voice of a person, object, scene, or virtual character</td></tr><tr><td><code>Motion reference</code></td><td>Movement and dynamic information taken from video</td></tr><tr><td><code>Style reference</code></td><td>The visual style of an image or video</td></tr><tr><td><code>Audio reference</code></td><td>Music, dialogue, voice, tone, timbre</td></tr><tr><td><code>Storyboard reference</code></td><td>Subjects, composition, actions, plot, scene progression</td></tr><tr><td><code>Keyframe reference</code></td><td>One or more images used as keyframes (see the previous section)</td></tr><tr><td><code>3D clay-model reference/rendering</code></td><td>3D clay-model video used as a motion reference</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">These seven are a functional taxonomy. For planning purposes the grain is slightly wrong. Set them next to the <strong>four planning roles</strong> from the 2.0 guide, which are far more usable when you are actually assembling assets.</p>



<figure class="wp-block-table"><table><thead><tr><th>Planning role</th><th>What it does</th></tr></thead><tbody><tr><td><code>Character anchoring</code></td><td>Locks the character&#8217;s appearance</td></tr><tr><td><code>Scene tone-setting</code></td><td>Locks the environment and style</td></tr><tr><td><code>Camera movement reference</code></td><td>Locks the shot language and rhythm of motion</td></tr><tr><td><code>Rhythmic atmosphere</code></td><td>Controls emotion and timbre through audio</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">Note that backgrounds and props are not broken out separately. That is not an omission. In the official taxonomy both belong to <code>Subject reference</code>. The guide spells it out as &#8220;a person, object, scene, or virtual character.&#8221;</p>



<h3 class="wp-block-heading">So how many should you load?</h3>



<p class="wp-block-paragraph">Accepting 50 is not an instruction to supply 50. It is close to the opposite. The 2.0 guide is blunt about it.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">It is not recommended to use the full asset limit. Too many assets will make it difficult for the model to judge feature priorities.</p>
</blockquote>



<p class="wp-block-paragraph">The same document gives a recommended configuration as a number. <strong>Four to five total.</strong> One or two character images, one scene image, one camera-movement video, one audio clip.</p>



<p class="wp-block-paragraph">The 2.5 recommendations are more granular. Supplying <code>Subject reference</code> as images works well at one to eight subjects; nine to twelve is worth attempting but stability drops and you may need several runs. Supplied as audio or video, one to five works better, with an input duration of five to ten seconds.</p>



<p class="wp-block-paragraph">You do not need to memorise the numbers. There is one rule. <strong>One role per asset.</strong> And load only the assets whose role you actually need.</p>



<h3 class="wp-block-heading">The last check</h3>



<p class="wp-block-paragraph">Once you are here, one thing remains to verify.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Is every subject inside the Context loaded as a Reference, and is each of them called by its own name inside the sentence?</p>
</blockquote>



<p class="wp-block-paragraph">Miss one and the model fills the gap on its own terms. That is what failure actually is.</p>



<figure class="wp-block-video alignfull"><video height="2160" style="aspect-ratio: 3760 / 2160;" width="3760" controls src="/insights/assets/media/dcfc3a97ab-SD2-5_OneRoom_02-1-1.mp4" playsinline></video><figcaption class="wp-element-caption"><a href="/">Seedance 2.5 is available on CineV.</a></figcaption></figure>



<p class="wp-block-paragraph"></p>



<p class="wp-block-paragraph"></p>



<h2 class="wp-block-heading">What actually changed in Seedance 2.5</h2>



<p class="wp-block-paragraph">This is where the real material begins. Before it, one thing needs clearing up. <strong>The 2.5 specifications circulating online contradict each other.</strong></p>



<p class="wp-block-paragraph">Some articles say 2.5 outputs 4K. Others say 4K belongs to 2.0. The companies actually running the API document it as 720p. A reader has no way to know which to believe.</p>



<p class="wp-block-paragraph">The confusion traces back to a single sentence in the official documentation. Here is how the 2.5 guide states the reference input limits.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><strong>Images:</strong> Up to 30 images, with resolution up to 4K.</p>
</blockquote>



<p class="wp-block-paragraph"><strong>That 4K is the resolution of the input images.</strong> Not the output. And the 2.5 tutorial states the opposite about output in plain terms: <code>Seedance 2.5 does not currently support 1080p and 4K resolutions.</code> The platform-wide tutorial confirms that the only model capable of 4K output is Seedance 2.0.</p>



<p class="wp-block-paragraph">Here are the boundaries the official documentation actually sets for 2.5.</p>



<figure class="wp-block-table"><table><thead><tr><th>Item</th><th>2.5</th><th>Source</th></tr></thead><tbody><tr><td>Maximum length, single generation</td><td><strong>30 seconds</strong></td><td>2.5 guide, overview</td></tr><tr><td>Output resolution</td><td><strong>720p</strong> (no 1080p, no 4K)</td><td>2.5 tutorial</td></tr><tr><td>Frame rate</td><td>24 fps</td><td>Platform tutorial</td></tr><tr><td>Reference assets</td><td><strong>50 total</strong> (30 image · 10 video · 10 audio)</td><td>2.5 guide</td></tr><tr><td>Aspect ratio</td><td>Free within the range [0.4, 2.5]</td><td>2.5 guide</td></tr><tr><td>Native languages</td><td>More than 10</td><td>2.5 guide</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">So what improved in real terms over 2.0? This does not require guesswork either. The 2.5 guide contains a section called <code>Differences from Seedance 2.0</code>, and it lists exactly four items.</p>



<ol class="wp-block-list">
<li><code>Seedance 2.0 does not respond to timestamps and only responds to shot numbers, while Seedance 2.5 supports integer-second timestamps.</code></li>



<li><code>Seedance 2.0 does not recommend using multi-view images as subject references, while Seedance 2.5 supports them.</code></li>



<li><code>Seedance 2.0 only supports six fixed output aspect ratios, while Seedance 2.5 can support any output aspect ratio between [0.4, 2.5] by controlling the input assets.</code></li>



<li><code>Seedance 2.5 supports MOV output, which better preserves color consistency, brightness consistency, and audio-visual consistency in extension and editing tasks.</code></li>



<li><code>Seedance 2.5 divides tasks into two categories based on whether the input reference assets lock the properties of the output video. Seedance 2.0 does not make this distinction.</code></li>
</ol>



<p class="wp-block-paragraph">The fifth item appears in a different section of the document, but it belongs with the others. Tasks are now split in two according to whether the input assets lock the properties of the output, a distinction that did not exist in 2.0.</p>



<p class="wp-block-paragraph"><strong>Items one and five take up the rest of this article.</strong> Both of them manufacture failures quietly.</p>



<h2 class="wp-block-heading">The single formula shared by all four official guides</h2>



<p class="wp-block-paragraph">Time to test the assumption we started with. From each official prompt guide, 1.0 through 2.5, pull out only the sentence that states the prompt formula, and set them side by side.</p>



<figure class="wp-block-table"><table><thead><tr><th>Version</th><th>The prompt formula as the official documentation states it</th></tr></thead><tbody><tr><td>1.0 pro</td><td><code>Beginner: subject+action</code></td></tr><tr><td>1.5 pro</td><td><code>Subject + Movement + Environment (optional) + Camera movement (optional) + Aesthetic description (optional) + Sound (optional)</code></td></tr><tr><td>2.0 series</td><td><code>precise subject + action details + scene/environment + lighting &amp; color tone + camera movement + visual style + image quality + constraints</code></td></tr><tr><td>2.5</td><td><code>Subject + Location + Event + Genre/Style + Camera movement...</code></td></tr></tbody></table></figure>



<p class="wp-block-paragraph">The slot count goes from two to six, up to eight, then back down to five. The names shift too. Movement becomes action details, then becomes Event.</p>



<p class="wp-block-paragraph"><strong>But the order is identical in all four.</strong></p>



<p class="wp-block-paragraph">The subject comes first. What the subject is doing comes second. Where it happens comes third. Camera comes after that. Across two years and four documents, that arrangement never moved once. Whether ByteDance held it deliberately, or whether it emerged because the models kept learning from the same pool of data, is not something we can determine from outside. What we can say is that <strong>four repetitions is difficult to read as coincidence.</strong></p>



<p class="wp-block-paragraph">The practical conclusion follows. Whatever version you are on, when a prompt stops working, return to this order.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Who → doing what → where → and how the camera behaves</p>
</blockquote>



<p class="wp-block-paragraph">Version 2.5 wraps one more layer around it. The formula above is only the <strong>first block</strong> in 2.5, where it is called <code>One-Sentence Summary</code>. The full structure has four blocks.</p>



<figure class="wp-block-table"><table><thead><tr><th>Block</th><th>Role</th></tr></thead><tbody><tr><td><code>Asset Referencing for R2V</code></td><td>Declare what each uploaded asset is responsible for</td></tr><tr><td><code>One-Sentence Summary</code></td><td>The formula above. The whole piece in one sentence</td></tr><tr><td><code>Detailed Plot Description</code></td><td>Segment-by-segment description, divided by Shot or by timestamp</td></tr><tr><td><code>Additional Notes</code></td><td>What should hold constant across every segment</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">The guide demonstrates these four blocks with an example of its own. This is the original, verbatim.</p>



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



<p class="wp-block-paragraph">Four paragraphs mapping onto four blocks. The first is the one-sentence summary, the second holds the fixed information, the third and fourth are the segment descriptions, and the last collects what stays constant. And note that this example <strong>divides its time into second-based intervals.</strong> That is the subject of the next section.</p>



<p class="wp-block-paragraph">Here is how the guide summarizes the whole structure in one line.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Treat Seedance 2.5 as a visual content producer, and write structured prompts with a visual storytelling mindset.</p>
</blockquote>



<p class="wp-block-paragraph">The same sentence quoted earlier. What it is asking for should be concrete now.</p>



<h2 class="wp-block-heading">Integer-second timestamps: why &#8220;use shot numbers, not timecodes&#8221; is now wrong</h2>



<p class="wp-block-paragraph">Anyone who has searched for Seedance prompting advice has run into this rule. <em>Do not pin exact seconds. Label your shots, Shot 1 and Shot 2, and let the model find the pacing.</em></p>



<p class="wp-block-paragraph">That advice was never wrong. <strong>It was correct through 2.0.</strong></p>



<p class="wp-block-paragraph">The 2.0 guide states it directly.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Do not impose strict limits on the duration of each segment; prioritize allowing the model to naturally generate the pacing based on the plot.</p>
</blockquote>



<p class="wp-block-paragraph">The same document gives its reasoning: <code>The model's support for precise timing (such as 0–3 seconds) is unstable, and forcibly limiting duration may lead to abnormal generation results.</code> Precise timing was unstable, so do not use it. That was a sensible instruction.</p>



<p class="wp-block-paragraph">The 2.5 guide says the reverse.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Seedance 2.0 does not respond to timestamps and only responds to shot numbers, while Seedance 2.5 supports integer-second timestamps.</p>
</blockquote>



<p class="wp-block-paragraph">Version 2.0 <strong>did not respond</strong> to timestamps. Version 2.5 <strong>supports</strong> them at integer-second resolution. The vendor reversed its own guidance in its own documentation.</p>



<p class="wp-block-paragraph">The problem is that the market has not absorbed the change. A large share of the Seedance prompting guides currently ranking were written in the 2.0 era, and they still teach you not to use seconds. In some cases a single publisher runs a 2.0 article and a 2.5 article side by side with contradictory instructions and never retracts either. Their 2.5 article demotes timestamps to an occasional tool, on the very version where timestamp control is a headline improvement.</p>



<p class="wp-block-paragraph">So how should seconds be used in 2.5? The guide names three methods.</p>



<p class="wp-block-paragraph"><strong>Interval control.</strong> The default approach, with one condition attached.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Clear time intervals. Pay attention to timeline continuity and avoid gaps such as &#8220;0-3s&#8230; 5-6s&#8230;&#8221;.</p>
</blockquote>



<p class="wp-block-paragraph">Do not leave holes between intervals. Chain them: <code>0-3 seconds … 3-7 seconds … 7-15 seconds</code>.</p>



<p class="wp-block-paragraph"><strong>Point control.</strong> Pin an event to a specific moment. <em>&#8220;Quick left sideways transition at the 5-second mark.&#8221;</em></p>



<p class="wp-block-paragraph"><strong>Relative control.</strong> Anchor to an event rather than to absolute time. <em>&#8220;John stands there blankly. After 3 seconds, everyone around him shakes their head.&#8221;</em></p>



<p class="wp-block-paragraph">The base unit is one second. The guide states <code>Use 1-second intervals as the basic unit</code>. It records the limits as well. Do not try to control high-frequency motion through timestamps, such as shaking a head three times per second. Put too little into an interval and the model improvises freely; pack too much in and the result either fragments into excessive cuts or drops part of the plot.</p>



<p class="wp-block-paragraph">The summary is this. <strong>Use seconds, but do not mistake seconds for frame-accurate edit points.</strong> A timestamp allocates time to events. It is not a cut list.</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">In one line</p>



<p class="wp-block-paragraph">Shot numbers still work. Version 2.5 accepts both. What no longer applies to 2.5 is the 2.0-era warning that seconds will break your generation.</p>
</div>



<h2 class="wp-block-heading">Declaring References and assigning their roles</h2>



<p class="wp-block-paragraph">Uploading a Reference and having a Reference take effect are two different things. Upload it without naming it in the sentence, and the model has no way to determine what to do with it.</p>



<p class="wp-block-paragraph">The 2.0 guide supplies a sentence pattern for declaring a subject.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Define [Core_Subject_Features] in &lt;Image/Video_N&gt; as &lt;Subject_N&gt;</p>
</blockquote>



<p class="wp-block-paragraph">A condition comes attached: <code>Use 2–3 clear and stable static features (such as clothing, hairstyle, appearance, or category) to describe the subject and ensure it can be uniquely identified.</code> <strong>Two or three stable, static features.</strong> Anything that changes, an expression or a gesture, cannot serve as an identifier.</p>



<p class="wp-block-paragraph">Version 2.5 asks you to spell out the correspondences as a list when several assets are in play. The examples it gives look like this.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><code>Images 1-2 are Character 1 and correspond to Audio 1; Images 3-4 are Character 2 and correspond to Audio 2.</code></p>



<p class="wp-block-paragraph"><code>Image 1 depicts the protagonist John and uses the voice timbre from Audio 1.</code></p>



<p class="wp-block-paragraph"><code>Refer to Image 1 for lighting and filters.</code></p>
</blockquote>



<p class="wp-block-paragraph">The third one matters most. It does not reference the image wholesale. It narrows the scope to the lighting and filters only.</p>



<p class="wp-block-paragraph">When there are multiple characters, label them and use nothing but those labels from then on. The guide&#8217;s example is clean.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Define the tall man in Video 1 as <strong>police officer</strong>, and define the other short man as <strong>thief</strong>.</p>
</blockquote>



<p class="wp-block-paragraph">For the rest of the prompt that person is always <code>police officer</code>, always <code>thief</code>. Switch to &#8220;the man&#8221; or &#8220;the taller one&#8221; and the instruction breaks. The same document carries a worked example applying the principle.</p>



<pre class="wp-block-code"><code>Define the tall man in Video 1 as police officer, and define the other short man as
thief. The scene is set in a crowded daytime market, with bright sunlight, many fruit
stalls, and dense pedestrian traffic, creating a lively street-market atmosphere.
Thief runs forward in panic through the crowded market, while police officer follows
closely behind at full speed. The two quickly weave through the stalls. A handheld
camera rapidly tracks forward, with slight realistic camera shake, creating a tense
chase atmosphere.</code></pre>



<p class="wp-block-paragraph">Notice that the sentence defining the labels and the sentences using them sit inside one continuous prompt. There is no separate setup block.</p>



<p class="wp-block-paragraph"><strong>Order carries meaning.</strong> The 2.0 guide states <code>Place important assets first: The more an asset requires precise reference, the earlier it should be placed in the prompt.</code> Numbering follows upload order, which makes the upload order itself a declaration of priority.</p>



<p class="wp-block-paragraph">Version 2.5 adds two more requirements. First, <strong>state what you are referencing it for.</strong> <em>&#8220;Refer to the action of casting the spell in Video 1 and the wrap-around camera movement in Video 2.&#8221;</em> Second, <strong>when the asset is already accurate enough, stop describing the scene again.</strong> Adding &#8220;he raises a hand, he turns around&#8221; on top becomes interference rather than instruction.</p>



<p class="wp-block-paragraph">Here is the official example for pulling motion out of a video.</p>



<pre class="wp-block-code"><code>Refer to the character movements and shot language in Video 1 to create a fight scene
with the character from Image 2 on the left and the character from Image 1 on the right.
Include intense background music.</code></pre>



<p class="wp-block-paragraph">What to take from <code>Video 1</code> is narrowed to <code>character movements and shot language</code>, and <code>Image 1</code> and <code>Image 2</code> are assigned left and right positions. Reference scope and blocking, in one sentence.</p>



<p class="wp-block-paragraph">The documentation is equally explicit about what not to do.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">It is not recommended to provide mapping information only inside the image itself.</p>
</blockquote>



<p class="wp-block-paragraph">Writing a name onto a character image and then referring only to that name in the prompt. It causes character confusion and duplicate generation.</p>



<h3 class="wp-block-heading">The official documentation could not standardize its own notation</h3>



<p class="wp-block-paragraph">Something needs stating plainly here. The notation the 2.5 guide prescribes is <code>Image 1 / Video 1 / Audio 1</code>. And yet <strong>four different notations appear across the official examples in that same document.</strong></p>



<figure class="wp-block-table"><table><thead><tr><th>Notation</th><th>Where it appears</th></tr></thead><tbody><tr><td><code>Image 1</code></td><td>The prescription itself, and most examples</td></tr><tr><td><code>@Image 1</code></td><td>Editing and extension examples</td></tr><tr><td><code>@image1</code></td><td>Locked-task trigger examples</td></tr><tr><td><code>[Image 1]</code></td><td>3D clay-model examples, asset binding lines</td></tr><tr><td><code>&lt;1pic&gt;</code> … <code>&lt;10pic&gt;</code></td><td>Detailed 3D clay-model example</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">There is no basis for declaring any one of them correct. A working principle does follow, though. <strong>Pick one and hold it for the length of a prompt.</strong> The moment you mix notations, you give the model room to treat one asset as two.</p>



<h2 class="wp-block-heading">Bracket syntax for audio, dialogue and subtitles</h2>



<p class="wp-block-paragraph">The 2.0 guide provides a convention for separating information types by punctuation, presented as a table.</p>



<figure class="wp-block-table"><table><thead><tr><th>Information type</th><th>Symbol</th><th>Example</th></tr></thead><tbody><tr><td>Music</td><td><code>（）</code></td><td><code>（fast-paced rock music is playing in the background）</code></td></tr><tr><td>Sound effect</td><td><code>&lt;&gt;</code></td><td><code>&lt; dog barking can be heard in the distance &gt;</code></td></tr><tr><td>Dialogue</td><td><code>{}</code></td><td><code>{Hello, world}</code></td></tr><tr><td>Subtitles</td><td><code>【】</code></td><td><code>【Chapter One: Departure】</code></td></tr></tbody></table></figure>



<p class="wp-block-paragraph">Dialogue carries one condition. For any language other than Chinese or English, <strong>the language has to be named</strong>: <code>says in Japanese {こんにちは}</code>.</p>



<p class="wp-block-paragraph">There is something to watch here. <strong>The 2.5 guide does not contain this table.</strong> The curly-brace notation does not appear anywhere in that document. What 2.5 provides instead is a different instrument.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Supports negative control for subtitles. … Supports negative audio control for finer dimensions, including sound effects, background music (BGM), and dialogue.</p>
</blockquote>



<p class="wp-block-paragraph">Control by negation: <code>Do not add subtitles.</code> or <code>No BGM; generate only environmental sounds and action sounds.</code> The 2.5 guide sets its general rule as <code>Use positive descriptions whenever possible</code>, and permits negative instructions only for subtitles and audio.</p>



<p class="wp-block-paragraph">So has the bracket syntax been retired in 2.5? There is no basis for saying so. The 2.5 guide notes that subject, motion, audio and style reference usage is unchanged from 2.0 and points to the 2.0 document for detailed examples. What is worth knowing is that <strong>the mechanism 2.5 itself vouches for is negative control.</strong></p>



<h2 class="wp-block-heading">Designing a 30-second single take</h2>



<p class="wp-block-paragraph">The 30 seconds in 2.5 is not 15 seconds doubled. In the guide&#8217;s own words the goal is <code>presenting a complete story without multi-segment stitching</code>. That raises the design burden accordingly.</p>



<p class="wp-block-paragraph">The skeleton is the four blocks already covered. In practice it lays out like this.</p>



<pre class="wp-block-code"><code>&#91;1] One-sentence summary
    Subject + Location + Event + Genre/Style + Camera movement

&#91;2] Fixed information
    Character appearance, space, base camera setup

&#91;3] Segment description
    0-3s: …
    3-8s: …
    8-15s: …

&#91;4] Hold across all segments
    Camera behaviour, lighting, sound, overall mood</code></pre>



<p class="wp-block-paragraph">Within a segment, the ordering rule from 2.0 still applies. Write <strong>camera movement → the subject&#8217;s action and expression → change in position → sound</strong>, in that order.</p>



<p class="wp-block-paragraph">Version 2.5 sets separate principles for describing action.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Actions: Give priority to general descriptions … Only write specific details for a few memorable actions, and avoid repeating the same actions.</p>



<p class="wp-block-paragraph">Expressions: Use descriptive sentences and reduce the use of idioms.</p>
</blockquote>



<p class="wp-block-paragraph">Write action in large strokes and detail only the few moments that matter. For expressions, cut the idioms and write descriptively. The 2.0 guide supplies this principle in a far more concrete table, the point of which is to replace an emotion label with <strong>observable physical behaviour</strong>. Instead of &#8220;sadness&#8221;, write <em>lowering the head, shoulders trembling slightly, eyes reddening, fingers unconsciously clutching the corner of clothing</em>.</p>



<p class="wp-block-paragraph">Camera terminology comes as a list in 2.5. Shot size is <code>extreme wide shot/wide shot/medium shot/medium close-up/close-up</code>, movement is <code>push in/pull out/pan/track/follow/orbit/dive/pull back/tilt up/handheld shake</code>, angle is <code>low angle/overhead shot/first-person perspective</code>. There is a rule for anything outside the list.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">For overly niche or technical terms, convert them into [term + descriptive explanation].</p>
</blockquote>



<p class="wp-block-paragraph">Do not throw the term in bare. If you want <code>Rack focus</code>, write where the focus travels from and to alongside it.</p>



<h2 class="wp-block-heading">Locked and Unlocked: when the request is silently ignored</h2>



<p class="wp-block-paragraph">Now for the distinction 2.5 introduced. This is the one that produces the most frequent and least detectable failures in production.</p>



<p class="wp-block-paragraph">The symptoms usually present like this. You specified <code>ratio</code> for a 16:9 output and got back a vertical video. You asked for ten seconds and got seven. You set the parameter, no error came back. <strong>And nothing you specified took effect.</strong></p>



<p class="wp-block-paragraph">The cause is the task type. Here is how the 2.5 guide explains it.</p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph">Seedance 2.5 divides tasks into two categories based on whether the input reference assets lock the properties of the output video. Seedance 2.0 does not make this distinction.</p>
</blockquote>



<p class="wp-block-paragraph"><code>Locked</code> means the input asset is laid onto the output timeline directly. The model conforms to the input, so the aspect ratio locks, and in some cases the duration with it. <code>Unlocked</code> means the input serves only as a semantic reference, leaving you free to set aspect ratio and duration.</p>



<p class="wp-block-paragraph">Three tasks fall under Locked.</p>



<figure class="wp-block-table"><table><thead><tr><th>Task</th><th>What locks</th><th>Required value</th></tr></thead><tbody><tr><td>Video editing</td><td>Aspect ratio <strong>and duration</strong></td><td><code>ratio</code>=<code>adaptive</code>, <code>duration</code>=<code>-1</code></td></tr><tr><td>First / last frame</td><td>Aspect ratio</td><td><code>ratio</code>=<code>adaptive</code> (duration is yours)</td></tr><tr><td>Video extension</td><td>Aspect ratio</td><td><code>ratio</code>=<code>adaptive</code> (duration is yours)</td></tr></tbody></table></figure>



<p class="wp-block-paragraph">For editing, the duration locks too, and it does not come back identical. The guide notes that <code>the output duration may differ slightly from the input, by up to about 0.3 seconds</code>, explaining that some transition frames get compressed by the frame-handling mechanism. Feed a video that 2.5 generated back in as editing input and this discrepancy disappears.</p>



<p class="wp-block-paragraph">There is a harder part. <strong>The task type is determined by the words in your prompt.</strong> To register as editing, the prompt has to contain a trigger: <code>edit video</code>, <code>add</code>, <code>insert</code>, <code>remove</code>, <code>delete</code>, <code>modify</code>, <code>replace</code>, <code>change to</code>. For extension the triggers are <code>extend forward</code>, <code>extend backward</code>, <code>continue</code>, <code>continue from</code>, <code>extend the story</code>.</p>



<p class="wp-block-paragraph">Use the wrong words and the model misclassifies the task, which means a different set of parameter rules gets applied than the one you expected. When several videos are uploaded, <code>the model determines which video to edit based on the prompt</code>. Even the choice of which video is decided by your wording.</p>



<p class="wp-block-paragraph">The guide pairs its principle for writing edit instructions with examples. The principle is <strong>state what changes from what to what.</strong></p>



<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow">
<p class="wp-block-paragraph"><code>Change the man's action from drinking coffee to mopping the floor from 4-6 seconds in Video 1, and leave the rest of the content unchanged.</code></p>



<p class="wp-block-paragraph"><code>Editing task: Replace the Asian woman on the right in Video 1 with the Latina woman from Image 1.</code></p>
</blockquote>



<p class="wp-block-paragraph">The first specifies an interval and adds a sentence telling the model to leave everything else alone. The second opens with <code>Editing task:</code> and pins the task type at the front, a safety measure to guarantee the trigger word lands.</p>



<p class="wp-block-paragraph">Editing and extension carry a format recommendation as well: <code>It is recommended to set output_format to mov.</code> The reason given is better preservation of colour, brightness and audio-visual continuity.</p>



<div class="wp-block-group has-background is-layout-constrained wp-container-core-group-is-layout-dcbd7fed wp-block-group-is-layout-constrained" style="border-left-color:#3858e9;border-left-width:4px;background-color:#f4f6fb;padding-top:1.2rem;padding-right:1.4rem;padding-bottom:1.2rem;padding-left:1.4rem">
<p class="wp-block-paragraph" style="font-weight:700">Remember it by the symptom</p>



<p class="wp-block-paragraph">Aspect ratio changed on its own: you were in a Locked task. Duration off by 0.3 seconds: the editing task worked correctly. Your edit instruction ignored entirely: no trigger word, so it never registered as editing.</p>
</div>



<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>



<h2 class="wp-block-heading">Prompts for animation work</h2>



<p class="wp-block-paragraph">Everything above comes out of the official documentation. Now to translate it into the form the CineV Creative Team actually uses for animation. The examples below follow the official principles, but the sentences are ours.</p>



<p class="wp-block-paragraph"><strong>Holding one character across 30 seconds</strong></p>



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



<p class="wp-block-paragraph">Four things to check in that prompt. The keyframe declaration is the first sentence. The subject is identified by two or three static features. The intervals chain without gaps. And the closing block collects everything that holds constant. All four come straight from the official principles quoted above.</p>



<p class="wp-block-paragraph"><strong>Taking motion from another video</strong></p>



<pre class="wp-block-code"><code>Refer to the fight choreography and camera work in Video 1 to generate a
rooftop duel between Subject 1 and Subject 2.

Subject 1: the silver-haired swordsman in a black high-collar coat,
refer to Image 1.
Subject 2: the masked opponent in red armor plating, refer to Image 2.
Refer to Image 3 for the rooftop environment and its lighting.

Keep the motion timing consistent with Video 1. 2D anime with strong
key-light rim separation.</code></pre>



<p class="wp-block-paragraph">The <code>Refer to … in Video 1</code> construction is the Motion reference template from the 2.0 guide. Narrowing what to reference down to <code>fight choreography and camera work</code> follows the 2.5 requirement.</p>



<p class="wp-block-paragraph">For animation work the restriction discussed at the top turns into an advantage. Real human faces being blocked from upload means that <strong>using generated character designs as References is the intended path, not a workaround.</strong> It is the first of the three routes the official documentation itself proposes.</p>



<h2 class="wp-block-heading">What to check when the result misses</h2>



<p class="wp-block-paragraph">Failures tend to have specific causes. The symptoms covered in the 2.0 guide&#8217;s FAQ are the ones encountered most often in production, and the following rearranges its prescriptions into a checking order.</p>



<p class="wp-block-paragraph"><strong>The character&#8217;s face changes partway through.</strong> The 2.0 guide calls this <code>ID drift</code>. The prescription is to prepare a separate close-up of the face: front-facing, no expression, with interference from shoulders, neck and background kept to a minimum. <strong>A face close-up and a full-body shot are sufficient</strong> for a character Reference; three-view and multi-view images are not recommended.</p>



<p class="wp-block-paragraph"><strong>The same character appears twice in frame.</strong> The guide names this the <code>twin problem</code> and supplies a global constraint to append at the end of the prompt. <em>Throughout the video, characters with completely identical appearance, clothing, and accessories are prohibited. Do not generate duplicate avatars or a twin effect.</em> It also gives a number: stability degrades past four characters.</p>



<p class="wp-block-paragraph"><strong>The style drifts partway.</strong> Pin the style constraint explicitly. Write out whether it is 2D Japanese animation style or 3D. For tighter control, convert the Reference image itself into the target style before feeding it in.</p>



<p class="wp-block-paragraph"><strong>Unwanted subtitles appear.</strong> Add <code>Keep it subtitle-free</code> or <code>Avoid generating any text or subtitles</code>. For 2.5, <code>Do not add subtitles.</code> is the official form. Worth noting: the 2.0 guide records that vertical framing produces subtitles at a significantly higher rate than horizontal.</p>



<p class="wp-block-paragraph"><strong>Quality degrades with each extension.</strong> The guide&#8217;s advice is not to stack extensions repeatedly. Use a high-resolution original as the Reference and keep the extension count under control.</p>



<p class="wp-block-paragraph">Before any of this, check one thing. <strong>Did you load too many assets?</strong> The 2.0 guide recommends four to five in total. Accepting 50 is a ceiling, not a target.</p>



<p class="wp-block-paragraph"></p>



<h2 class="wp-block-heading">Using Seedance 2.5 on CineV</h2>



<p class="wp-block-paragraph">That covers what reading the Seedance family can give you. What remains is carrying these principles into actual work, and there are two places where that process reliably stalls.</p>



<p class="wp-block-paragraph">The first is having no image in your head, and therefore no Context to build. The second is having the image but being unable to put it into domain language. <strong>Storyboard</strong> and <strong>Prompt Enhance</strong> were mentioned earlier for each. They handle the front and back ends of the translation module.</p>



<p class="wp-block-paragraph">On top of that sits the identity of an animation-first platform. Working along a path where the real-human-face restriction never bites, and using 3D-based intuitive conditioning to handle the image that will not resolve into words. Which is where this article started.</p>



<p class="wp-block-paragraph">We hope you reach Seedance 2.5 with as few failed generations as possible. <a href="/">CineV is currently offering 50% off.</a></p>



<p class="wp-block-paragraph"></p>



<h2 class="wp-block-heading">Frequently asked questions</h2>



<p class="wp-block-paragraph"><strong>Can I use second-based timestamps in a Seedance 2.5 prompt?</strong> Yes. The 2.5 guide states support for integer-second timestamps. The base unit is one second, and the condition is that intervals must not leave gaps between them.</p>



<p class="wp-block-paragraph"><strong>Do &#8220;Shot 1, Shot 2&#8221; labels still work in 2.5?</strong> They do. Version 2.5 accepts both shot numbers and timestamps. What does not carry over is the 2.0 warning that using seconds destabilises the result.</p>



<p class="wp-block-paragraph"><strong>Does Seedance 2.5 output 4K?</strong> No. The 2.5 tutorial states that 1080p and 4K are not supported. The 4K figure refers to the maximum resolution of input images; the model capable of 4K output is Seedance 2.0.</p>



<p class="wp-block-paragraph"><strong>How long can a single generation be?</strong> Up to 30 seconds.</p>



<p class="wp-block-paragraph"><strong>Can I change the aspect ratio and duration when editing a video?</strong> No. Editing is a Locked task, so <code>ratio</code> must be <code>adaptive</code> and <code>duration</code> must be <code>-1</code>. The output length can differ from the input by up to about 0.3 seconds.</p>



<p class="wp-block-paragraph"><strong>How many References can I use?</strong> Fifty in total for 2.5: 30 images, 10 videos, 10 audio clips. The 2.0 guide recommends four to five and warns that filling the ceiling makes it difficult for the model to judge priorities.</p>



<p class="wp-block-paragraph"><strong>Can I use a photograph of a real person as a Reference?</strong> No. The official documentation states that direct upload of images and videos containing real human faces is not supported. It offers three alternatives: model-generated output, pre-made digital characters, and material that has been rights-cleared.</p>



<p class="wp-block-paragraph"><strong>Where can I read the official Seedance 2.5 prompt guide?</strong> It is published in the BytePlus ModelArk documentation. Every source is linked below.</p>



<h2 class="wp-block-heading">Official sources</h2>



<p class="wp-block-paragraph">Every quotation in this article comes from the documents below.</p>



<ul class="wp-block-list">
<li><a href="https://docs.byteplus.com/en/docs/ModelArk/1631633" target="_blank" rel="noreferrer noopener">Seedance-1.0-pro&amp;pro-fast prompt guide (BytePlus ModelArk)</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2168087" target="_blank" rel="noreferrer noopener">Seedance-1.5-pro prompt guide (BytePlus ModelArk)</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2222480" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.0 series prompt guide (BytePlus ModelArk)</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2607689" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.5 prompt guide (BytePlus ModelArk)</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2291680" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.0 series tutorial (BytePlus ModelArk)</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/2607688" target="_blank" rel="noreferrer noopener">Dreamina Seedance 2.5 tutorial (BytePlus ModelArk)</a></li>



<li><a href="https://docs.byteplus.com/en/docs/ModelArk/1366799" target="_blank" rel="noreferrer noopener">Video generation tutorial (BytePlus ModelArk)</a></li>
</ul>



<p class="wp-block-paragraph">The documentation is updated continuously. This article reflects the state of it as of August 2026. Rights to the quoted passages rest with the publisher of each document.</p>
