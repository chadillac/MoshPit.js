(function() {
    var gui = {
        elems:{},
        init: function() {
            this.elems.$Panel_1 = $('#Panel_1').html('#Panel_1');    
            this.elems.$Panel_2 = $('#Panel_2').html('#Panel_2');    

            $('body').on('click','.Panel_1_toggle',function(){
                MoshPit.toggle(gui.elems.$Panel_1);
            });
            $('body').on('click','.Panel_2_toggle',function(){
                MoshPit.toggle(gui.elems.$Panel_2);
            });
            $('body').on('click','.Panels_toggle',function(){
                MoshPit.toggle('Panel_1,Panel_2');    
            });
        }    
    };    

    $(function(){
        gui.init();     
    });
})();
