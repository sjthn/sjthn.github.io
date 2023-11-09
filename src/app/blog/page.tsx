import { Metadata } from "next";
import styles from "../styles.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
};

export default function Blog() {
  return (
    <div>
      <ul className={styles.blogposts_listing}>
        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2023-10-19-improve-your-coding-productivity-through-keyboard-shortcuts">
              Efficient coding using keyboard shortcuts - Android Studio
            </Link>
            <div className={styles.post_list_date}>- Nov 2, 2023</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2019-11-17-jekyll-setup">
              Steps to setup a blog using Jekyll
            </Link>
            <div className={styles.post_list_date}>- Nov 17, 2019</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2019-03-19-a-case-with-kotlin-let">
              A case with Kotlin let
            </Link>
            <div className={styles.post_list_date}>- Mar 19, 2019</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2018-02-13-creating-a-news-feed-list-using-facebook-lithos-sections-api">
              Creating a News Feed list using Facebook Litho’s Sections API
            </Link>
            <div className={styles.post_list_date}>- Feb 13, 2018</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2017-12-18-how-to-learn-react-native-for-android-ios-devs">
              How to learn React Native – For Android/iOS devs
            </Link>
            <div className={styles.post_list_date}>- Dec 18, 2017</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2017-11-27-basics-of-facebook-litho-a-declarative-ui-framework-for-android">
              Basics of Facebook Litho – a Declarative UI framework for Android
            </Link>
            <div className={styles.post_list_date}>- Nov 27, 2017</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2017-11-09-handle-data-change-in-recyclerview-using-diffutil">
              Handling data change in RecyclerView gracefully using DiffUtil
            </Link>
            <div className={styles.post_list_date}>- Nov 9, 2017</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2017-10-24-android-recyclerview-drag-and-drop-and-swipe-to-dismiss">
              Android RecyclerView – Drag and Drop and Swipe to Dismiss
            </Link>
            <div className={styles.post_list_date}>- Oct 24, 2017</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2017-10-17-android-recyclerview-expandable-headers">
              Android RecyclerView – Expandable Headers
            </Link>
            <div className={styles.post_list_date}>- Oct 17, 2017</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2017-10-12-android-recyclerview-itemdecoration-and-itemanimator">
              Android RecyclerView – ItemDecoration and ItemAnimator
            </Link>
            <div className={styles.post_list_date}>- Oct 12, 2017</div>
          </li>
        </div>

        <div>
          <li className={styles.post_list_item}>
            <Link href="/blog/2017-10-09-android-recyclerview-the-basics">
              Android RecyclerView - The Basics
            </Link>
            <div className={styles.post_list_date}>- Oct 9, 2017</div>
          </li>
        </div>
      </ul>
    </div>
  );
}
