---
layout: default
title: "Blogs"
---

<ul class="blogposts_listing">
  {% for post in site.posts %}
    <div>
      <li class="post_list_item">
        <a href="{{ post.url }}">{{ post.title }}</a>
        <div>Published on: {{ post.published }}</div>
      </li>
    </div>
  {% endfor %}
</ul>