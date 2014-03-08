(function($){
    'use strict';

    var $html,$body;

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

    // timeout event id lookup
    var timers = {};

    // sceen sizes and their associated class names
    // .mobile, .tablet, etc.
    var sizes = {
        mobile:{min:0,max:400},
        tablet:{min:401,max:900},
        desktop:{min:901,max:1200},
        desktop_wide:{min:1201,max:99999999}
    };

    // some simple helpers
    var util = {
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
        shown_chain: function(csv_list) {
            return util.csv_to_class(csv_list,css.shown.prefix,css.shown.postfix);
        },
        state_chain: function(csv_list) {
            return util.csv_to_class(csv_list,css.state.prefix,css.state.postfix);
        },
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
        is_shown: function(namespace) {
            return $body.hasClass(util.shown_chain(namespace));
        },
        is_state: function(state) {
            return $html.hasClass(css.state.prefix + state + css.state.postfix);
        }
    };

    // various internal event handlers
    var handlers = {
        hide: function(namespace) {
            $body.removeClass(util.shown_chain(namespace)); 
        },
        show: function(namespace) {
            $body.addClass(util.shown_chain(namespace)); 
        },
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
