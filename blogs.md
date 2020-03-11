---
layout: default
title: "Blogs"
---

<ul class="blogposts_listing">
  {% for post in site.posts %}
    <li class="post_list_item">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>