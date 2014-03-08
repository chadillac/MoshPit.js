Demo = new Backbone.Marionette.Application();

Demo.addRegions({
    Panel_1:'#Panel_1',
    Panel_2:'#Panel_2'
});

Panel = Backbone.Marionette.Region.extend({
    initialize: function(options){
        var self = this;
        var name = this.el.substr(1);

        this.el = options.el;
        this.shown = false;

        // register with MoshPit
        //MoshPit.join(Demo,this);
        MoshPit.join($(this.el));

        this.toggle = function() {
            if (self.shown) {
                self.shown = false;
                self.close();    
            } else {
                self.show(self);    
            }
        };

        $('body').on('click','.'+name+'_toggle',this.toggle);
    },
    onShow: function() { 
        this.shown = true;
    },
    render: function() {
        $(this.el).html(this.el);
    }
});


$(function(){
    Demo.Panel_1.show(new Panel({el:"#Panel_1"}));
    Demo.Panel_2.show(new Panel({el:"#Panel_2"}));
});
