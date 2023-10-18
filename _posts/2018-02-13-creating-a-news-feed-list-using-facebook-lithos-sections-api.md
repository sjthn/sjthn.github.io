---
layout: default
title: "Creating a News Feed list using Facebook Litho’s Sections API"
categories: [post]
tags: [android, fblitho]
published: 2018-02-13
---

# Creating a News Feed list using Facebook Litho’s Sections API

In my <a href="/basics-of-facebook-litho-a-declarative-ui-framework-for-android/" target="_blank" rel="noopener">previous post</a> I have explained the basics of Litho. In this post let's create a complex list of items using the Sections API in Litho.

With the basics in mind let's create a complex RecyclerView showing some fake news feeds with different view types, nested horizontal scrolling, pull-to-refresh and lazy loading 15 items in a batch.
<h3>Library dependencies</h3>
I am using Android Studio 3.0 and Litho version 0.11.0. Here are the dependencies to be added.

<strong>Litho dependencies:</strong>
<pre>implementation 'com.facebook.litho:litho-core:0.12.0'
implementation 'com.facebook.litho:litho-widget:0.12.0'
compileOnly 'com.facebook.litho:litho-annotations:0.12.0'
annotationProcessor 'com.facebook.litho:litho-processor:0.12.0'</pre>
<strong>Sections dependencies:</strong>
<pre>implementation 'com.facebook.litho:litho-sections-core:0.12.0'
implementation 'com.facebook.litho:litho-sections-widget:0.12.0'
compileOnly 'com.facebook.litho:litho-sections-annotations:0.12.0'
annotationProcessor 'com.facebook.litho:litho-sections-processor:0.12.0'</pre>
<strong>SoLoader:</strong>
<pre>// Since Litho uses Yoga, to load native code it uses SoLoader
implementation 'com.facebook.soloader:soloader:0.2.0'</pre>
We will use the new Sections API to create the list.
<h3>Sections API</h3>
According to the <a href="https://fblitho.com/docs/sections-intro" target="_blank" rel="noopener">official docs</a>, Sections are built on top of Litho to provide a declarative and composable API for writing highly-optimized list surfaces. While Litho Components are used for displaying pieces of UI, Sections are a way of structuring the data and translating it into Litho Components.

So that means each data item that backs the UI is represented by a Section which is translated to the UI using Litho Components.

Litho provides two built-in sections namely
<ul>
	<li><strong><a href="https://fblitho.com/javadoc/com/facebook/litho/sections/common/DataDiffSection" target="_blank" rel="noopener">DataDiffSection</a></strong> which is used to represent a list of data and uses <a href="https://developer.android.com/reference/android/support/v7/util/DiffUtil.html" target="_blank" rel="noopener">DiffUtil</a> internally in a separate thread to compute the changes in the list.</li>
	<li><strong><a href="https://fblitho.com/javadoc/com/facebook/litho/sections/common/SingleComponentSection" target="_blank" rel="noopener">SingleComponentSection</a></strong> which is used to represent a single component.</li>
</ul>

<hr />

OK. Now let's start building our news feed app.
<h3>Data Types</h3>
Based on the data we will be rendering three types of items in the list:
<ol>
	<li>News feed with single image</li>
	<li>News feed with multiple scrollable images</li>
	<li>Ad feed showing an advertisement</li>
</ol>
<h3>Feed Data</h3>
Before starting let's see how our feeds data will look like. I have created two model classes for the feeds. For the purpose of this tutorial I have used static values instead of calling any API for news feed.

This is how the model classes look like:

1. FeedData.java - describes the title, description, an array of photos, and other data of the news feed.
<pre>public class FeedData {
  public String title;
  public String description;
  public int[] photos;

  public boolean like;

  public int likeCount;
  public int commentCount;
}</pre>
2. Feed.java - describes the type of feed, the id of the feed and the feed data itself.
<pre>public class Feed {

  public enum FeedType {NEWS_FEED, PHOTO_FEED, AD_FEED}

  public int id;
  public FeedType type;
  public FeedData data;

  @Override
  public String toString() {
    return "Feed [ id: " + id + ", type: " + type + "]";
  }
}</pre>
Here the <code>enum</code> describes what type of feed it is, whether it is a news feed with single image, or a news feed with nested horizontal scrolling images, or a advertisement feed.

Next let us declare the UI for each item of the feed. This will show how our news feed items should look like.

Let's display each item inside a Card component. This card component will show a title, an image or a list of horizontally scrolling images, and a description.

Remember that we will create a Spec class and Litho generates the actual code for the component. We do this by annotating the Spec class with relevant annotation. For our Card component, since it is a layout, we use the <code>@LayoutSpec</code> annotation.

This is how our LayoutSpec class for the Card looks like:

CardElementSpec.java
<pre>@LayoutSpec
public class CardElementSpec {

  @OnCreateLayout
  static Component onCreateLayout(
    ComponentContext c,
    @Prop int id,
    @Prop Feed.FeedType type,
    @Prop String title,
    @Prop String description,
    @Prop int[] imageRes) {

    Component titleComp = Text.create(c, 0, R.style.TextAppearance_AppCompat_Title)
      .text(title)
      .marginDip(YogaEdge.TOP, 16)
      .marginDip(YogaEdge.BOTTOM, 8)
      .marginDip(YogaEdge.HORIZONTAL, 8)
      .typeface(Typeface.DEFAULT_BOLD)
      .textColor(Color.BLACK)
      .build();

    Component descComp = Text.create(c)
      .text(description)
      .maxLines(4)
      .ellipsize(TextUtils.TruncateAt.END)
      .textSizeSp(17)
      .paddingDip(YogaEdge.BOTTOM, 8)
      .marginDip(YogaEdge.VERTICAL, 16)
      .marginDip(YogaEdge.HORIZONTAL, 8)
      .build();

    return Column.create(c)
      .child(titleComp)
      .child((type == Feed.FeedType.NEWS_FEED || type == Feed.FeedType.AD_FEED) ?
        getImageComp(c, imageRes[0]) : getRecyclerComp(c, imageRes))
      .child(descComp)
      .build();

  }

  private static Component getImageComp(ComponentContext c, int imageRes) {
    return Image.create(c)
      .drawableRes(imageRes)
      .widthPercent(100)
      .heightDip(200)
      .scaleType(ImageView.ScaleType.CENTER_CROP)
      .build();
  }

  private static Component getRecyclerComp(ComponentContext c, int[] imageRes) {
    return RecyclerCollectionComponent.create(c)
      .heightDip(200)
      .itemDecoration(new ImageItemDecoration())
      .recyclerConfiguration(new ListRecyclerConfiguration&lt;&gt;(LinearLayoutManager.HORIZONTAL, false))
      .section(
        DataDiffSection.&lt;Integer&gt;create(new SectionContext(c))
          .data(CardElementSpec.getImageArray(imageRes))
          .renderEventHandler(CardElement.onRenderImages(c))
          .build()
      )
      .build();
  }

  @OnEvent(RenderEvent.class)
  static RenderInfo onRenderImages(final ComponentContext c, @FromEvent Integer model) {
    return ComponentRenderInfo.create()
      .component(
        Image.create(c)
          .drawableRes(model)
          .widthPercent(100)
          .heightDip(200)
          .scaleType(ImageView.ScaleType.CENTER_CROP)
          .build()
      )
      .build();
  }

  private static List&lt;Integer&gt; getImageArray(int[] imageRes) {
    List&lt;Integer&gt; images = new ArrayList&lt;&gt;(imageRes.length);
    for (int image : imageRes) {
      images.add(image);
    }
    return images;
  }

}</pre>
In the <code>onCreateLayout</code> function we create two <code>Text</code> Components for displaying the title and description of the feed.

Finally we return the layout using a <code>Column</code> component to wrap the title, description and images and display them vertically. Note how we display images here. We check the type of the feed and if it is of type <code>NEWS_FEED</code> or <code>AD_FEED</code> then we call <code>getImageComp()</code> function to display a single image component. Else it is of type <code>PHOTO_FEED</code> and so we call <code>getRecyclerComp()</code>function passing the array of images.

The  <code>getRecyclerComp()</code> function returns a <code><a href="https://fblitho.com/docs/recycler-collection-component" target="_blank" rel="noopener">RecyclerCollectionComponent</a></code>. This Component renders a RecyclerView backed by the Sections data. Here <code>recyclerConfiguration()</code> is used to describe the orientation of the items which is horizontal. Next we provide the images using the <code>DataDiffSection</code>.

<code>DataDiffSection</code> is a built in class part of Sections API for backing the items with data. It is also used to find the changes in a list of data using DiffUtils in a background thread. We can use this to render a horizontally scrolling list of images.

DataDiffSection requires two methods namely <code>data()</code> and <code>renderEventHandler()</code>. The <code>data()</code> is used to pass the data i.e., an array of images. The <code>renderEventHandler()</code> is used to describe the UI that needs to be rendered for each item.

The <code>renderEventHandler()</code> takes a function annotated with <code>RenderEvent</code> as parameter. Take a look at the <code>onRenderImages()</code> function which is annotated with <code>RenderEvent</code> . It takes two params. One is the <code>context</code> and another one is the data of the item which is the image here. This is got from the RenderEvent using the <code>@FromEvent</code> annotation.

So that's it for our Card Component.

And below is how our Card component will look like for single image news feed and multi-image news feed.

&nbsp;

<div class="separator" style="clear:both;text-align:center;">
<img class="size-full wp-image-680 aligncenter" src="/assets/imgs/news_feed_single.png" alt="news feed single" width="468" height="468" />
<img src="/assets/imgs/multi-image-news-feed-gif.gif" alt="multi image news feed" width="263" height="468">
</div>

[gallery ids="707,706" type="rectangular"]

So we have declared how our UI will look for each news feed.

Next we are going to display all the three types of cards in a list. For this we need a <code>RecyclerCollectionComponent</code>. Let's create it in our MainActivity.
<pre>@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(savedInstanceState);

  final ComponentContext c = new ComponentContext(this);
  final Component component = RecyclerCollectionComponent.create(c)
    .section(ListSection.create(new SectionContext(c)).build())
    .build();

  final LithoView lithoView = LithoView.create(c, component);
  setContentView(lithoView);

}</pre>
Here <code>ListSection</code> is the Section that we will create to display the news feeds. We will create a Spec class called <code>ListSectionSpec</code>. We will create the news feed such that the news feed data is fetched in batches of 15. So when we reach the last item we will show a progress bar and fetch the next batch of items.

Since we need to display both the news feed and progress bar at the end, let's annotate the ListSectionSpec class with <code><a href="https://fblitho.com/docs/group-sections" target="_blank" rel="noopener">GroupSectionSpec</a></code>. This class is used to describe different sections of a list. Let's annotate the ListSectionSpec with GroupSectionSpec.

There are few methods that we need to override in this class.

First let's override a method annotated with <code>@OnCreateInitialState</code>. Here we will describe the initial state of the list by setting the initial data and other states. For our case, we need initial batch of news feed data. So let's have two integers <code>start</code> and <code>count</code> that denote the starting index and the size of the batch of data respectively. Feeds are denoted by a List <code>List&lt;Feed&gt;</code>. Finally a boolean <code>isFetching</code> to denote whether the fetching of next batch is going on now or not, which is false initially.
<pre>@OnCreateInitialState
static void createInitialState(
  final SectionContext c,
  StateValue&lt;List&lt;Feed&gt;&gt; feeds,
  StateValue&lt;Integer&gt; start,
  StateValue&lt;Integer&gt; count,
  StateValue&lt;Boolean&gt; isFetching
) {
  start.set(0);
  count.set(15);
  feeds.set(new DataService().getData(0, 15).feeds);
  isFetching.set(false);
}</pre>
Here each state variable is wrapped with <code>StateValue</code> which provides get and set methods to read and write the new states. Initially the starting index will be 0 and we will fetch a batch of 15 news feeds. So the count will be 15.

I have created a class called DataService where I will fetch the news feed data using the start index of the batch and count, and return them.

Now we need to declare the children that need to be rendered for each item. So let's override a method annotated with <code>@OnCreateChildren</code>.
<pre>@OnCreateChildren
static Children onCreateChildren(
  final SectionContext c,
  @State List&lt;Feed&gt; feeds
) {
  Children.Builder builder = Children.create();
  for (int i = 0; i &lt; feeds.size(); i++) {
    Feed model = feeds.get(i);
    builder
      .child(
        SingleComponentSection.create(c)
          .key("" + model.id)
          .component(
            Card.create(c)
              .content(
                CardElement.create(c)
                  .id(model.id)
                  .type(model.type)
                  .title(model.data.title)
                  .description(model.data.description)
                  .imageRes(model.data.photos)
                  .build()
              )
              .cardBackgroundColor(Color.WHITE)
              .elevationDip(6)
              .build()
          )
      );
  }
  builder.child(
    SingleComponentSection.create(c)
      .component(ProgressLayout.create(c))
      .build()
  );
  return builder.build();
}</pre>
Here the children of the <code>GroupSectionSpec</code> is represented by the Children class inside which we pass each child element.

The Children class requires Section as it's child. So we use the <code>SingleComponentSection</code> to represent each item. We must provide unique <code>key</code> for each Section to tell that each Section is different from others.

Inside the <code>SingleComponentSection</code> I am creating a Card component using <code>Card.create()</code> passing in our <code>CardElement</code> Component. We pass the news feed details to the <code>CardElement</code> component as props.

After adding all the feed items, we pass a ProgressBar as the last item of the list. We create a LayoutSpec for ProgressBar and wrap it with <code>SingleComponentSection</code> and add it as the child to the Children class.

Here is the LayoutSpec for ProgressBar.
<pre>@LayoutSpec
public class ProgressLayoutSpec {

  @OnCreateLayout
  static Component onCreateLayout(ComponentContext c) {
    return Column.create(c)
      .child(
        Progress.create(c)
          .widthDip(40)
          .heightDip(40)
          .alignSelf(YogaAlign.CENTER)
          .build()
      )
      .build();
  }

}</pre>
Next we can initialize our data fetching services in a method annotated with <code>@OnCreateService</code>.
<pre>@OnCreateService
static DataService onCreateService(
  final SectionContext c,
  @State List&lt;Feed&gt; feeds,
  @State int start,
  @State int count
) {
  return new DataService();
}</pre>
DataService is where the actual data fetching happens. Let's look at its code shortly. Before that we need to create two more methods annotated with <code>@OnBindService</code> and <code>@OnUnbindService</code>.

The method annotated with <code>@OnBindService</code> will be called once the service is ready for use. Here we can start a network request or set any listeners.

The method annotated with <code>@OnUnbindService</code> is called after fetching is completed. Here we can reset any listeners and clear unwanted data we previously set in <code>@OnBindService</code> .

I am going to set a listener for identifying when data fetching is completed. These are the methods.
<pre>@OnBindService
static void onBindService(final SectionContext c, final DataService service) {
  service.registerLoadingEvent(ListSection.onDataLoaded(c));
}

@OnUnbindService
static void onUnbindService(final SectionContext c, final DataService service) {
  service.unregisterLoadingEvent();
}</pre>
Now let's look at the DataService class. For the purpose of the blogpost, I am not going to call any API for fetching news feeds. Instead I am using some static texts and images for news feed.

Inside my DataService class:
<pre>private EventHandler&lt;FeedModel&gt; dataModelEventHandler;

private Random r = new Random();

public void registerLoadingEvent(EventHandler&lt;FeedModel&gt; dataModelEventHandler) {
  this.dataModelEventHandler = dataModelEventHandler;
}

public void unregisterLoadingEvent() {
  this.dataModelEventHandler = null;
}

public void fetch(final int start, final int count) {
  new Handler().postDelayed(new Runnable() {
    @Override
    public void run() {
      FeedModel feedModel = getData(start, count);
      dataModelEventHandler.dispatchEvent(feedModel);
    }
  }, 2000);
}

public void refetch(final int start, final int count) {
  new Handler().postDelayed(new Runnable() {
    @Override
    public void run() {
      FeedModel feedModel = getData(start, count);
      dataModelEventHandler.dispatchEvent(feedModel);
    }
  }, 2000);

}

public FeedModel getData(int start, int count) {
  FeedModel feedModel = new FeedModel();
  feedModel.feeds = new ArrayList&lt;&gt;(count);
  for (int i = start; i &lt; start + count; i++) {
    Feed feed = generateFeed(i);
    feedModel.feeds.add(feed);
  }
  return feedModel;
}</pre>
Take a look at the <code>fetch</code> and <code>refetch</code> methods. Here I am mocking the network latency using a delayed Handler. Inside it I am calling <code>getData()</code> method which returns a class called FeedModel that I created.
<pre>@Event
public class FeedModel {
  public List&lt;Feed&gt; feeds;
}</pre>
This FeedModel class is annotated with <code>@Event</code> to notify the listener when the data fetching is completed.

Note that we have a variable <code>dataModelEventHandler</code> of type EventHandler. This is used to dispatch certain events that we can handle. Here since we need to trigger when data has been fetched, we will call <code>dataModelEventHandler.dispatchEvent(feedModel)</code> to notify that the data is fetched successfully.

And inside our ListSectionSpec class we override the listener callback as follows.
<pre>@OnEvent(FeedModel.class)
static void onDataLoaded(final SectionContext c, @FromEvent List&lt;Feed&gt; feeds) {
  ListSection.updateData(c, feeds);
  ListSection.setFetching(c, false);
  SectionLifecycle.dispatchLoadingEvent(c, false, LoadingState.SUCCEEDED, null);
}</pre>
In this method we get the fetched list of feeds. We then add these new feeds to existing feeds and set the boolean <code>isFetching</code> to false. We also notify that the loading event was completed successfully using the <code>SectionLifecycle</code> method. Since we need to change the current state of the feeds list by adding new feeds we call <code>ListSection.updateData(c, feeds);</code>. Similarly for changing <code>isFetching</code> to false we call <code>ListSection.setFetching(c, false);</code>.

Here is the code for updateData() method.
<pre>@OnUpdateState
static void updateData(
  final StateValue&lt;List&lt;Feed&gt;&gt; feeds,
  final StateValue&lt;Integer&gt; start,
  @Param List&lt;Feed&gt; newFeeds
) {
  if (start.get() == 0) {
    feeds.set(newFeeds);
  } else {
    List&lt;Feed&gt; feeds1 = new ArrayList&lt;&gt;();
    feeds1.addAll(feeds.get());
    feeds1.addAll(newFeeds);
    feeds.set(feeds1);
  }
}</pre>
Here we check if the value of <code>start</code> is 0. If it is, it means that this is the initial data. Otherwise it is the next batch of feed data. Note that the values of state variables are immutable. So we just set the <code>newFeeds</code> to <code>feeds</code> list if start is 0. Otherwise, we will create a new list and add all the items in <code>newFeeds</code> and <code>feeds</code> to it.

Below is the code for updating <code>isFetching</code>.
<pre>@OnUpdateState
static void setFetching(final StateValue&lt;Boolean&gt; isFetching, @Param boolean fetch) {
  isFetching.set(fetch);
}</pre>
So far we have completed how the news feeds are displayed. Next let us see how to trigger the fetching of next batch of feeds when we reach the end of scrolling.

So to listen for the scrolling, Sections API provides an annotation <code>@OnViewportChanged</code> . The method annotated with it will be called whenever the list is scrolled. The method takes parameters for the first visible position in the list, last visible position, total count of the items displayed by the list, etc. We can also access our state variables by passing them as parameters. Below is my code.
<pre>@OnViewportChanged
static void onViewportChanged(
  SectionContext c,
  int firstVisiblePosition,
  int lastVisiblePosition,
  int firstFullyVisibleIndex,
  int lastFullyVisibleIndex,
  int totalCount,
  DataService service,
  @State List&lt;Feed&gt; feeds,
  @State int start,
  @State int count,
  @State boolean isFetching
) {
  if (totalCount == feeds.size() &amp;&amp; !isFetching) {
    ListSection.setFetching(c, true);
    ListSection.updateStartParam(c, feeds.size());
    service.fetch(feeds.size(), count);
  }
}</pre>
Here I am checking if we reached the list end. And also checking if fetching is not started already. If condition is true, then it means we are going to start fetching next batch. So we toggle the fetching state by making <code>isFetching</code> as <code>true</code> and also update the <code>start</code> parameter to the current feed lists size (i.e., if initially the feed list size is 15, the next value for <code>start</code> becomes 15). Finally we call the service to fetch the next 15 items.

When we run the app, this is how lazy loading looks like:

<div class="separator" style="clear:both;text-align:center;">
<img class="alignnone size-full wp-image-714" src="/assets/imgs/lazy-loading-recyclerview.gif" alt="lazy-loading-recyclerview" width="356" height="634" />
</div>

Next let's see how to implement Pull-To-Refresh. This is very easy. In your RecyclerCollectionComponent there is an option to disable PTR using <code>disablePTR(true)</code>. If you didn't mention it, then by default PTR will be enabled.

To receive PTR event whenever user drags, let's create a method annotated with <code>@OnRefresh</code> in our <code>ListSectionSpec</code> class.
<pre>@OnRefresh
static void onRefresh(
  SectionContext c,
  DataService service,
  @State List&lt;Feed&gt; feeds,
  @State int start,
  @State int count
) {
  ListSection.updateStartParam(c, 0);
  service.refetch(0, 15);
}</pre>
Here whenever you pull to refresh, this method gets called. Here you can call the <code>refetch</code> method to refresh the feeds list.

So finally this is how the whole app looks like:

<iframe width="560" height="315" src="https://www.youtube.com/embed/an8O4QjLQ_I" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

You can also enable click events for each items like I showed you in my previous post on Litho.

The source code of the app that I used for this post on <a href="https://github.com/sjthn/LithoNewsFeedDemo" target="_blank" rel="noopener">github</a>.
