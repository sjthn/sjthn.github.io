---
layout: default
title: "Steps to setup a blog using Jekyll"
categories: [post]
tags: [jekyll]
---

# Steps to setup a blog using Jekyll

Hello folks. I recently moved my blog posts from wordpress.com to github pages, and I am using Jekyll for static site generation from markdown files. Jekyll is a ruby gem for generating static sites.

As part of the setup I was going through github pages docs which also mentions how to integrate Jekyll. And also Jekyll has their own docs for intgetration. As a newbie to ruby and blog setup, I was struggling a bit. I tried several ways mentioned in the docs and other blogposts for integration and finally was able to integrate.

I have collated and noted down the ways by which jekyll can be integrated. I am presenting them here hoping it might be useful for others.

The below steps were tested on macOS High Sierra.

## Steps to setup Jekyll on Github Pages:
- Create a repo for GitHub pages based on [https://pages.github.com/](https://pages.github.com/){:target="_blank"}
- If custom url is needed, follow [this article](https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site){:target="_blank"}

### Prerequisites for Jekyll integration:
- Install Ruby version required for Jekyll. Check the site for required minimum version. Better to update the ruby version through rvm if it’s already installed. rvm installation is straightforward [https://rvm.io/](https://rvm.io/){:target="_blank"}
- Install RubyGems [https://rubygems.org/pages/download](https://rubygems.org/pages/download){:target="_blank"}
- Install Bundler [https://bundler.io/](https://bundler.io/){:target="_blank"}. Helps install exact gems and versions specified in Gemfile. Gemfile seems similar to package.json in npm where you can specify the dependencies.

There are two ways to setup Jekyll:
- Complete setup - generates all the additional files that you may or may not need
- Bare minimum

### Complete setup

- If no Gemfile is there in the repo, use `bundle init` to create one
- Add the required dependences. Here we need Jekyll. So `bundle add Jekyll -v 3.8.5` (Version based on [https://pages.github.com/versions/](https://pages.github.com/versions/){:target="_blank"})
- Now both Gemfile and Gemfile.lock are created. Next we need to convert the site to use Jekyll
- Use `bundle exec jekyll new --force --skip-bundle .` to convert the current site to use Jekyll
- Open Gemfile and remove jekyll gem and uncomment GitHub-pages gem. Also add version of GitHub pages based on [https://pages.github.com/versions/](https://pages.github.com/versions/){:target="_blank"}. After editing Gemfile looks something like this

```
gem "github-pages", "~> VERSION", group: :jekyll_plugins
```
where `VERSION` should the github pages version.

- After saving and closing the file, test it by running `bundle exec jekyll serve` and try opening the site from localhost

The above approach adds extra files like about page, 404 page, posts and pages directories, gitignores, etc. This will be useful for those who quickly need to start running their site.

The manual way mentioned below provides more control of what you need and what not. It does not generate those files.

### Bare minimum

- If no Gemfile is there in the repo, use `bundle init` to create one
- Add this to the Gemfile. `gem "github-pages", "~> 202”`
- Finally `bundle install`

That's it. It'll install github-pages and all it's related dependencies. It won't add additional files so you can create only whichever you want.

Hope this helps.
