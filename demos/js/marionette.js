// create our Demo Marionette application
Demo = new Backbone.Marionette.Application();

// sreate our `PanelView` class that we'll use in our Regions
PanelView = Backbone.Marionette.ItemView.extend({
    initialize: function(options) {
        self = this;
        self.name = options.name;
        self.template = function() {
            return self.name;  
        }
    }
});

// sreate our `PanelRegion` that we'll use in our Application
PanelRegion = Backbone.Marionette.Region.extend({
    initialize: function(options){
        this.el = options.el;
        // when we initialize our `PanelRegion` we'll
        // tell `MoshPit.js` to track it.
        MoshPit.join(this);
    }
});

// on `$.ready` hook everything up
$(function(){
    // create our new `PanelRegion`s that target #Panel_1 & #Panel_2
    Demo.Panel_1 = new PanelRegion({el:"#Panel_1"});
    Demo.Panel_2 = new PanelRegion({el:"#Panel_2"});
    // load our Regions up with `PanelView`s
    Demo.Panel_1.show(new PanelView({name:"Panel 1"}));
    Demo.Panel_2.show(new PanelView({name:"Panel 2"}));
    // Start our application up
    Demo.start();
});
