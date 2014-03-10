(function() {
    // setup our private `gui` object to storing our Panels
    // and hooking up our listeners and functionality
    var gui = {
        // where we'll store our objects
        elems:{},
        // our init process that we'll trigger on `$.ready`
        init: function() {
            // store our references
            this.elems.$Panel_1 = $('#Panel_1').html('#Panel_1');    
            this.elems.$Panel_2 = $('#Panel_2').html('#Panel_2');

            // *note: using `MoshPit.join` will catch 
            // `$.show`,`$.hide`, and `$.toggle` 
            // calls to jQuery and update our views shown states accordingly*
            MoshPit.join(this.elems.$Panel_1);
            MoshPit.join(this.elems.$Panel_2);
        }    
    };    

    // on `$.ready` we'll init our `gui`
    $(function(){
        gui.init();
    });
})();
