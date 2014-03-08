(function($){
    'use strict';

    var $html,$body;

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
        rtrim: function(the_string) {
            return the_string.replace(/\s+$/,'');     
        },
        class_chain: function(csv_list) {
            var postfix = "_shown ";
            return util.rtrim(csv_list.split(',').join(postfix)+postfix);
        },
        get_sizes_chain: function() {
            if (this.sizes_chain) {
                return this.sizes_chain;
            }
            var sizes_chain = '';
            for (var size in sizes) {
                var min = sizes[size].min;
                var max = sizes[size].max;
                if (sizes.hasOwnProperty(size)) {
                    sizes_chain += size+" ";
                }
            }
            this.sizes_chain = util.rtrim(sizes_chain);
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
            return $body.hasClass(util.class_chain(namespace));
        }
    };

    // various internal event handlers
    var handlers = {
        hide: function(namespace) {
            $body.removeClass(util.class_chain(namespace)); 
        },
        show: function(namespace) {
            $body.addClass(util.class_chain(namespace)); 
        },
        toggle: function(csv_namespace) {
            csv_namespace = csv_namespace.split(',');
            for (var i=0,z=csv_namespace.length;i<z;i++) {
                var namespace = csv_namespace[i]
                if (util.is_shown(namespace)) {
                    handlers.hide(namespace);
                } else {
                    handlers.show(namespace);    
                }
            }
        },
        resize: function(evnt,stable) {
            clearTimeout(timers.resize);
            if (stable) {
                $html.removeClass(util.get_sizes_chain()).addClass(util.get_size());
                return;
            }
            timers.resize = setTimeout(handlers.resize,102,true,true);
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
            Mosher.on('show',function(){
                handlers.show(util.get_namespace(this.el));
            });
            Mosher.on('close',function(){
                handlers.hide(util.get_namespace(this.el));
            });
            moshpit.add_jquery.call(moshpit,$(Mosher.el));
        },
        del_marionette: function(Mosher) {
            var namespace = String(Mosher.el).substr(1);
            Mosher.onShow = Mosher.onShow_;
            Mosher.close = Mosher.close_;
            delete moshpit.moshers[namespace];
        },
        add_jquery: function($Mosher) {
            var namespace = util.get_namespace($Mosher);
            if (moshpit.jq_funcs === false) {
                $.fn.show = function() {
                    var namespace = util.get_namespace($(this));
                    if (moshpit.moshers[namespace]) {
                        handlers.show(namespace);
                    } else {
                        moshpit.jq_funcs.show.apply(this,arguments);    
                    }
                };
                $.fn.hide = function() {
                    var namespace = util.get_namespace($(this));
                    if (moshpit.moshers[namespace]) {
                        handlers.hide(namespace);
                    } else {
                        moshpit.jq_funcs.show.apply(this,arguments);    
                    }
                };    
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
        }
    };

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
        leave: function() {
            // implement tear down
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
