// MoshPit.js 
// ===
// **v0.1**
// ***
//
// <http://chadillac.github.io/MoshPit.js>
//
// Copyright (c)2014 Chad Seaman. Distributed under 
// [MIT license](https://github.com/chadillac/MoshPit.js/blob/master/LICENSE)
//
// ***
(function($){
    'use strict';

    // **cache jQuery objs**  
    // `$html`, `$body`
    // 
    // Cache jQuery objects of `<html>` and `<body>` DOM nodes to prevent
    // unneed lookups later when adding, removing, and testing for classes.
    //
    // *note: we must wait on `ready` event for caching the values (which is done below), but we'll
    // get their variables in place now.*
    var $html,$body;

    // **css class configuration**  
    // `css`
    //
    // Configuration object for CSS classes that will be generated when we 
    // build our `_shown` and `state_` class chains in their respective `util` methods.
    var css = {
        shown:{
            prefix:"",
            postfix:"_shown"    
        },
        state:{
            prefix:"state_",
            postfix:""
        }
    };

    // **screen sizes lookup/config**  
    // `sizes`
    // 
    // A config object for declaring an application state based on screen 
    // width measurements.  The property names map directly to the CSS class name
    // that will be used for that range.
    // 
    // `.mobile`, `.tablet`, `.desktop`, `.desktop_wide`
    var sizes = {
        mobile:{min:0,max:480},  
        tablet:{min:481,max:1024},
        desktop:{min:1025,max:1820},
        desktop_wide:{min:1821,max:99999999}
    };

    // **setTimeout ID storage/mapping**  
    // `timers`
    //
    // Store ID's of our internal timeouts by name to allow us
    // to clear them if/when we need to (e.g. resize throttling)
    var timers = {};


    // ##Utilities for common tasks
    // ***
    // `util`
    //
    // Keep us DRY, if we do it often, we do it universally.
    var util = {
        // **get a *view* namespace**  
        // `util.get_namespace`  
        //
        // We accept various things and each has a standard namespace
        // that we expect.  Process a *view* and return it's `namespace`
        // in the format we expect.
        // 
        //     util.get_namespace(MyApp.ExampleRegion.el);
        //     > 'example'
        //     util.get_namespace($example);
        //     > 'example'
        get_namespace: function(view) {
            var namespace = false;
            if (view instanceof jQuery) {
                namespace = view.attr('id');    
            } else if (typeof view == 'string') {
                if (view.indexOf('#') == 0) {
                    view = view.substr(1);
                }    
                namespace = view;
            }
            return namespace;
        },
        // **CSV to a jQuery class chain**  
        // `util.csv_to_class`
        //
        // Convert a CSV list into a class chain that can be used with
        // jQuery's `addClass`, `removeClass`, and `hasClass` methods.  
        // It also allows customization via `pre` and `post` which will
        // be added to each item in the list as it's built.
        //
        //     util.csv_to_class('list,of,things','foo_','_bar')
        //     > "foo_list_bar foo_of_bar foo_things_bar"
        csv_to_class: function(csv,pre,post) {
            var pre = (typeof pre != 'undefined' && pre.length) ? " "+pre : "";
            var post = (typeof post != 'undefined' && post.length) ? post+" " : "";
            csv = csv.replace(' ','');
            csv = csv.split(',').join('[post],').split(',').join('[pre]');
            csv = csv.replace('[post]',post).replace('[pre]',pre);
            csv = pre + csv + post;
            return $.trim(csv);
        },
        // **exec a func for each item of a CSV**  
        // `util.exec_on_csv`
        //
        // Process a CSV list, execute our `action` using
        // each item of the list as the passed in param
        //
        //     // <body>
        //     util.exec_on_csv('list,of,things', handlers.show);
        //     > 'list_shown of_shown things_shown'
        exec_on_csv: function(csv,action) {
            var csv = csv.replace(' ','').split(',');
            for (var i=0,len=csv.length; i<len; i++) {
                var item = csv[i];
                var view = $('#'+util.get_namespace(item));
                action.call(moshpit,view);    
            }
        },
        // **generate *shown* classes**  
        // `util.shown_chain`
        //
        // Generate CSS class names for *shown* elements.
        //
        //     util.shown_chain('list,of,things');
        //     > 'list_shown of_shown things_shown'
        shown_chain: function(csv_list) {
            csv_list = csv_list.replace(/#/g,'');
            return util.csv_to_class(csv_list,css.shown.prefix,css.shown.postfix);
        },
        // **generate *state* classes**  
        // `util.state_chain`
        // 
        // Generate CSS class names for user defined *states*.
        //
        //     util.state_chain('list,of,things');
        //     > 'state_list state_of state_things'
        state_chain: function(csv_list) {
            csv_list = csv_list.replace(/#/g,'');
            return util.csv_to_class(csv_list,css.state.prefix,css.state.postfix);
        },
        // **generate *size* classes**  
        // `util.get_sizes_chain`
        // 
        // Generate CSS class chain for various screen sizes based on 
        // the structure of `sizes` config object.
        //
        //     util.get_sizes_chain();
        //     > 'mobile table desktop desktop_wide'
        get_sizes_chain: function() {
            if (this.sizes_chain) {
                return this.sizes_chain;
            }
            var sizes_chain = '';
            for (var size in sizes) {
                if (sizes.hasOwnProperty(size)) {
                    sizes_chain += size+" ";
                }
            }
            this.sizes_chain = $.trim(sizes_chain);
            return this.sizes_chain;
        },
        // **get the current display size**  
        // `util.get_size`
        // 
        // Test the current window size and return the name
        // of the size that matches based on `sizes.min` and
        // `sizes.max` configuration settings.
        //
        //     //window.width is 800px
        //     util.get_size();
        //     > 'tablet' 
        get_size: function() {
            var win_w = $(window).width();
            for (var size in sizes) {
                var min = sizes[size].min;
                var max = sizes[size].max;
                if (sizes.hasOwnProperty(size)) {
                    if ( win_w >= min && win_w <= max ) {
                        return size;
                    }
                }
            }
        },
        // **test if element is shown**  
        // `util.is_shown`
        // 
        // Helper method to see if a `view` is currently displayed/shown.
        //
        //     // #example_thing shown
        //     util.is_shown('example_thing');
        //     > true
        //     // #example_thing hidden
        //     util.is_shown('example_thing');
        //     > false
        is_shown: function(namespace) {
            return $body.hasClass(util.shown_chain(namespace));
        },
        // **test if a state is currently set**  
        // `util.is_state`
        // 
        // Helper method to see if an application state is currently set.
        //
        //     // example_state is set
        //     util.is_state('example');
        //     > true
        //     // example_state is not set
        //     util.is_state('example');
        //     > false
        is_state: function(state) {
            return $html.hasClass(css.state.prefix + state + css.state.postfix);
        },
        // **Store vanilla jQuery methods we'll replace**  
        // `util.jquery_funcs`  
        //
        // We'll need to store functions for `$.show`, `$.hide`
        // and `$.toggle` that we can use in our own functions
        // we'll replace in jQuery.
        jquery_funcs:false,
        // **copy jQuery default methods, inject our modified versions**  
        // `util.jquery_inject`
        //
        // We'll need to listen for jQuery methods `.show`,`.hide`, and `.toggle`
        // to ensure calls to them still work with `MoshPit`.  We'll need to 
        // modify them slightly to do this.  To ensure they continue to function
        // normally we'll copy the origionals locally, overwrite them with our own
        // and failover to the default method if it's not applicible to ourselves.
        //
        // *note: although we call this multiple times from `moshpit.add_jquery` the
        // core copying and overwriting only happens on the inital call.  It's also
        // worth noting this only happens if using auto/tracking functionality via `MoshPit.join`*
        jquery_inject: function() {
            if (util.jquery_funcs === false) {
                util.jquery_funcs = {};
                util.jquery_funcs.show = $.fn.show;
                $.fn.show = function() {
                    var namespace = util.get_namespace($(this));
                    if (moshpit.views[namespace]) {
                        handlers.show(namespace);
                        return this;
                    } else {
                        return util.jquery_funcs.show.apply(this,arguments);    
                    }
                };
                util.jquery_funcs.hide = $.fn.hide;
                $.fn.hide = function() {
                    var namespace = util.get_namespace($(this));
                    if (moshpit.views[namespace]) {
                        handlers.hide(namespace);
                        return this;
                    } else {
                        return util.jquery_funcs.show.apply(this,arguments);    
                    }
                };    
                util.jquery_funcs.toggle = $.fn.toggle;
                $.fn.toggle = function() {
                    var namespace = util.get_namespace($(this));
                    if (moshpit.views[namespace]) {
                        handlers.toggle(namespace); 
                        return this;
                    } else {
                        return util.jquery_funcs.toggle.apply(this,arguments);    
                    }     
                }
            }
        }
    };

    // ##event handlers
    // ***
    // `handlers`
    //
    // Various events we care about handling internally.
    var handlers = {
        // **hide a view**   
        // `handlers.hide`
        // 
        // Hide a *view* by removing it's class from `<body>`.
        // 
        //     // <body class="example_shown">
        //     handlers.hide('example');
        //     // <body class="">
        hide: function(namespace) {
            $body.removeClass(util.shown_chain(namespace)); 
        },
        // **show a view**  
        // `handlers.show`
        // 
        // Show a *view* by adding it's class to `<body>`.
        //
        //     // <body>
        //     handlers.show('example');
        //     // <body class="example_shown">
        show: function(namespace) {
            $body.addClass(util.shown_chain(namespace)); 
        },
        // **toggle a view**  
        // `handlers.toggle`
        // 
        // Flip a *view*'s shown state based on it's current state.
        //
        //     //<body>
        //     handlers.toggle('example');
        //     //<body class="example_shown">
        //     handlers.toggle('example');
        //     //<body class="">
        toggle: function(namespace) {
            if (util.is_shown(namespace)) {
                handlers.hide(namespace);
            } else {
                handlers.show(namespace);    
            }
        },
        // **hide a Marionette component**  
        // `handlers.marionette_hide`
        //
        // Deal with a Marionette component being closed/hidden.
        marionette_hide: function() {
            handlers.hide(util.get_namespace(this.el));
        },
        // **show a Marionette component**  
        // `handlers.marionette_show`
        //
        // Deal with a Marionette component being shown
        marionette_show: function() {
            handlers.show(util.get_namespace(this.el));
        },
        // **add a state class**  
        // `handlers.add_state`
        //
        // Add a user defined state to the `<html>` element.
        //
        //     // <html>
        //     handlers.add_state('example');
        //     // <html class="state_example">
        add_state: function(state) {
            $html.addClass("state_"+state);   
        },
        // **delete a state class**  
        // `handlers.del_state`
        //
        //  Remove a user defined state from the `<html>` element. 
        //
        //     // <html class="state_example">
        //     handlers.del_state('example');
        //     // <html class="">
        del_state: function(state) {
            $html.removeClass("state_"+state);   
        },
        // **toggle a state class**  
        // `handlers.toggle_state`
        //
        // Add or remove a user defined state from `<html>` element
        // depending on it currently being set.
        //
        //     // <html>
        //     handlers.toggle_state('example');
        //     // <html class="state_example">
        //     handlers.toggle_state('example');
        //     // <html class="">
        toggle_state: function(csv_state) {
            csv_state = csv_state.split(',');
            for (var i=0,z=csv_state.length;i<z;i++) {
                var state = $.trim(csv_state[i]);
                if (util.is_state(state)) {
                    handlers.del_state(state);
                } else {
                    handlers.add_state(state);    
                }
            }
        },
        // **window.resize handler/throttling**  
        // `handlers.resize`  
        //
        // Handle `resize` events from `window` with a short timeout
        // to ensure we don't spam them when they fire in rapid succession.
        // Also handle the adding and removing of size classes to the `<html>`
        // element.
        resize: function(evnt,stable) {
            clearTimeout(timers.resize);
            if (stable) {
                $html.removeClass(util.get_sizes_chain()).addClass(util.get_size());
                return;
            }
            timers.resize = setTimeout(handlers.resize,100,evnt,true);
        },
        // **moshpit click handler**  
        // `handlers.click`  
        //
        // Handle `click` events from `document` to see if we need to handle them
        // for any `MoshPit` related activity.
        //
        // *note: we target [data-moshpit] when we assign the handler so we're only
        // catching the events we already know we care about.*
        click: function(evnt) {
            var $clicked = $(evnt.currentTarget);
            var action = $clicked.data('moshpit');
            var view = $clicked.data('view');
            var state = $clicked.data('state');
            if (view || state) {
                if (typeof handlers[action] != 'undefined') {
                    if (state) {
                        handlers[action](state);
                    } else {
                        handlers[action](view);
                    }
                    evnt.preventDefault();
                }
            }
        }
    };

    // ##Private setup methods
    // ***
    //
    // `moshpit`
    //
    // Collection of setup and teardown procedures for
    // automated tracking of elements that use `MoshPit.join`
    // and `MoshPit.leave`.
    var moshpit = {
        // **Tracked views/namespaces lookup**  
        // `moshpit.views`
        //
        // A lookup object we'll use to test events from
        // jQuery to see if it's related to a *view*
        // we're currently tracking.
        views:{},
        // **Setup a tracked Marionette component**  
        // `moshpit.add_marionette`  
        // 
        // Marionette components have their own event system  via `Marionette.Wreqr` for
        // tracking `.hide`,`.show`,`.close` events.  We'll utilize them
        // to ease integration before setting up our jQuery tracking
        // for the *view* `el` as well.
        add_marionette: function(view) {
            view.on('show', handlers.marionette_show);
            view.on('close', handlers.marionette_hide);
            moshpit.add_jquery.call(moshpit,$(view.el));
        },
        // **Remove tracking of Marionette component**  
        // `moshpit.del_marionette`
        //
        // When removing tracking of a Marionette component we'll need
        // to remove the `Wreqr` events we'd subscribed to during setup
        // as well as remove it's jQuery tracking.
        del_marionette: function(view) {
            view.off('show', handlers.marionette_show);
            view.off('close', handlers.marionette_hide);
            moshpit.del_jquery.call(moshpit,$(view.el));
        },
        // **Add a tracked *view***  
        // `moshpit.add_jquery`
        //
        // We'll rely on jQuery for tracking *view* changes that come in
        // via `.show`, `.hide`, and `.toggle`.  
        add_jquery: function($view) {
            util.jquery_inject(); // ensure we intergrate ourselves into jquery
            var namespace = util.get_namespace($view);
            moshpit.views[namespace] = true;
        },
        // **Remove a tracking from a *view***  
        // `moshpit.del_jquery`
        //
        // Stop tracking a *view* and hide it.
        del_jquery: function($view) {
            var namespace = util.get_namespace($view);
            moshpit.views[namespace] = false;
            handlers.hide(namespace);
        }
    };

    // ##Setup MoshPit.js globals
    // ***
    // `MoshPit`
    //
    // We'll expose `MoshPit` on the `window` object with
    // a handful of externally usable features we want others
    // to have access to.
    window.MoshPit = {
        // **enable tracking of a *view***  
        // `MoshPit.join`
        //
        // Will be called externally when a *view* wants to
        // be tracked by `MoshPit`,
        //
        //     // <body> 
        //     $('#example').show(); 
        //     // <body>
        //
        //     // <body>
        //     MoshPit.join('example');
        //     $('#example').show();
        //     // <body class="example_shown">
        join: function(view) {
            if (typeof view == 'string') {
                    util.exec_on_csv(view, moshpit.add_jquery);
            } else if (typeof view == 'object') {
                if (view instanceof jQuery) {
                    moshpit.add_jquery.call(moshpit, view);
                } else if (view instanceof Marionette.Region
                           || view instanceof Marionette.View
                           || view instanceof Marionette.ItemView
                           || view instanceof Marionette.Layout) {
                    moshpit.add_marionette.call(moshpit, view);
                }
            }
            return MoshPit;
        },
        // **disable tracking of a *view***  
        // `MoshPit.leave`
        //
        // Will be called externally when a *view* no longer
        // should be tracked by `MoshPit`.
        //
        //     // <body>
        //     MoshPit.join('example');
        //     $('#example').show();
        //     // <body class="example_shown">
        //     MoshPit.leave('example');
        //     // <body class="">
        //     $('#example').show();
        //     // <body class="">
        leave: function(view) {
            if (typeof view == 'string') {
                    util.exec_on_csv(view, moshpit.del_jquery);
            } else if (typeof view == 'object') {
                if (view instanceof jQuery) {
                    moshpit.del_jquery.call(moshpit, view);
                } else if (view instanceof Marionette.Region
                           || view instanceof Marionette.View
                           || view instanceof Marionette.ItemView
                           || view instanceof Marionette.Layout) {
                    moshpit.del_marionette.call(moshpit, view);
                }
            }
            return MoshPit;
        },
        // **manually show a *view***  
        // `MoshPit.show`
        //
        // Let's an external resource `show` a *view* regardless
        // of it's tracked status.
        //
        //     // <body>
        //     if (show_the_example) {
        //         MoshPit.show('example');
        //     }
        //     // <body class="example_shown">
        show: function(view) {
            handlers.show(view);
            return MoshPit;
        },
        // **manually hide a *view***  
        // `MoshPit.hide`
        //
        // Let's an external resource `hide` a *view* regardless
        // of it's tracked status.
        //
        //     // <body class="example_shown">
        //     if (hide_the_example) {
        //         MoshPit.hide('example');
        //     }
        //     // <body class="">
        hide: function(view) {
            handlers.hide(view);
            return MoshPit;
        },
        // **manually toggle a *view***  
        // `MoshPit.toggle`
        //
        // Let's an external resource `toggle` a *view* regardless
        // of it's tracked status.
        //
        //     MoshPit.toggle('example');
        //     // <body class="example_shown">
        //     MoshPit.toggle('example');
        //     // <body class="">
        toggle: function(view) {
            util.exec_on_csv(view, handlers.toggle);
            return MoshPit;
        },
        // **check if a *view* is shown**  
        // `MoshPit.is_shown`
        //
        // Externally accessible means to find out if a
        // *view* is currently being shown.
        //
        //     // <body class="example_shown"
        //     MoshPit.is_shown('example');
        //     > true
        //     MoshPit.hide('example');
        //     // <body class=""
        //     MoshPit.is_shown('example');
        //     > false
        is_shown: function(view) {
            return util.is_shown(util.get_namespace(view));
        },
        // **add a *view state***  
        // `MoshPit.add_state`
        //
        // Applies a *view state* to the entire page.
        //
        //     // <html>
        //     MoshPit.add_state('highlight_all_examples');
        //     // <html class="state_highlight_all_examples">
        //
        // *note: states are useful for modifying multiple 
        // *views* and allows for simplier LESS structures and
        // less (as in LoC) generated CSS*
        add_state: function(state) {
            handlers.add_state(state);
            return MoshPit;
        },
        // **remove a *view state***  
        // `MoshPit.remove_state`
        //
        // Removes a *view state* from the entire page.
        //
        //     // <html class="state_highlight_all_examples">
        //     MoshPit.remove_state('highlight_all_examples");
        //     // <html class="">
        remove_state: function(state) {
            handlers.del_state(state);
            return MoshPit;
        },
        // **toggle a *view state***  
        // `MoshPit.toggle_state`
        //
        // Toggles a *view state* on the entire page.
        //
        //     // <html>
        //     MoshPit.toggle_state('highlight_all_examples");
        //     // <html class="state_highlight_all_examples">
        //     MoshPit.toggle_state('highlight_all_examples");
        //     // <html class="">
        toggle_state: function(state) {
            util.exec_on_csv(state, handlers.toggle_state);
            return MoshPit;
        },
        // **check if a *view state* is enabled**  
        // `MoshPit.is_state`
        //
        // Externally accessible means to find out if a
        // *view state* is currently active.
        //
        //     // <html class="state_highlight_all_examples">
        //     MoshPit.is_state("highlight_all_examples");
        //     > true
        //     // <html class="">
        //     MoshPit.is_state("highlight_all_examples");
        //     > false
        is_state: util.is_state
        //
    };

    // ## initialization steps
    // ***
    // `init`
    //
    // Steps we'll need to take on `domready`.  
    // Hook init into jQuery's `$.ready` event.
    var init = function() {
        handlers.resize();
        $html = $('html');
        $body = $('body');
        $(window).on('resize', handlers.resize);
        $(document).on('click','[data-moshpit]', handlers.click);     
    };
    $(init);
//
})(jQuery);
