---
layout: default
title: "Android RecyclerView – Drag and Drop and Swipe to Dismiss"
categories: [post]
tags: [android, recyclerview]
---

# Android RecyclerView – Drag and Drop and Swipe to Dismiss

In the <a href="/android-recyclerview-expandable-headers/" target="_blank" rel="noopener">last post</a> I explained how you can implement an expandable recyclerview. In this post we will see how to implement swipe-to-remove and drag-and-drop gestures.

RecyclerView provides a built-in mechanism to enable drag and drop and swipe to dismiss gestures. This is a great advantage for Recyclerview compared to ListView where we had to write all the boilerplate for animating items for dragging and swiping. So if you are still using ListView this is a great feature for you to switch to RecyclerView.

This can be accomplished using the <a href="https://developer.android.com/reference/android/support/v7/widget/helper/ItemTouchHelper.html" target="_blank" rel="noopener">ItemTouchHelper</a> class provided with RecyclerView. This class does all the heavy lifting needed for handling swiping and dragging and animating the view accordingly.

You can specify in which directions and in which ViewHolders the gestures should work. Also you need to be notified when a swipe or drag and drop gesture is completed. This can be addressed using the <a href="https://developer.android.com/reference/android/support/v7/widget/helper/ItemTouchHelper.Callback.html" target="_blank" rel="noopener">ItemTouchHelper.Callback</a> class.

To quickly setup these gestures, we can subclass the <code>Callback</code> class and override three methods: <code>getMovementFlags()</code>, <code>onMove()</code> and <code>onSwiped()</code>.
<ul>
	<li>In <code>getMovementFlags()</code> you have to return a <code>int</code> value. This value denotes a composite flag that defines the movement directions for each movement states namely IDLE, DRAG and SWIPE. This method takes two parameters: a RecyclerView instance and the ViewHolder of the view. You can return the flag using the method <code>makeFlag()</code> or the convenience method <code>makeMovementFlags()</code>. In the below code, drag supports both up and down directions, and swipe supports left and right directions.</li>
</ul>
<pre>@Override
public int getMovementFlags(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder) {
    int dragFlags = ItemTouchHelper.UP | ItemTouchHelper.DOWN;
    int swipeFlags = ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT;
    return makeMovementFlags(dragFlags, swipeFlags);
}</pre>
<ul>
	<li><code>onMove()</code> gets called when a view is dragged from its position to other positions. You have to return true if the item has been moved from its old position to a new position. Here you can notify the adapter about the position change. By default an item can be moved only after long pressing it.</li>
	<li>Similarly, <code>onSwipe()</code> gets called when a view is completely swiped out. Here you can notify the adapter about the removal.</li>
</ul>
To correctly handle drag-and-drop and swipe, we can create a interface.
<pre>public interface ActionCompletionContract {
    void onViewMoved(int oldPosition, int newPosition);
    void onViewSwiped(int position);
}</pre>
And let's make our Adapter implement this. In the <code>onViewMoved()</code> callback, we will remove the data at the <code>oldPosition</code> and add it to the <code>newPosition</code>, and notify the adapter:
<pre>@Override
public void onViewMoved(int oldPosition, int newPosition) {
    User targetUser = usersList.get(oldPosition);
    User user = new User(targetUser);
    usersList.remove(oldPosition);
    usersList.add(newPosition, user);
    notifyItemMoved(oldPosition, newPosition);
}</pre>
For swipe to dismiss action, we call <code>onViewSwiped()</code> interface callback and remove the item:
<pre>@Override
public void onViewSwiped(int position) {
    usersList.remove(position);
    notifyItemRemoved(position);
}</pre>
Now to call these appropriate callbacks from the ItemTouchHelper.Callback class, we will pass the adapter to the class:
<pre>SwipeAndDragHelper swipeAndDragHelper = new SwipeAndDragHelper(adapter);
ItemTouchHelper touchHelper = new ItemTouchHelper(swipeAndDragHelper);</pre>
Here I have created a subclass of the ItemTouchHelper.Callback called <code>SwipeAndDragHelper</code>.

And finally to integrate this ItemTouchHelper with our RecyclerView, we call <code>attachToRecyclerView()</code> method:
<pre>touchHelper.attachToRecyclerView(userRecyclerView);</pre>
That's it. We have implemented the drag-and-drop and swipe-to-dismiss gestures. This is how it looks:

<div class="separator" style="clear:both;text-align:center;"><img class=" size-full wp-image-321 aligncenter" src="/assets/imgs/recyclerview-itemtouchhelper1.gif" alt="recyclerview-itemtouchhelper" width="288" height="512" />
</div>

&nbsp;

Now what if we want to move the items only by touching a handle something like below:

<div class="separator" style="clear:both;text-align:center;">
<img class="alignnone size-full wp-image-331" src="/assets/imgs/components-listcontrols-reorder.png" alt="components-listcontrols-reorder" width="628" height="256" />
<br/>
Source: <a href="https://material.io/guidelines/components/lists-controls.html#lists-controls-types-of-list-controls" target="_blank" rel="noopener">Material Design Guidelines</a>
</div>

For that, the ItemTouchHelper provides <code>startDrag()</code> and <code>startSwipe()</code> methods to manually start drag and swipe actions respectively. Let's implement this.

First to manually drag, we must disable the default dragging. Since default dragging is started when a view is long pressed, we must disable it. This can be done by returning false in <code>isLongPressEnabled()</code> of the Callback class.

Then pass the instance of ItemTouchHelper to the adapter. Then implement <code>onTouchListener</code> for the reorder handle ImageView. Inside <code>onTouch</code> call the <code>startDrag</code> method passing the ViewHolder as parameter like below:

In onBindViewHolder:
<pre>((UserViewHolder) holder).reorderView.setOnTouchListener(new View.OnTouchListener() {
    @Override
    public boolean onTouch(View v, MotionEvent event) {
        if (event.getActionMasked() == MotionEvent.ACTION_DOWN) {
            touchHelper.startDrag(holder);
        }
        return false;
    }
});</pre>
Result:

<div class="separator" style="clear:both;text-align:center;">
<img class=" size-full wp-image-368 aligncenter" src="/assets/imgs/recyclerview-manual-drag-drop.gif" alt="recyclerview-item-touch-helper-reorder" width="288" height="512" />
</div>

&nbsp;

Next we will add some fade effect to the swipe action. Right now when the view gets swiped there is no effect except the view gets transitioned in x direction.

The Callback class provides <code>onChildDraw()</code> method to draw anything over the area of the child view being swiped or dragged. It provides a canvas, viewholder, x and y displacement caused by the gesture, and action state as parameters among others. So we will check the action state and if it is equal to <code>ACTION_STATE_SWIPE</code> we will reduce the alpha of the view as it moves away from its original position.
<pre>@Override
public void onChildDraw(Canvas c,
                        RecyclerView recyclerView,
                        RecyclerView.ViewHolder viewHolder,
                        float dX,
                        float dY,
                        int actionState,
                        boolean isCurrentlyActive) {
    if (actionState == ItemTouchHelper.ACTION_STATE_SWIPE) {
        float alpha = 1 - (Math.abs(dX) / recyclerView.getWidth());
        viewHolder.itemView.setAlpha(alpha);
    }
    super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
}</pre>
Now you will get a nice fade as below when swiping:

<div class="separator" style="clear:both;text-align:center;">
<img class=" size-full wp-image-386 aligncenter" src="/assets/imgs/recyclerview-swipe-fade-out.gif" alt="recyclerview-swipe-dismiss-item-fade-out" width="288" height="512" />
</div>

Checkout the full source code <a href="https://github.com/sjthn/RecyclerViewDemo/tree/advanced-usecases">here</a>.
