---
layout: default
title: "A case with Kotlin let"
categories: [post]
tags: [kotlin]
date: 2019-03-19 14:05 +0530
---

<p class="graf graf--p">One of my test cases were failing. It was to verify that a particular function is getting called when data is empty. Instead it was getting called twice which was unexpected.</p>
<p class="graf graf--p">The code I was testing had a <code class="markup--code markup--p-code">let</code> block and Elvis operator. If a value is non null then let block is executed. Else the expression to the right of Elvis operator gets executed.</p>
<p class="graf graf--p">Kotlin’s <code class="markup--code markup--p-code">let</code> function helps executing code within its block scope by taking the object on which it is invoked as parameter. <code class="markup--code markup--p-code">let</code> can be ideally used on nullable objects to execute something only if they are non-null.</p>
<p class="graf graf--p">Below is the code on which the test case was written.</p>
<img class="alignnone size-full wp-image-731" src="/assets/imgs/kotlin-let.png" alt="kotlin-let" width="623" height="287" />
<div>
<p class="graf graf--p">The test case was to check whether <code class="markup--code markup--p-code">view.showEmptyState()</code> was getting called when <code class="markup--code markup--p-code">validData</code> was empty. But it was failing.</p>
<p class="graf graf--p">The value from <code class="markup--code markup--p-code">getValidData()</code> was actually empty. So according to the code it was supposed to pass. I was totally confused.</p>
<p class="graf graf--p">But after some debugging I found that <code class="markup--code markup--p-code">view.showEmptyState()</code> was getting called twice.</p>
<p class="graf graf--p">But I have <code class="markup--code markup--p-code">view.showEmptyState()</code> only at two places. One inside let block and other to the right of elvis operator.</p>
<p class="graf graf--p">Surprised I set out to find what was going wrong.</p>
<p class="graf graf--p">First I went to Kotlin doc for <code class="markup--code markup--p-code">let</code>:</p>
</div>

<div class="separator" style="clear:both;text-align:center;">
<img class="alignnone size-full wp-image-730" src="/assets/imgs/screen-shot-2019-03-09-at-1.50.37-pm.png" alt="Screen Shot 2019-03-09 at 1.50.37 PM" width="725" height="85" />
<br/>
Source: <a class="markup--anchor markup--p-anchor" href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html" target="_blank" rel="nofollow noopener noreferrer">https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html</a>
</div>
<p class="graf graf--p">Take a look at the last few words of above sentence. It says <code class="markup--code markup--p-code">let</code> returns a result. That caught my eyes. I again went to the code and found the IDE hint for the return statement.</p>
<p class="graf graf--p">So last line of the <code class="markup--code markup--p-code">let</code> is implied as the return statement.</p>
<p class="graf graf--p">In my code the last line is <code class="markup--code markup--p-code">analytics?.triggerEvent(validData)</code> . If you notice <code class="markup--code markup--p-code">analytics</code> is a nullable type. Since it is not mocked or tested, it is always null!</p>
<p class="graf graf--p">As <code class="markup--code markup--p-code">analytics</code> is null, the let block returns null. This returned value is checked against the elvis operator. And since it is null it goes to the else part. So <code class="markup--code markup--p-code">view.showEmptyState()</code> was getting called again after let block is executed.</p>
<p class="graf graf--p">So that’s why the test case was failing.</p>
<p class="graf graf--p">Ideally we should have mocked the analytics to pass the test. But during runtime if analytics somehow was null, then the case will fail.</p>
<p class="graf graf--p">So the solution would be to have a non-null value as the return type, or simply a Unit. Another option is to go with good old if-else instead.</p>
<p class="graf graf--p">Lesson learnt is that sometime we don’t care about the semantics of the code we are using. But if we’re careless there might be cases where the code won’t work as intended is what we should understand.</p>
<p class="graf graf--p">Anyway, I should thank the IDE for hinting me about the semantic of <code>let</code>.</p>

<div></div>
&nbsp;