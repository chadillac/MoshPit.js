MoshPit.js v0.1 [WIP]
===========================
Controlled chaos for your ~~responsive~~ web application views, states, and screen sizes.

##Elevator Pitch
Managing your views, view states, and their conflicts across devices/screen sizes in javascript is annoying and cumbersome, so stop doing it.

Reduce view management logic in your javascript and let the power of LESS/CSS and MoshPit.js deal with
views, states, and view conflict resolution.  Now make all of that easy to use and a snap to integrate into existing
applications and frameworks.  Make it so easy I don't need to touch a single line of javascript to use it. Now make it easy
enough that designers can modify the look, feel, and behavior of the application without needing to change a line of code.

##Show me some demos
*note:All of these demos do the same thing, but they all do it in diffent ways.*

[no javascript demo](http://chadillac.github.io/MoshPit.js/demos/demo.html)
---
This demo requires no javascript to be written.  It utilizes `data-moshpit` on HTML elements with 
`data-view` and `data-state` to tell `MoshPit.js` when and what it should be doing with a view.
*note: yes, it still requires javascript, but no additional javascript needed to be written to use `MoshPit.js`*

###[vanilla demo](http://chadillac.github.io/MoshPit.js/demos/demo.vanilla.html)
This demo uses basic design patterns found in most applications, it uses `MoshPit.js` via it's global namespace 
from globally available functions.

###[jquery demo](http://chadillac.github.io/MoshPit.js/demos/demo.jquery.html)
This demo uses generic/common jQuery implementations and jQuery `.on` events to communicate with `MoshPit.js`

###[jquery.auto demo](http://chadillac.github.io/MoshPit.js/demos/demo.jquery.auto.html)
This demo uses jQuery but it utilizes `MoshPit.join` to automate the tracking/handling of it's views.

###[Marionette demo](http://chadillac.github.io/MoshPit.js/demos/demo.marionette.html)
This demo uses `Marionette` `Region`s and `ItemView`s and shows intergration with them via `MoshPit.join`.
*note: all of the other design patterns listed above can be used with `Marionette` design patterns too... if you're into that kind of thing.*

