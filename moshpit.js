// MoshPit.js v0.1
// ==
(function($){
    'use strict';

    var $html,$body;

    // css
    // ===
    // Simple lookup to allow easy configuration of CSS classes we'll use
    // to build our shown and states classes that we'll be expecting
    var css = {
        shown:{
            prefix:"",
            postfix:"_shown"    
        },
        state:{
            prefix:"state_",
            postfix:""
        }
    }

    // sizes
    // ===
    // sceen sizes and their associated class names
    var sizes = {
        // `html.mobile`
        mobile:{min:0,max:400},  
        // `html.tablet`
        tablet:{min:401,max:900},
        // `html.desktop`
        desktop:{min:901,max:1200},
        // `html.desktop_wide`
        desktop_wide:{min:1201,max:99999999}
    };

    // timers
    // ===
    // ID's of our internal timeouts to allow us
    // to clear them if/when we need to (e.g. resize throttling)
    var timers = {};


    // util
    // ===
    // Utilities for common tasks
    var util = {
        // `util.get_namespace`
        // ***
        // Get an objects namespace by testing types and doing
        // things like removing a leading # in selectors to getting the
        // id attr of a passed in jQuery object *(when applicable)*
        get_namespace: function(Mosher) {
            var namespace = false;
            if (Mosher instanceof jQuery) {
                namespace = Mosher.attr('id');    
            } else if (typeof Mosher == 'string') {
                if (Mosher.indexOf('#') == 0) {
                    Mosher = Mosher.substr(1);
                }    
                namespace = Mosher;
            }
            return namespace;
        },
        // `util.csv_to_class`
        // ***
        // Convert a CSV list into a class chain that can be used with
        // jQuery's `addClass`,`removeClass`, and `hasClass` methods
        csv_to_class: function(csv,pre,post) {
            var pre = (typeof pre != 'undefined' && pre.length) ? " "+pre : "";
            var post = (typeof post != 'undefined' && post.length) ? post+" " : "";
            // get the CSV list whipped into shape
            csv = csv.replace(' ','');
            csv = csv.split(',').join('[post],').split(',').join('[pre]');
            csv = csv.replace('[post]',post).replace('[pre]',pre);
            csv = pre + csv + post;
            return $.trim(csv);
        },
        // `util.shown_chain`
        // ***
        // Generate CSS class names for *shown* elements 
        shown_chain: function(csv_list) {
            return util.csv_to_class(csv_list,css.shown.prefix,css.shown.postfix);
        },
        // `util.state_chain`
        // ***
        // Generate CSS class names for user defined states
        state_chain: function(csv_list) {
            return util.csv_to_class(csv_list,css.state.prefix,css.state.postfix);
        },
        // `util.get_sizes_chain`
        // ***
        // Generate CSS class chain for various screen sizes based on 
        // the structure of `sizes` configuration object.
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
        // `util.get_size`
        // ***
        // Test the current window size and return the name
        // of the size that matches based on `sizes.min` and
        // `sizes.max` configuration settings.
        get_size: function() {
            var w_w = $(window).width();
            for (var size in sizes) {
                var min = sizes[size].min;
                var max = sizes[size].max;
                if (sizes.hasOwnProperty(size)) {
                    if ( w_w >= min && w_w <= max ) {
                        return size;
                    }
                }
            } 
        },
        // `util.is_shown`
        // *** 
        // Helper method to see if a *module* is currently displayed/shown.
        is_shown: function(namespace) {
            return $body.hasClass(util.shown_chain(namespace));
        },
        // `util.is_state`
        // ***
        // Helper method to see if an application state is currently set.
        is_state: function(state) {
            return $html.hasClass(css.state.prefix + state + css.state.postfix);
        }
    };

    // handlers
    // ===
    // Various events we care about
    var handlers = {
        // `handlers.hide`
        // ***
        // Hide a *module*
        hide: function(namespace) {
            $body.removeClass(util.shown_chain(namespace)); 
        },
        // `handlers.show`
        // ***
        // Show a *module*
        show: function(namespace) {
            $body.addClass(util.shown_chain(namespace)); 
        },
        // `handlers.toggle`
        // ***
        // Flip a *module's* view state between hidden
        // and shown based on it's current
        toggle: function(csv_namespace) {
            csv_namespace = csv_namespace.split(',');
            for (var i=0,z=csv_namespace.length;i<z;i++) {
                var namespace = $.trim(csv_namespace[i]);
                if (util.is_shown(namespace)) {
                    handlers.hide(namespace);
                } else {
                    handlers.show(namespace);    
                }
            }
        },
        marionette_hide: function() {
            handlers.hide(util.get_namespace(this.el));
        },
        marionette_show: function() {
            handlers.show(util.get_namespace(this.el));
        },
        add_state: function(state) {
            $html.addClass("state_"+state);   
        },
        del_state: function(state) {
            $html.removeClass("state_"+state);   
        },
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
        resize: function(evnt,stable) {
            clearTimeout(timers.resize);
            if (stable) {
                $html.removeClass(util.get_sizes_chain()).addClass(util.get_size());
                return;
            }
            timers.resize = setTimeout(handlers.resize,102,evnt,true);
        },
        click: function(evnt) {
            var $clicked = $(evnt.currentTarget);
            var action = $clicked.data('moshpit');
            var namespace = $clicked.data('mosher');

            if (typeof handlers[action] != 'undefined') {
                handlers[action](namespace);
                evnt.preventDefault(); // assume we want to stop the default, allow propagation.
            }
        }
    };

    // MoshPit private setup funcs
    var moshpit = {
        moshers:{},
        jq_funcs:false,
        add_marionette: function(Mosher) {
            Mosher.on('show', handlers.marionette_show);
            Mosher.on('close', handlers.marionette_hide);
            moshpit.add_jquery.call(moshpit,$(Mosher.el));
        },
        del_marionette: function(Mosher) {
            Mosher.off('show', handlers.marionette_show);
            Mosher.off('close', handlers.marionette_hide);
            moshpit.del_jquery.call(moshpit,$(Mosher.el));
        },
        add_jquery: function($Mosher) {
            var namespace = util.get_namespace($Mosher);
            if (moshpit.jq_funcs === false) {
                // copy the origional methods so we can 
                // swap out the defaults to patch in functionality
                moshpit.jq_funcs = {};
                moshpit.jq_funcs.show = $.fn.show;
                $.fn.show = function() {
                    var namespace = util.get_namespace($(this));
                    if (moshpit.moshers[namespace]) {
                        handlers.show(namespace);
                    } else {
                        console.log(moshpit);
                        moshpit.jq_funcs.show.apply(this,arguments);    
                    }
                };
                moshpit.jq_funcs.hide = $.fn.hide;
                $.fn.hide = function() {
                    var namespace = util.get_namespace($(this));
                    if (moshpit.moshers[namespace]) {
                        handlers.hide(namespace);
                    } else {
                        moshpit.jq_funcs.show.apply(this,arguments);    
                    }
                };    
                moshpit.jq_funcs.toggle = $.fn.toggle;
                $.fn.toggle = function() {
                    var namespace = util.get_namespace($(this));
                    if (moshpit.moshers[namespace]) {
                        handlers.toggle(namespace); 
                    } else {
                        moshpit.jq_funcs.toggle.apply(this,arguments);    
                    }     
                }
            }
            moshpit.moshers[namespace] = true;
        },
        del_jquery: function($Mosher) {
            var namespace = util.get_namespace($Mosher);
            moshpit.moshers[namespace] = false;
            handlers.hide(namespace);
        }
    };

    // expose publics
    window.MoshPit = {
        join: function(Mosher) {
            if (typeof Mosher == 'string') {
                // assume this is the id, see if we can find it
                Mosher = $('#'+util.get_namespace(Mosher));
                if (Mosher.length) {
                    // we found a matchin element, use it!
                    moshpit.add_jquery.call(moshpit, Mosher);
                }
            } else if (typeof Mosher == 'object') {
                if (Mosher instanceof jQuery) {
                    moshpit.add_jquery.call(moshpit, Mosher);
                } else if (Mosher instanceof Marionette.Region
                           || Mosher instanceof Marionette.View
                           || Mosher instanceof Marionette.ItemView
                           || Mosher instanceof Marionette.Layout) {
                    moshpit.add_marionette.call(moshpit, Mosher);
                }
            }
        },
        leave: function(Mosher) {
            // implement tear down
            if (typeof Mosher == 'string') {
                // assume this is the id, see if we can find it
                Mosher = $('#'+util.get_namespace(Mosher));
                if (Mosher.length) {
                    // we found a matchin element, use it!
                    moshpit.del_jquery.call(moshpit, Mosher);
                }
            } else if (typeof Mosher == 'object') {
                if (Mosher instanceof jQuery) {
                    moshpit.del_jquery.call(moshpit, Mosher);
                } else if (Mosher instanceof Marionette.Region
                           || Mosher instanceof Marionette.View
                           || Mosher instanceof Marionette.ItemView
                           || Mosher instanceof Marionette.Layout) {
                    moshpit.del_marionette.call(moshpit, Mosher);
                }
            }
        },
        show: function(Mosher) {
            var namespace = util.get_namespace(Mosher);
            handlers.show(namespace);            
        },
        hide: function(Mosher) {
            var namespace = util.get_namespace(Mosher);
            handlers.hide(namespace);
        },
        toggle: function(Mosher) {
            var namespace = util.get_namespace(Mosher);
            handlers.toggle(namespace);
        },
        add_state: function(state) {
            handlers.add_state(state);
        },
        remove_state: function(state) {
            handlers.del_state(state);
        },
        is_shown: function(Mosher) {
            var namespace = util.get_namespace(Mosher);    
            return util.is_shown(namespace);
        }
    };

    // setup our handlers for window resizes and clicks on elements we
    // know we care about.
    $(function(){
        handlers.resize();
        $html = $('html');
        $body = $('body');
        $(window).on('resize', handlers.resize);
        $(document).on('click','[data-moshpit]', handlers.click);
    });
})(jQuery);
