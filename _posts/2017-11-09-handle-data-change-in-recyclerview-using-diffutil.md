---
layout: default
title: "Handling data change in RecyclerView gracefully using DiffUtil"
categories: [post]
tags: [android, recyclerview, diffutil]
---

# Handling data change in RecyclerView gracefully using DiffUtil
*- {{ page.date | date: "%b %-d, %Y" }}*

<a href="https://developer.android.com/reference/android/support/v7/util/DiffUtil.html" target="_blank" rel="noopener">DiffUtil</a> is an Android support library utility class which helps to ease out the process of finding which item changed in a list of data. It helps to calculate the difference between an old list and a new list and trigger updates to list items.

If you are new to RecyclerView checkout my previous posts.

DiffUtil can be very useful when showing a list of data using RecyclerView where the data can be changed in future based on new values. Unlike ListView, <a href="https://developer.android.com/reference/android/support/v7/widget/RecyclerView.Adapter.html" target="_blank" rel="noopener">RecyclerView's adapter</a> provides the following notify methods to only update those items that changed.

<code>notifyItemChanged(int)</code>

<code>notifyItemInserted(int)</code>

<code>notifyItemRemoved(int)</code>

<code>notifyItemRangeChanged(int, int)</code>

<code>notifyItemRangeInserted(int, int)</code>

<code>notifyItemRangeRemoved(int, int)</code>

But since it only provides the methods, it is your responsibility to identify what are the changes in the new list compared to the old one and which method to call. This is where DiffUtil is very useful.

It can identify data change, insertions, removals and position changes by finding the difference between the old list and the new list of data and only update those items in RecyclerView. So you need not call <code>notifyDataSetChanged()</code> each time even if only a specific data is changed.

According to the official doc,
<blockquote>DiffUtil is based on Eugene W. Myers's difference algorithm to calculate the minimal number of updates to convert one list into another.</blockquote>
It uses the algorithm to detect changes and specify what exactly has changed.
<h2>DiffUtil Callback</h2>
DiffUtil provides a Callback class with abstract methods. We need to subclass this and implement those methods. This Callback class tells DiffUtil how to detect changes.

Following are the methods:

<code>getOldListSize()</code> - implement this and return the size of the old list

<code>getNewListSize()</code> - implement this and return the size of the new list

<code>areItemsTheSame(int oldItemPosition, int newItemPosition)</code> - here you have to provide a logic to check whether list items of the old and new lists are same or not. For example, you can use some unique <code>id</code>s of list items to check whether both are same or not. Or if you don't have any unique IDs, compare the hashcodes of the two objects. This method returns true if items are same, false otherwise.

<code>areContentsTheSame(int oldItemPosition, int newItemPosition)</code> - this method is called when <code>areItemsTheSame()</code> returns true for these items. This means that the object has not changed, but the contents may have changed. So here you provide logic to check whether the contents of the two items changed. Return true if contents are same or false if changed.

If you want to return which specific values in an Object changed, you can implement <code>getChangePayload(int oldItemPosition, int newItemPosition)</code>

This is a non abstract method which gets called if <code>areItemsTheSame()</code> returned true for two items and <code>areContentsTheSame()</code> returned false for them. Using this method you can return the specific values which are changed.
<h3>OK. Let's implement this.</h3>
First you need the list used to render items in RecyclerView. Here I am going to display a list of places in RecyclerView.

The Place Object contains a unique ID, the name of the place and its image.
<pre>public class Place {

    private int id;
    private String name;
    private int image;

    public Place(int id, String name, int image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getImage() {
        return image;
    }
}</pre>
I am fetching the places and displaying it in the adapter.
<pre>ArrayList&lt;Place&gt; places = fetchPlaces();
adapter.setPlaces(places);</pre>
Whenever data changes, I again fetch the places.

Now to handle item changes let's subclass the DiffUtil Callback class.

In the constructor, let's pass the old list and the newly fetched list.
<pre>public PlacesDiffCallback(ArrayList&lt;Place&gt; oldPlaces, ArrayList&lt;Place&gt; newPlaces) {
    this.oldPlaces = oldPlaces;
    this.newPlaces = newPlaces;
}</pre>
Then in my <code>getOldListSize()</code> I return the size of old list:
<pre>@Override
public int getOldListSize() {
    return oldPlaces.size();
}</pre>
Similarly in <code>getNewListSize()</code> I return the size of new list:
<pre>@Overridew
public int getNewListSize() {
    return newPlaces.size();
}</pre>
&nbsp;

In <code>areItemsTheSame()</code> each item in the old and new lists are compared against each other. Here we check whether two items are same. I do this by comparing the unique IDs:
<pre>@Override
public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
    return oldPlaces.get(oldItemPosition).getId() == newPlaces.get(newItemPosition).getId();
}</pre>
If the IDs are different, it means that the items are different. So it won't call <code>areContentsTheSame()</code> for these items. If IDs are same, then it calls <code>areContentsTheSame()</code>.

In <code>areContentsTheSame()</code> we check whether the contents if two items are same or not. Here I am comparing the name and image of the place:
<pre>@Override
public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
    Place oldPlace = oldPlaces.get(oldItemPosition);
    Place newPlace = newPlaces.get(newItemPosition);
    return oldPlace.getImage() == newPlace.getImage() &amp;&amp;
            oldPlace.getName().equals(newPlace.getName());
}</pre>
It returns true if name and image of old and new items haven't changed. If changed, it returns  false.

I am also overriding <code>getChangePayload()</code> to return which values actually changed. This helps us to update only those views that represent the value. For example, if only the name of the place changed, we need not update the whole item. Instead we can update the name textview alone.

I am using a Bundle to return the values changed:
<pre>@Override
public Object getChangePayload(int oldItemPosition, int newItemPosition) {
    Place oldPlace = oldPlaces.get(oldItemPosition);
    Place newPlace = newPlaces.get(newItemPosition);
    Bundle bundle = new Bundle();
    if (oldPlace.getImage() != newPlace.getImage()) {
        bundle.putInt("image", newPlace.getImage());
    }
    if (!oldPlace.getName().equals(newPlace.getName())) {
        bundle.putString("name", newPlace.getName());
    }
    return bundle;
}</pre>
That's it. We have completed the logic to identify the change.
<h2>Triggering DiffUtil</h2>
Now to trigger DiffUtil to detect changes.
<pre>PlacesDiffCallback callback = new PlacesDiffCallback(this.places, places);
DiffUtil.DiffResult diffResult = DiffUtil.calculateDiff(callback);
this.places.clear();
this.places.addAll(places);
diffResult.dispatchUpdatesTo(this);</pre>
Here when new list is fetched, we pass the old and new places list to the callback class. Then we call DiffUtil's <code>calculateDiff()</code> method. It starts detecting the changes by calling the Callback class's methods for each items. Then in line 3 and 4, we assign the new items to the old list. Immediately after that we call <code>dispatchUpdatesTo()</code>.

<code>dispatchUpdatesTo()</code> method takes adapter as argument. It uses this argument to directly call notify methods for the items changed automatically.

To update only those values returned from <code>getChangePayload()</code> we can override the adapter's onBindViewHolder:
<pre>public void onBindViewHolder(VH holder, int position, List&lt;Object&gt; payloads) {}</pre>
Note that this method takes a list of payloads as third argument. This is where the values returned from <code>getChangePayload()</code> are present. We can use this to update only the name or only the image of the place as below:
<pre>@Override
public void onBindViewHolder(PlaceViewHolder holder, int position, List&lt;Object&gt; payloads) {
    if (payloads.isEmpty()) {
        super.onBindViewHolder(holder, position, payloads);
    } else {
        Bundle bundle = (Bundle) payloads.get(0);
        if (bundle.size() != 0) {
            int image = bundle.getInt("image");
            if (image != 0) {
                Glide.with(holder.itemView.getContext())
                        .asDrawable()
                        .load(image)
                        .apply(options)
                        .into(holder.placeImageView);
            }

            String name = bundle.getString("name");
            if (name != null) {
                holder.placeNameTextView.setText(name);
            }
        }
    }
}</pre>
&nbsp;
<h2>Tradeoffs of DiffUtil</h2>
Like how useful it is, there are some trade-offs using this class.

The algorithm used to detect changes depends on the size of the list. If the list size is very large, then the calculation may take longer time.

Also it take some additional steps to detect any move operations i.e., if any item moved from its previous position to a new position. If your list does not allow item movements, you can disable this additional step by calling <code>calculateDiff(Callback cb, boolean detectMoves)</code> passing false as second argument.

Finally and most importantly, the DiffUtil calculations are run on the main thread. This can cause additional performance issues. However, you can rectify this by moving the <code>calculateDiff()</code> call to background thread and updating the RecyclerView items on the main thread. You can also use RxJava to accomplish this.