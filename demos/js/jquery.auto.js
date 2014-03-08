(function() {
    var gui = {
        elems:{},
        init: function() {
            this.elems.$Panel_1 = $('#Panel_1').html('#Panel_1');    
            this.elems.$Panel_2 = $('#Panel_2').html('#Panel_2');    
        }    
    };    

    $(function(){
        gui.init();
        MoshPit.join(gui.elems.$Panel_1);
        MoshPit.join(gui.elems.$Panel_2);
    });
})();
