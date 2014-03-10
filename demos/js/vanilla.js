// setup on window.onload 
window.onload = function() {
    // Track #Panel_1 & #Panel_2 with `MoshPit.js`
    MoshPit.join('Panel_1');
    MoshPit.join('Panel_2');
};

// show one of the Panels
function show_a_panel(which) {
    // use jQuery `.show` to make a Panel visible
    $('#Panel_'+which).show();    
}

// hide one of the Panels
function hide_a_panel(which) {
    // use `MoshPit.hide` to make a Panel hidden
    MoshPit.hide('Panel_'+which);    
}

// hide or show a panel based on it's current shown state 
function toggle_a_panel(which) {
    var panel = 'Panel_'+which;
    // see if a Panel is currently visible
    var shown = MoshPit.is_shown(panel);

    if (shown === true) {
        // hide it if it's currently shown
        hide_a_panel(which); 
    } else {
        // show it if it's not shown
        show_a_panel(which);    
    }
}

// add or remove a state based on it currently being set or not
function toggle_state() {
    // use `MoshPit.toggle_state` to enabled the `horz` state
    MoshPit.toggle_state('horz');
}

