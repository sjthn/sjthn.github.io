---
layout: default
title: "Android RecyclerView – Expandable Headers"
categories: [post]
tags: [android, recyclerview]
---

# Android RecyclerView – Expandable Headers
*- {{ page.date | date: "%b %-d, %Y" }}*

RecyclerView provides several optimisations over ListView. But it doesn't provide an important component which ListView provides out-of-the-box. And that's the ExpandableListView. Many of us still require such a kind of design where headers can be expanded/collapsed to show/hide child views. In this post, we will look at an idea of how to implement this functionality using RecyclerView.

If you are not familiar with RecyclerView, you can go through my previous blog posts <a href="/android-recyclerview-the-basics/" target="_blank" rel="noopener">here</a> and <a href="/android-recyclerview-itemdecoration-and-itemanimator/" target="_blank" rel="noopener">here</a>.

Let's consider a list of employees who are categorised according to their designation. The designations and employees are shown using different view types. The designation view act as header and employee views act as children.

I have two Lists containing employees denoted by <code>userList</code> and their designations denoted by <code>userTypeList</code> respectively.
<pre>List usersList = usersData.getUsersList();
List userTypeList = usersData.getUserTypeList();</pre>
We have to change our Adapter class to handle the expand/collapse functionality. To keep track of the expand/collapse state I am using a SparseIntArray in the adapter where <code>0</code> represents collapsed state and <code>1</code> expanded state.
<pre>private SparseIntArray headerExpandTracker;</pre>
To keep track of the view type and its position in the respective Lists I am using a <code>SparseArray</code> of <code>ViewType</code> where <code>ViewType</code> holds the data index and type as shown below.
<pre>public class ViewType {

    private int dataIndex;
    private int type;

    public ViewType(int dataIndex, int type) {
        this.dataIndex = dataIndex;
        this.type = type;
    }

    public int getDataIndex() {
        return dataIndex;
    }

    public int getType() {
        return type;
    }
}</pre>
Now we will change the <code>getItemCount()</code> method to get the number of items to display. Initially all the items will be in collapsed state. So only headers will be visible.

Here is the getItemCount():
<pre>@Override
public int getItemCount() {
    int count = 0;
    if (userTypeList != null &amp;&amp; usersList != null) {
        viewTypes.clear();
        int collapsedCount = 0;
        for (int i = 0; i &lt; userTypeList.size(); i++) {
            viewTypes.put(count, new ViewType(i, HEADER_TYPE));
            count += 1;
            String userType = userTypeList.get(i);
            int childCount = getChildCount(userType);
            if (headerExpandTracker.get(i) != 0) {
                // Expanded
                for (int j = 0; j &lt; childCount; j++) {
                    viewTypes.put(count, new ViewType(count - (i + 1) + collapsedCount, USER_TYPE));
                    count += 1;
                }
            } else {
                // Collapsed
                collapsedCount += childCount;
            }
        }
    }
    return count;
}</pre>
In the code, I am looping through the <code>userTypeList</code> adding each of the header view type to the <code>viewTypes</code> SparseArray. Then we check whether the header is expanded or not using this code:
<pre>if (headerExpandTracker.get(i) != 0) {
    // Expanded State
} else {
    // Collapsed State
}</pre>
If it is collapsed we are adding the count of the collapsed child views to the <code>collapsedCount</code>. The number of children for a given user type will be calculated and returned in the <code>getChildCount</code> method.

If it is expanded we are adding each child view type to the <code>viewTypes</code> array. Note this line:
<pre>viewTypes.put(count, <mark>new ViewType(count - (i + 1) + collapsedCount, USER_TYPE)</mark>);</pre>
Here the first parameter of the <code>ViewType</code> class represents the <code>index</code> of the data in the userList. We subtract the headers added from the count using <code>(i + 1)</code> and adding the count of any collapsed views before this user view, using <code>collapsedCount</code>.

Next in the <code>getItemViewType()</code> we return the correct view type based on the position.
<pre>@Override
public int getItemViewType(int position) {
    if (viewTypes.get(position).getType() == HEADER_TYPE) {
        return HEADER_TYPE;
    } else {
        return USER_TYPE;
    }
}</pre>
Then in the <code>onCreateViewHolder()</code>, based on the <code>viewType</code> the correct view is inflated and the ViewHolder is returned.

After that, based on the view type, <code>onBindViewHolder</code> binds the necessary data to the necessary view.
<pre>@Override
public void onBindViewHolder(RecyclerView.ViewHolder holder, int position) {
    int itemViewType = getItemViewType(position);
    ViewType viewType = viewTypes.get(position);
    if (itemViewType == USER_TYPE) {
        bindUserViewHolder(holder, viewType);
    } else {
        bindHeaderViewHolder(holder, position, viewType);
    }
}</pre>
<br />
<pre>private void bindHeaderViewHolder(RecyclerView.ViewHolder holder, int position, ViewType viewType) {
    int dataIndex = viewType.getDataIndex();
    SectionHeaderViewHolder headerViewHolder = (SectionHeaderViewHolder) holder;
    headerViewHolder.sectionTitle.setText(userTypeList.get(dataIndex));
    if (isExpanded(position)) {
        headerViewHolder.sectionTitle
                .setCompoundDrawablesWithIntrinsicBounds(null, null, headerViewHolder.arrowUp, null);
    } else {
        headerViewHolder.sectionTitle
                .setCompoundDrawablesWithIntrinsicBounds(null, null, headerViewHolder.arrowDown, null);
    }
}

private void bindUserViewHolder(RecyclerView.ViewHolder holder, ViewType viewType) {
    int dataIndex = viewType.getDataIndex();
    ((UserViewHolder) holder).username.setText(usersList.get(dataIndex).getName());
    Glide.with(holder.itemView).load(usersList.get(dataIndex).getImageUrl()).into(((UserViewHolder) holder).userAvatar);
}</pre>
Note this <code>int dataIndex = viewType.getDataIndex();</code> in the code above. Using this dataIndex we will get the correct data from <code>userTypeList</code> and <code>userList</code> respectively.

The expand/collapse action is triggered from the Header ViewHolder's onClickListener. In the click listener, an interface function is called which is implemented by the Adapter. This function takes the adapter position as parameter.
<pre>@Override
public void onHeaderClick(int position) {
    ViewType viewType = viewTypes.get(position);
    int dataIndex = viewType.getDataIndex();
    String userType = userTypeList.get(dataIndex);
    int childCount = getChildCount(userType);
    if (headerExpandTracker.get(dataIndex) == 0) {
        // Collapsed. Now expand it
        headerExpandTracker.put(dataIndex, 1);
        notifyItemRangeInserted(position + 1, childCount);
    } else {
        // Expanded. Now collapse it
        headerExpandTracker.put(dataIndex, 0);
        notifyItemRangeRemoved(position + 1, childCount);
    }
}</pre>
Here the <code>headerExpandTracker</code> is checked to see if header is expanded or collapsed. If collapsed, it has to be expanded. The <code>headerExpandTracker</code> value is changed and the adapter is notified about the insertion of the child views using <code>notifyItemRangeInserted</code> passing the position of the first child view and the total count. Similarly if it's in expanded state, the <code>headerExpandTracker</code> value is changed and <code>notifyItemRangeRemoved()</code> is called.

After implementing all, this is how the RecyclerView looks like:

<div class="separator" style="clear:both;text-align:center;">
<img class=" size-large wp-image-212 aligncenter" src="/assets/imgs/android-expandable-recyclerview.gif" alt="android-expandable-recyclerview" width="360" height="640" />
</div>

You can build upon this example for more complex and feature rich Expandable RecyclerView.

Full source code can be found <a href="https://github.com/sjthn/RecyclerViewDemo/tree/expandable-recyclerview">here</a>.

In the next posts I will cover more use-cases with RecyclerView.
