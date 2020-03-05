---
layout: default
title: "Basics of Facebook Litho – a Declarative UI framework for Android"
categories: [post]
tags: [android, fblitho]
---

# Basics of Facebook Litho – a Declarative UI framework for Android

Facebook this year released <a href="https://fblitho.com/" target="_blank" rel="noopener">Litho</a>, a declarative UI framework primarily for rendering complex lists.
<blockquote>Litho is a library which allows us to create complex UIs declaratively with optimizations under the hood.</blockquote>
<h3>Inspirations from React</h3>
Litho is inspired by <a href="https://reactjs.org/" target="_blank" rel="noopener">React</a>, which is a declarative framework for web front-end. We declare what the UI should look like based on data. Each UI is considered a Component (for e.g. TextView, ImageView, EditText, etc.).

The data is passed to the component as variables annotated with <strong>Props</strong>. Props are immutable values. We can only use it, but cannot change it. But how do you handle state changes without changing data? For that we use annotation called <strong>State</strong>. States can hold values that may change. We can create states inside components. And perform an event to change the state, which causes the component to re-render to make the changes visible.

In Litho, we declare what the UI should look like<strong> </strong>and at compile time, it generates the actual code for the component. Finally all the components are wrapped inside a root ViewGroup called <code>LithoView</code>.

We need not do any kind of layout design in XML since every view we render has be declared through code.

Using Litho has several performance benefits. When you are creating a complex list of items, it will be very useful.
<h3>How Litho Optimizes</h3>
Litho optimizes the layouts by the following ways:
<ul>
	<li><strong>Asynchronous Layout - </strong>Litho does the measure and layout of views in background thread ahead of time preventing the need to block the UI thread.</li>
	<li><strong>Flatter Views - </strong>Litho helps us reduce the number of ViewGroups needed by internally making use of Yoga, another layout library from Facebook.</li>
	<li><strong>Fine-grained recycling -</strong> It recycles each views in an item separately. This enables to reuse the views in any item. This removes the need of having multiple view types since one view from a view type can be reused on another view type.</li>
</ul>
Since every component is created declaratively, the code will be easy to test as well. This is another benefit of Litho.
<h3>How components are created</h3>
Litho uses annotation processor to generate the actual components that need to be rendered. Popular libraries like <a href="http://jakewharton.github.io/butterknife/" target="_blank" rel="noopener">Butterknife</a> uses annotation processing to generate the required code.

In Litho we must create a <strong>Spec</strong> class where we declare what are the components needed and how they should look. So a Spec class is where we declare what needs to be rendered. And at compile time, the code generation happens based on this class.

To create a spec class we must suffix the class name with the word <code>Spec</code>. And this class should be annotated with some Spec annotations.

For example to render a layout we must create a Spec class annotated with <code>@LayoutSpec</code>. This annotation allows Litho to understand that this is a Spec class and it should generate code for the actual component. The <code>LayoutSpec</code> annotation is used to render layouts.

Similarly to create custom views and drawables (not ViewGroups), we use the <code>@MountSpec</code> annotation. Litho provides built-in components for ImageViews, TextViews, etc. You can look at all the components available <a href="https://fblitho.com/javadoc/com/facebook/litho/widget/package-frame.html" target="_blank" rel="noopener">here</a>.

OK. Now let us learn how to create components.

To start, we must include the necessary dependencies:
<h3>Library dependencies</h3>
I am using Android Studio 3.0.1 and Litho version 0.12.0

<strong>Litho dependencies:</strong>
<pre>// litho
implementation 'com.facebook.litho:litho-core:0.12.0'
implementation 'com.facebook.litho:litho-widget:0.12.0'
compileOnly 'com.facebook.litho:litho-annotations:0.12.0'
annotationProcessor 'com.facebook.litho:litho-processor:0.12.0'</pre>
<strong>SoLoader:</strong>

Litho uses <strong>Yoga</strong>, a layout engine responsible for flatter view hierarchies. Since Yoga uses native C++ code, to load them we use the SoLoader dependency:
<pre>implementation 'com.facebook.soloader:soloader:0.2.0'</pre>
Next in your Application class' <code>onCreate()</code>, initialize the SoLoader:
<pre>SoLoader.init(this, false);</pre>
<br />
<hr />

Now let's try creating a simple component. We will create a TextView with some text in it.
<h3>Create a simple Text Component</h3>
Litho provides several built-in components. For TextView it has a <code>Text</code> component. So we need not create any spec class.
<pre>Component text = Text.create(c)
  .text("Welcome to Litho Basic tutorial")
  .textSizeSp(22)
  .build();</pre>
Here we create a Text component passing in a context. Litho provides a built-in class which wraps the activity context called <code>ComponentContext</code>. This is how we create it:
<pre>final ComponentContext c = new ComponentContext(this);</pre>
The <code>Text.create()</code> returns a <a href="https://fblitho.com/javadoc/com/facebook/litho/widget/Text.Builder.html" target="_blank" rel="noopener">component builder</a> subclass which exposes the attributes of the component like setting text, text size, text color, etc. Finally we call <code>build()</code> to return the Text Component.

Now in our Activity's <code>onCreate()</code> we call <code>setContentView()</code> passing in the <code>LithoView</code>. As described earlier LithoView is the root container that wraps all the components. Here it wraps the Text Component:
<pre>final LithoView lithoView = LithoView.create(c, text);
setContentView(lithoView);</pre>
This outputs the below screen:

<img class="size-medium wp-image-667 aligncenter" src="/assets/imgs/litho_text_component.png" alt="A simple Text Component" width="300" height="96" />

OK. Looks good. Now let's create a component with two Text components in it, one for title and another for description.
<h3>LayoutSpec - Create a Layout with multiple child views</h3>
For this we need a layout that wraps the two texts. So let's create a layout spec class. I call this <code>MyComponentSpec</code> annotated with <code>@LayoutSpec</code>.

To create a layout we must implement a function annotated with <code>@OnCreateLayout</code>:
<pre>@OnCreateLayout
static Component onCreateLayout(final ComponentContext c) {
}</pre>
This function provides a <code>ComponentContext</code> as parameter which we can use to create child components.

This is how the code looks like after creating child components:
<pre>@LayoutSpec
public class MyComponentSpec {

  @OnCreateLayout
  static ComponentLayout onCreateLayout(final ComponentContext c) {
    Component title = Text.create(c, 0, R.style.TextAppearance_AppCompat_Title)
      .text("Welcome!")
      .typeface(Typeface.defaultFromStyle(Typeface.BOLD))
      .build();

    Component description = Text.create(c)
      .text("Let's learn the basics of Litho")
      .textSizeSp(17)
      .build();

    return Column.create(c)
      .child(title)
      .child(description)
      .build();

  }

}</pre>
Notice here that we create the title and desription Text components and pass them as children to <code>Column</code>. Column creates a container to wrap the children and render them vertically one below another. To render the children horizontally it provides a <code>Row</code> class.

This is how the screen looks:

<img class="size-medium wp-image-672 aligncenter" src="/assets/imgs/litho_title_desc_text_component1.png?w=600" alt="Title and description using Text Component" width="300" height="104" />

The alignments of the components are done by the Yoga framework. It uses APIs similar to flexbox for laying out components. To know the concepts of flexbox check <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes" target="_blank" rel="noopener">this site</a>.

To center align the texts horizontally, call <code>alignItems(YogaAlign.CENTER)</code> on <code>Column</code>.
<h3>Border Styles</h3>
Litho also provides ways to set border styles. If you want to display a dashed line border for a component, simply call the <code>border()</code> and pass a <code>Border</code>:
<pre>Column.create(c)
  .child(title)
  .child(description)
  .border(
    Border.create(c)
      .color(YogaEdge.ALL, Color.BLACK)
      .widthDip(YogaEdge.ALL, 2)
      .dashEffect(new float[]{10f, 5f}, 0f)
      .build()
  )
  .heightDip(60)
  .build();</pre>
This is how it looks:

<img class="size-medium wp-image-673 aligncenter" src="/assets/imgs/litho_component_border.png" alt="Component with dashed border style" width="300" height="109" />
<h3>Prop - Passing values to components</h3>
Now let's pass some dynamic texts to show in Text components. For this we use <code>@Prop</code> annotation.

Since we need to display title and description, we will pass two props:
<pre>@OnCreateLayout
static Component onCreateLayout(
  final ComponentContext c,
  <span style="color:#0000ff;">@Prop String title,</span>
<span style="color:#0000ff;">  @Prop String desc</span>
) {
   //...
}</pre>
After specifying them, build the project. Now the necessary code will be generated which you can call from your Activity:
<pre>final LithoView lithoView = LithoView.create(
  c,
  MyComponent.create(c)
    .<span style="color:#0000ff;">title</span>("This is a dynamic title")
    .<span style="color:#0000ff;">desc</span>("Here is the description")
    .build()
);</pre>
Notice that we can access <code>title</code> and <code>desc</code> prop to set the title and description. So that's how you pass props to a component.

Remember that you cannot change the prop value from the component. Props are immutable.
<h3>Events and State changes</h3>
Since Props are immutable, we cannot use them to perform UI state changes. For this Litho provides a <code>@State</code> annotation. Variables annotated with this may denote the state of a UI component. So whenever an event occurs, we can alter the value of the state variable. This will trigger a re-render of the component.

For this, let's create a counter. Each time when a Button is pressed the counter will be increased by 1.

The count is displayed by a Text component. The initial value will be 0. Since the count needs to be changed, we will use <code>@State</code> to specify the count value.

To specify the initial value we must override the <code>@OnCreateInitialState</code> method. It takes a <code>ComponentContext</code> parameter and a <code>StateValue</code> variable. The StateValue variable is a wrapper around the state. Here we use a integer to specify the count.

This is how the method looks like:
<pre>@OnCreateInitialState
static void createInitState(
  final ComponentContext c,
  StateValue count
) {
  count.set(0);
}</pre>
You can specify a <code>StateValue</code> for each State variable you want to initialize.

We can access the count State from <code>onCreateLayout</code> method like how we access a prop:
<pre>@OnCreateLayout
static Component onCreateLayout(
  final ComponentContext c,
  <span style="color:#0000ff;">@State int count</span>
) {
}</pre>
Next, we have to create a Button to change the counter. Since there is no widget for Button in Litho, we can create one using the <code>@MountSpec</code> annotation. We can create views and drawables with this annotation.

So our Button component will look like this:
<pre>@MountSpec
public class CounterButtonSpec {

  @OnCreateMountContent
  static Button onCreateMountContent(ComponentContext c) {
    return new Button(c);
  }

  @OnMount
  static void onMount(
    ComponentContext c, Button button) {
    button.setText("Counter");
  }

}</pre>
Here we must implement at least the <code>OnCreateMountContent</code> function. This is where we return what view or drawable we want to create.

In <code>@OnMount</code> the second argument will always be the view/drawable that we create. Here it is Button. In this method we set the text.

And in our LayoutSpec class we can render this along with the count Text component as follows:
<pre>@OnCreateLayout
static Component onCreateLayout(
  final ComponentContext c,
  @State int count
) {

  Component textComp = Text.create(c)
    .text(String.valueOf(count))
    .textSizeSp(18)
    .build();

  Component buttonComp = CounterButton.create(c)
    .widthDip(100)
    .heightDip(48)
    .marginDip(YogaEdge.RIGHT, 16)
    .build();

  return Row.create(c)
    .child(buttonComp)
    .child(textComp)
    .heightDip(50)
    .alignItems(YogaAlign.CENTER)
    .build();

}</pre>
Now the UI looks as below:

<img class="size-medium wp-image-678 aligncenter" src="/assets/imgs/litho_button_and_text_counter.png" alt="litho_button_and_text_counter" width="300" height="94" />

Next we want to update the count when the button is pressed every time.

To handle click event, we must implement a event of type <code>ClickEvent</code> which is equivalent to Android's <code>onClick</code> method.
<pre>@OnEvent(ClickEvent.class)
static void onButtonClick(final ComponentContext c) {
}</pre>
Next the state can be updated from a method annotated with <code>@OnUpdateState</code>. Here we can use the StateValue parameter to update the count.
<pre>@OnUpdateState
static void updateCount(StateValue count) {
  count.set(count.get() + 1);
}</pre>
After we build the project, we can call this method from the click event.
<pre>MyComponent.updateCount(c);</pre>
You can also pass any parameters to the <code>onButtonClick()</code> call which can be accessed from the update method by annotating the parameter with <code>@Param</code>.

Finally we should set the click event handler on the component builder. We can set it using <code>clickHandler()</code>:
<pre>Component buttonComp = CounterButton.create(c)
  .widthDip(100)
  .heightDip(48)
  .clickHandler(MyComponent.onButtonClick(c))
  .marginDip(YogaEdge.RIGHT, 16)
  .build();</pre>
Now when you run the app you can update the count.

<img class="size-full wp-image-680 aligncenter" src="/assets/imgs/fblitho_event_and_state_change.gif" alt="fblitho_event_and_state_change" width="205" height="365" />

That's it. Now you should have understood the basics of how UIs can be rendered using Litho.

My next post will cover creating a complex list using Sections API.
<blockquote><strong>Sections API</strong> is a new feature that was added to Litho recently which supports most of RecyclerView features under the hood including calculating changes in data using DiffUtil on a background thread. The Sections API allows creating complex RecyclerViews easily.</blockquote>
Until then you can learn more about Litho and Sections from the <a href="https://fblitho.com/docs/sections-intro" target="_blank" rel="noopener">official docs</a>.

<strong>References:</strong>
<ul>
	<li><a href="https://fblitho.com/" target="_blank" rel="noopener">Official docs</a></li>
	<li><a href="https://github.com/facebook/litho" target="_blank" rel="noopener">Official GitHub source codes</a></li>
</ul>
