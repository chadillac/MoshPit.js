MoshPit.js v0.1
===========================
**Controlled chaos for your views, states, and screen sizes.**

##Elevator Pitch
**Stop managing your views, view states, and their conflicts across devices/screen sizes in javascript**, it is annoying and cumbersome.

Reduce view management logic in your javascript and let the power of LESS/CSS and MoshPit.js deal with
views, states, and view conflict resolution.  Now make all of that easy to use and a snap to integrate into existing
applications and frameworks.  Make it so easy I don't need to touch a single line of javascript to use it. Now make it easy
enough that designers can modify the look, feel, and behavior of the application without needing to change a line of code.

##Show me some demos
###What do these demos do?

1. adjust to screen size changes without `@media` queries <sub>1</sub>
2. modifies view styles to deal with conflicts <sub>2</sub>
3. let's you apply an alternative view state on large screens <sub>3</sub>
4. hides some controls based on screen size <sub>4</sub>
5. on small screens the UI works to only show 1 panel at a time <sub>5</sub>

<sub>1.1 you can still use `@media` queries and I actually think you *should*, they were omitted to reduce confusion.</sub>  
<sub>2.1 views will consume as much space as we tell them to based on what views are currently shown</sub>  
<sub>3.1 screen sizes change styles and behavior of shown elements</sub>  
<sub>4.1 the blue buttons won't be shown on screens smaller than 900px wide</sub>  
<sub>5.1 we also hide controls to only show controls applicable to the current view state</sub>  

*note: all of these demos do the same thing, but they all do it in diffent ways using various javascript implementations.*

###[no javascript demo](http://chadillac.github.io/MoshPit.js/demos/demo.html)
~~javascript~~ | [html](https://github.com/chadillac/MoshPit.js/blob/master/demos/demo.html)  
This demo requires no javascript to be written.  It utilizes `data-moshpit` on HTML elements with 
`data-view` and `data-state` to tell `MoshPit.js` when and what it should be doing with a view.  
*note: yes, it still requires javascript, but no additional javascript needed to be written to use `MoshPit.js`*

###[vanilla demo](http://chadillac.github.io/MoshPit.js/demos/demo.vanilla.html)
[javascript](http://chadillac.github.io/MoshPit.js/docs/vanilla.html)
 | 
[html](https://github.com/chadillac/MoshPit.js/blob/master/demos/demo.vanilla.html)  
This demo uses basic design patterns found in most applications, it uses `MoshPit.js` via it's global namespace 
from globally available functions.

###[jquery demo](http://chadillac.github.io/MoshPit.js/demos/demo.jquery.html)
[javascript](http://chadillac.github.io/MoshPit.js/docs/jquery.html)
 | 
[html](https://github.com/chadillac/MoshPit.js/blob/master/demos/demo.jquery.html)   
This demo uses generic/common jQuery implementations and jQuery `.on` events to communicate with `MoshPit.js` and
operates inside of a privately scoped closure but relies on `MoshPit.js` global namespace.

###[jquery.auto demo](http://chadillac.github.io/MoshPit.js/demos/demo.jquery.auto.html)
[javascript](http://chadillac.github.io/MoshPit.js/docs/jquery.auto.html)
 | 
[html](https://github.com/chadillac/MoshPit.js/blob/master/demos/demo.jquery.auto.html)  
This demo uses jQuery but it utilizes `MoshPit.join` to automate the tracking/handling of it's views.  It also
operates inside of a privately scoped closure and does not rely on the `MoshPit` global beyond the initial `.join`
call to enable automated tracking/management.

###[marionette demo](http://chadillac.github.io/MoshPit.js/demos/demo.marionette.html)
[javascript](http://chadillac.github.io/MoshPit.js/docs/marionette.html)
 | 
[html](https://github.com/chadillac/MoshPit.js/blob/master/demos/demo.marionette.html)  
This demo uses `Marionette` `Region`s and `ItemView`s and shows intergration with them via `MoshPit.join`.  
*note: all of the other design patterns listed above can be used with `Marionette` design patterns too... if you're into that kind of thing.*


##Let's talk some code.
As said all of our view management (position, size, colors, etc.) is all handled in CSS (where it should be!) and
relies on inheritence, chaining, and cascading to deal with conflicts.  With CSS it's a lot of extra typing (but possible
if you're a masochist).  Using LESS however we greatly reduce the amount of code we have to write and we get nesting
and chaining in a very intuitive format.  

###[LESS file used in all of the demos](http://github.com/chadillac/MoshPit.js/blob/master/demos/less/demo.less)
This is the LESS file that was parsed via `lessc` to produce the final CSS file used in all of the demos.

###[CSS file used in all of the demos](https://github.com/chadillac/MoshPit.js/blob/master/demos/demo.css)
This is the results from the LESS file above after processing with `lessc`.

###[Annotated source of MoshPit.js](http://chadillac.github.io/MoshPit.js/docs/moshpit.html)
This is an annotated version of the source code.  
*note: [docco is awesome.](http://jashkenas.github.io/docco/)*
