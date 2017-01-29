// This is an advanced "popup-menu" system.
// The menu will stay as long as the mouse is moving and the mouse is near the menu.
// menu_timer_threshold is the amount of time the mouse must be outside of the menu boundaries.
// menu_hover_adj is the space around the menu that is considered available.
// This script can be modified to support multiple menus and sub-menus.

function bubble_offset(source, offset) {
    var parent;
    if (offset == null) {
        offset = new Object();
        offset.x = offset.y = 0;
    }

    offset.x += source.offsetLeft;
    offset.y += source.offsetTop;
    if (source.tagName != "BODY") {
        offset.x -= source.scrollLeft;
        offset.y -= source.scrollTop;
    }

    if ((parent = source.offsetParent) != null)
        bubble_offset(parent, offset);
    return offset;
}

var menu_elem = null;
var menu_rect = { x1: 0, y1: 0, x2: 0, y2: 0, active: false };
var menu_hover = 0;
var menu_timer_threshold = 2000;
var menu_hover_adj = 15;

function init_menu() {
    var telem = document.getElementById("colHead" + col).parentElement;
    var off = bubble_offset(telem, null);
    var menu, body;
    var lelem;

    if (menu_elem != null)
        hide_menu();

    // Create menu div
    menu_hover = new Date().getTime();
    menu = document.createElement("div");
    menu.className = "popup"

    menu.style.position = "absolute";
    menu.style.top = off.y + telem.clientHeight;
    menu.style.left = off.x;
    body = document.getElementById("body");

    // Create link (repeat as necessary)
    lelem = document.createElement("a");
    lelem.setAttribute("href", "link.html");
    lelem.appendChild(document.createTextNode("Link 1"));
    menu.appendChild(lelem);
    body.appendChild(menu);

    // Pre-calculate coordinate boundaries
    menu_rect.x1 = off.x;
    menu_rect.y1 = off.y + telem.clientHeight;
    menu_rect.x2 = menu_rect.x1 + menu.clientWidth;
    menu_rect.y2 = menu_rect.y1 + menu.clientHeight;

    // Adjust rectangle boundaries to allow the mouse to hover "near" the menu.
    adj_val = menu_hover_adj;
    menu_rect.x1 -= adj_val;
    menu_rect.y1 -= adj_val;
    menu_rect.x2 += adj_val;
    menu_rect.y2 += adj_val;

    menu_rect.active = true;
    menu_elem = menu;
}

// Get rid of the menu
function hide_menu() {
    if (menu_elem == null)
        return;
    menu_elem.parentElement.removeChild(menu_elem);
    menu_elem = null;
    menu_rect.active = false;
}

// Hide the menu when the mouse was out of bounds for too long.
function menutimer() {
    var now, dif;
    var threshold = menu_timer_threshold;

    now = new Date().getTime();
    dif = (now - menu_hover);

    if (dif > threshold)
        hide_menu();
}

// Track mouse movements.  Record the timestamp if the mouse is in bounds.
var movepos = { x: 0, y: 0 };
function movehandler(e) {
    var now, dif;
    if (e == null)
        e = window.event;

    movepos = { x: e.x, y: e.y };
    if (menu_rect.active) {
        if ((e.x > menu_rect.x1 && e.x < menu_rect.x2)
        && (e.y > menu_rect.y1 && e.y < menu_rect.y2))
            menu_hover = new Date().getTime();

        now = new Date().getTime();
        dif = (now - menu_hover);
    }
}

// start the timer
function menu_init() {
    setInterval(menutimer, 25);
}
