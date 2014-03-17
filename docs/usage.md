Using MoshPit.js
=============================

###Dependencies

`MoshPit.js` has one dependency, and that is jQuery, if you have jQuery, you're golden pony boy!

It was built on 1.11.0, but it should work pretty much universally across the versions.  If you 
find an issue... report it... or fix it (please fix it!) and request a pull.

###Include MoshPit.js in your project

To use `MoshPit.js` you'll need to include it in your page **after** jQuery.

    <script type="text/javascript" src="[path/to/js/]jquery.js"></script>
    <script type="text/javascript" src="[path/to/js/]moshpit.js"></script>


###Start tracking a *view*

     // using a selector
     MoshPit.join('#my_view');

     // using a string that resolves to a selector
     MoshPit.join('my_view');

     // using a jQuery object
     var $my_view = $('#my_view');
     MoshPit.join($my_view);

     // using a Marionette component
     MoshPit.join(MyApp.myRegion);
     // using a Marionette component from it's initialize func
     MoshPit.join(this);

###Why should I use tracking?

When you let `MoshPit` track an element it will catch calls to `$.show`,`$.hide`, and `$.toggle` meaning you can use jQuery or other libraries just as you'd expect... but `MoshPit` is silently watching... waiting... always vigilant... like Batman.

###No! I just want to do it myself!

Okay, so you can use all of these methods, and they work exactly how you'd expect.

     // views
     MoshPit.hide('my_view');
     MoshPit.show('my_view');
     MoshPit.toggle('my_view');

     // states
     MoshPit.add_state('my_state');
     MoshPit.remove_state('my_state');
     MoshPit.toggle_state('my_state');

###Okay, but how do I know if something is hidden or shown?

     MoshPit.is_shown('my_view') 
     > true || false

     MoshPit.is_state('my_state')
     > true || false

###Can I stop tracking something?

Yep, just leave the pit, brah.

     MoshPit.leave('my_view');

###Can I chain the things?

Kind of, we're no jQuery, but you can chain *some* functionality... this will improve.

     // join and show
     MoshPit.join('#my_view_1,#my_view_2,#my_view_3').show('#my_view_1,#my_view_3');
     
     // show and hide
     MoshPit.show('#my_view_1,#my_view3').hide('#my_view_2');
     
     // join and leave
     MoshPit.join('#my_view_1').leave('#my_view_3');
     
     // add some states, remove some states.
     MoshPit.add_state('my,states,here').remove_state('buh,bye,old_states');
     
     // remove states, and show a sign up page
     MoshPit.remove_state('full_screen,lower_lights').show('sign_up_splash');

###Wait a second, I thought you said I didn't have to use JavaScript!?

`MoshPit` monitors the DOM for click events, if you use these HTML data attributes, users clicks will be caught and processed 
by `MoshPit` (handy for dynamic views, allows you to link functionality between components without needing JS communications, affect multiple views with a single HTML interaction, etc).

`data-moshpit="[method name]" data-view="[the view]"`  
`data-moshpit="[method name]" data-state="[the state]"`  

    <button data-moshpit="[the method]" data-view="[the view]">MoshPit view action</button>
    <button data-moshpit="[the method]" data-state="[the state]">MoshPit state action</button>

    // working examples
    <a href="#" data-moshpit="toggle" data-view="my_view">toggle #my_view</a>
    <a href="#" data-moshpit="toggle_state" data-state="my_state">toggle my_state</a>
    <input type="button" data-moshpit="show" data-view="#my_view" value="show #my_view">
    <div data-moshpit="add_state" data-state="my_state">I don't know why you would... but you could.</div>
    
    // change multiple views/states
    <button data-moshpit="hide" data-state="header,footer">hide stuff</button>
    <button data-moshpit="add_state" data-state="lower_lights,full_screen,hide_header,hide_footer">go fullscreen</button>

###How does it know about screen sizes, or how do I know about them in my LESS/CSS?

`MoshPit` monitors the window for resizes and then updates the page when we detect a change.
By default we notify you of 4 layouts.

    .mobile
    .tablet
    .desktop
    .desktop-wide

If you'd like to customize these sizes window.MoshPitSizes is a global object we consume on DOM ready, if you make changes to this or completely override it, they'll take affect when `MoshPit` does it's thing.  The github repo includes a [build bash script](https://github.com/chadillac/MoshPit.js/tree/master/build) (Linux, it's pretty great.) for minifying the source via uglify-js if you need to modify the sizes and want a minified version for production.

###What if I need to make a decision on the screen size at some point, how can I know what size is currently set?

     MoshPit.get_size()
     > 'desktop'

You can call `MoshPit.get_size()` and it will return the currently active size setting based on the windows measurements when it's called.

###Okay, but I don't really know LESS all that well...

[o rly?](http://lesscss.org/)

###You're good to go!

Now go spread the word and/or [buy me a beer.](https://www.gittip.com/chadillac/)
