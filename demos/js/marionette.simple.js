Demo = new Backbone.Marionette.Application();

Demo.addRegions({
    Panel_1:'#Panel_1',
    Panel_2:'#Panel_2'
});

PanelView = Backbone.Marionette.ItemView.extend({
    initialize: function(options) {
        self = this;
        this.name = options.name;
        this.template = function() {
            return self.name;  
        }
    }
});

PanelRegion = Backbone.Marionette.Region.extend({
    initialize: function(options){
        this.el = options.el;
        MoshPit.join(this);
    }
});

$(function(){
    Demo.Panel_1 = new PanelRegion({el:"#Panel_1"});
    Demo.Panel_2 = new PanelRegion({el:"#Panel_2"});
    Demo.Panel_1.show(new PanelView({name:"Panel 1"}));
    Demo.Panel_2.show(new PanelView({name:"Panel 2"}));
    Demo.start();
});

