window.onload = function() {
    MoshPit.join('Panel_1');
    MoshPit.join('Panel_2');
};

function show_a_panel(which) {
    $('#Panel_'+which).show();    
}

function hide_a_panel(which) {
    MoshPit.hide('Panel_'+which);    
}

function toggle_a_panel(which) {
    var panel = 'Panel_'+which;
    var shown = MoshPit.is_shown(panel);

    if (shown === true) {
        hide_a_panel(which); 
    } else {
        show_a_panel(which);    
    }
}

function remove() {
    MoshPit.leave('Panel_1');    
}
