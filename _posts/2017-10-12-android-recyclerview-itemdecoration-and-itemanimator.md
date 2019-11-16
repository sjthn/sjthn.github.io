---
layout: default
title: "Android RecyclerView – ItemDecoration and ItemAnimator"
categories: [post]
tags: [android, recyclerview]
---

# Android RecyclerView – ItemDecoration and ItemAnimator

<div dir="ltr" style="text-align:left;">

In the <a href="/android-recyclerview-the-basics/index.html" target="_blank" rel="noopener">previous post</a> of the series I covered the basics of how RecyclerView works and how to create an Adapter. In this post we will look at how to use ItemDecoration to decorate the child views and ItemAnimator to animate them.
<h2 style="text-align:left;">ItemDecorator</h2>
<div>This class is used to decorate child views in a RecyclerView. Decorations can be anything from setting dividers between list items or offsets between them, or even setting frames for grids. You can also decorate specific child items based on their view type.</div>
<div></div>
<div>This class has three methods:</div>
<div>
<ul style="text-align:left;">
	<li>onDraw</li>
	<li>onDrawOver</li>
	<li>getItemOffsets</li>
</ul>
<h3 style="text-align:left;">onDraw</h3>
</div>
<div>This is where you can draw any decorations for the child views. You can draw lines, rects or bitmaps. These decorations are drawn before the child views themselves are drawn. So these decorations appear behind the child views.</div>
<div></div>
<div>This method takes three parameters: a <code>Canvas</code>, the <code>RecyclerView</code> itself and <code>State</code>. The decorations are drawn on the canvas. The RecyclerView instance can be used to get the child views and total count. The State instance is a class that stores information like scroll positions in RecyclerView and other data.</div>
<h3 style="text-align:left;">onDrawOver</h3>
<div>This method is also used to draw decorations for child views. The simple difference is decorations are drawn only after child views are drawn. So they appear over the child views. It takes same parameters as onDraw.</div>
<h3 style="text-align:left;">getItemOffsets</h3>
<div>If you want to set offset for child views, you can use this method. It helps to add inset for child view similar to setting margin or padding.</div>
<div></div>
<div>It provides four parameters: a Rect, the child view, RecyclerView and State.</div>
<div>The Rect can be used to set necessary offset. RecyclerView gets the offset from this method and decorates child views accordingly.</div>
<div></div>
<div>Here is an example code which draws divider between each views in RecyclerView</div><br />
<pre>
    @Override
    public void onDrawOver(Canvas c, RecyclerView parent, RecyclerView.State state) {
        int count = parent.getChildCount();
        int width = parent.getWidth();
        for (int i = 0; i &amp;lt; count; i++) {
            View child = parent.getChildAt(i);
            int bottom = child.getBottom();
            c.drawRect(0, bottom, width, bottom + DIVIDER_HEIGHT, paint);
        }
    }
</pre>
<br />
In the code, based on the child count, the line is drawn at the bottom of each child view. The divider has the width equal to screen width and height of 1px. This is how it looks like:
<div class="separator" style="clear:both;text-align:center;"><a style="margin-left:1em;margin-right:1em;" href="https://therubberduckdev.files.wordpress.com/2017/10/adcd5-recyclerview2bwith2bdividers.jpg"><img title="RecyclerView with ItemDecoration" src="https://therubberduckdev.files.wordpress.com/2017/10/adcd5-recyclerview2bwith2bdividers.jpg?w=169" alt="" width="360" height="640" border="0" /></a></div>
<br />Next we will look at some built-in animations available in RecyclerView.
<h2 style="text-align:left;">ItemAnimator</h2>
<div>This class provides mechanism for animating child views. It can be used to animate adding, removing, modifying and moving a child view. RecyclerView provides basic fade-in, fade-out, and translate animations. If you want custom animations you can subclass ItemAnimator.</div>
<div></div>
<div>RecyclerView comes with these basic animations out-of-the-box using the <code>DefaultItemAnimator</code> class. So no need to do any extra configuration to add it.</div>
<div></div>
<div>Let's look at the basic animations and how to trigger them.</div>
<h3 style="text-align:left;">1. Addition</h3>
<div>

You can initiate an addition animation by adding new item to the data supplied to the adapter and notifying it for insertion. The default addition animation uses fade-in to add a new child view. This addition animation is based on predictive animation where adding a new item at a position causes other items to move to make way for it.

Here is the code that initiates addition animation by adding a new <code>User</code> to an <code>ArrayList</code>:
<pre>
    User newUser = new UsersData().getNewUser();
    adapter.addNewUser(position, newUser);
    adapter.notifyItemInserted(position);
</pre>
<br />
<div>
<div class="separator" style="clear:both;text-align:left;"></div>
<div class="separator" style="clear:both;text-align:center;"><a style="margin-left:1em;margin-right:1em;" href="https://therubberduckdev.files.wordpress.com/2017/10/d3698-recyclerview-default-add-animation.gif"><img class=" size-full wp-image-23 aligncenter" src="https://therubberduckdev.files.wordpress.com/2017/10/recyclerview-default-add-animation.gif" alt="Android RecyclerView - ItemDecoration and ItemAnimator" width="288" height="512" /></a></div>
<div class="separator" style="clear:both;text-align:left;"></div>
<h3 style="text-align:left;">2. Removal</h3>
</div>
<div>To remove item, remove it from the data list and call <code>notifyItemRemoved()</code> with the position of the item that is to be removed. The default animation fades-out the view to be removed. It also causes child views around it to move and fill the empty area. Checkout the code below.</div>
<br />
<pre>
    adapter.removeUser(position);
    adapter.notifyItemRemoved(position);
</pre>
<br />
<div>In the code, a User is removed from the ArrayList at the given position and the adapter is notified about it.</div>
<br />
</div>
</div>
<div></div>
<div><img class=" size-full wp-image-25 aligncenter" src="https://therubberduckdev.files.wordpress.com/2017/10/recyclerview-default-remove-animation.gif" alt="Android RecyclerView - ItemDecoration and ItemAnimator" width="288" height="512" /></div>
<div dir="ltr" style="text-align:left;">
<div>
<div>
<h3 style="text-align:left;">3. Change</h3>
</div>
<div>When a child view's data changes, it gets reflected in the view. The default animation is cross-fade. The view fades-out with old values and then fades-in with the new values. To display item change call adapter's <code>notifyItemChanged()</code> method. Below is the code.</div>
<br />
<pre>
    adapter.changeUser(position);
    adapter.notifyItemChanged(position);
</pre>
<br />
<div>In the <code>changeUser</code> method I am changing the username and user image url at the particular position in the ArrayList.</div>
<br />
</div>
</div>
<div></div>
<div><img class=" size-full wp-image-26 aligncenter" src="https://therubberduckdev.files.wordpress.com/2017/10/recyclerview-default-change-animation.gif" alt="Android RecyclerView - ItemDecoration and ItemAnimator" width="288" height="512" /></div>
<div dir="ltr" style="text-align:left;">
<div>
<div>
<h3 style="text-align:left;">4. Move</h3>
</div>
<div>To move an item to another position, first change the position of the item in the data set. For example moving a <code>User</code> item from position 3 to 6. Then to reflect it in UI, use the adapter's <code>notifyItemMoved()</code> method passing in the initial and final positions. The move animation is a translate animation.</div>
<div></div>
<div><span style="background-color:#6aa84f;"><span style="color:#f3f3f3;">Note that when querying an item's position while it is being animated, the value returned may be -1. This is because until the animation's final layout pass completes, the position returned will be -1. So check the following condition when getting a view's position.</span></span></div>
<br />
<pre>
    if (position != RecyclerView.NO_POSITION) {
        //...
    }
</pre>
<br />
<div></div>
<div>

Checkout the DefaultItemAnimator class for more info. If you want to use custom animations subclass either DefaultItemAnimator or ItemAnimator class. Or else, use this awesome library <a href="https://github.com/wasabeef/recyclerview-animators">https://github.com/wasabeef/recyclerview-animators</a>Checkout the source code <a href="https://github.com/sjthn/RecyclerViewDemo/tree/decorator-and-animator" target="_blank" rel="noopener">here</a>.

In the next post we'll see some advanced RecyclerView use-cases.

</div>
</div>
</div>