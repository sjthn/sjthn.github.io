---
layout: default
title: Efficient coding using keyboard shortcuts - Android Studio
date: 2023-11-02 02:05 +0530
---
# Efficient coding using keyboard shortcuts - Android Studio
*- {{ page.date | date: "%b %-d. %Y" }}*

Using keyboard shortcuts while writing code helps you speed up your work because as developers you will be majorly using keyboard. So doing most of the stuffs using keyboard helps you reduce switching between mouse and keyboard which takes more time comparatively. The only thing is that you have to do is to memorize and keep on using the shortcuts to use them effectively.

Here are some of the keymaps that I often use in Android Studio. These shortcuts are tested in Android Studio Giraffe version 2022.3.1.

### Search a file
To search a file in the project.<br>
Win: Ctrl+Shift+N<br>
Mac: Cmd+Shift+O

### Search a class
To search for a class.<br>
Win: Ctrl+N<br>
Mac: Cmd+O

### Search a text anywhere in the project
Win: Ctrl+Shift+F<br>
Mac: Cmd+Shift+F

### Code completion
By default there will be code completion dropdown showing up automatically. But somtimes you might need to trigger the dropdown manually using the following keymap.

Win: Ctrl+Space<br>
Mac: Ctrl+Space

### Quick fix
To get quick fix suggestions for an editor error/warning.

Win: Alt+Enter<br>
Mac: Option+Return
 
### Generate popup
Press the following keys to display the generate dropdown menu to generate things like tests, equals and hashcode functions, etc.

Win: Alt+Insert<br>
Mac: Ctrl+Enter
 
### Go to a specific line of the file
Win: Ctrl+G<br>
Mac: Cmd+L

### Incremental/decremental code selection
Win: Ctrl+W to increment and Ctrl+Shift+W to decrement<br>
Mac: Option+Up/Down

### Move selected code up/down
To move a line or multiple lines of code, select them and then press.

Win: Alt+Shift+Up/Down<br>
Mac: Option+Shift+Up/Down

If you want to move a single line, then you can move that without even selecting it.

### Move the code up/down logically based on the language
You can move a block of code up or down logically based on it's position. For example, a line within a function can be moved within that function and not outside that, using the below keymap. Similarly, the whole function can be moved up or down, within or even outside the class. So the code can be moved without causing any syntax issues.

Win: Ctrl+Shift+Up/Down<br>
Mac: Cmd+Shift+Up/Down

### Refactor
#### Rename file, class, method, variable
Win: Shift+F6<br>
Mac: Shift+F6

#### Extract method
Win: Ctrl+Alt+M<br>
Mac: Cmd+Option+M

Similarly IntelliJ offers a lot of options to quickly perform refactoring. I suggest you to checkout `Refactor` option from Actions menu (press Ctrl+Shift+A and type Refactor) to know about the different refactoring options and their shortcuts.

### Multiple cursors
To have multiple cursors at multiple lines.

Win: Double tap Ctrl + Up/Down<br>
Mac: Double tap Option + Up/Down

### Multiple occurrence selection
Allows you to select multiple occurences of a text to edit those occurences in one go. To do that select the text whose occurences you want to multi select, then press

Win: Alt+J to add occurences and Alt+Shift+J to remove occurences<br>
Mac: Ctrl+G to add occurences and Ctrl+Shift+G to remove occurences<br>

### Switch between files
Win: Ctrl+Tab<br>
Mac: Ctrl+Tab

The keymaps provided above are not the exhaustive list. These are some of the keymaps I regularly use. To see all the different keymaps available, go to Settings -> Keymaps.

Start using these in your daily work. Soon you will memorize it.