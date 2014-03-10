(function() {
    // setup our private `gui` object to storing our Panels
    // and hooking up our listeners and functionality
    var gui = {
        elems:{},
        init: function() {
            // store our #Panel_1 and #Panel_2
            this.elems.$Panel_1 = $('#Panel_1').html('#Panel_1');    
            this.elems.$Panel_2 = $('#Panel_2').html('#Panel_2');    

            // listen for clicks on elements we care about
            // and use the global methods to interaction manually
            // with `MoshPit`.  
            // *note: if you're not tracking views with `MoshPit.join` 
            // calls to `$.show`,`$.hide`,`$.toggle` will not notify
            // `MoshPit.js` of changes in the view state.*
            $('body').on('click','.Panel_1_toggle',function(){
                MoshPit.toggle(gui.elems.$Panel_1);
            });
            $('body').on('click','.Panel_2_toggle',function(){
                MoshPit.toggle(gui.elems.$Panel_2);
            });
            $('body').on('click','.Panels_toggle',function(){
                MoshPit.toggle('Panel_1,Panel_2');    
            });
            //
        }    
    };    

    // on `$.ready` `init` our `gui`  
    $(function(){
        gui.init();     
    });
})();
