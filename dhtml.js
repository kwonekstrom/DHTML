var useEvent = null;
function updateEvent(evt)
{
   useEvent = (evt || window.event);
}

function getSource()
{
   return useEvent.srcElement || useEvent.target;
}

function getEvent()
{
    return useEvent;
}

var drag_target = null;
var drag_offset = new coord(0,0);
function onmousemove_drag(event)
{
    updateEvent(event);
    if (drag_target == null)
        return;
    var pos;
    
    pos = mouseCoords(getEvent());
    drag_target.style.top = pos.y+drag_offset.y;
    drag_target.style.left = pos.x+drag_offset.x;
}

function stop_drag()
{
    drag_target = null;
}

function start_drag(id)
{
    drag_target = document.getElementById(id);

    var off = bubble_offset(drag_target);
    var pos = mouseCoords(getEvent());
    
    drag_offset = new coord(off.x-pos.x, off.y-pos.y);
}

function coord(px, py)
{
   this.x = px;
   this.y = py;
}

function mouseCoords(ev)
{
   return new coord(
      ev.clientX + document.body.scrollLeft - document.body.clientLeft,
      ev.clientY + document.body.scrollTop  - document.body.clientTop
   );
}

function toggle_view(id)
{
    var elem;
    
    elem = document.getElementById(id);
    elem.style.display = (elem.style.display == "none" ? "block" : "none");
}

function toggle_view2(elem)
{
    elem.style.display = (elem.style.display == "none" ? "block" : "none");
}

function padd_suffix(text, padd, num)
{
    var pos, ret;
    ret = text;
    for (pos=0; pos<num; pos++)
    {
        ret+= padd;
    }
    return ret;
}

function round(value,places)
{
    var ret;
    if (places == 0)
    {
       ret = Math.round(value);
    }
    else if (places > 0)
       ret = (Math.round(value*Math.pow(10,places))/Math.pow(10,places));
    else
       ret = Math.round(value/Math.pow(10,Math.abs(places)));
   return ret;
}

function format_number(value, places, paren, prefix, suffix)
{
    var val,len,right,left,pos,isneg;
    var i,ret,max;

    isneg = (value < 0);

    val = ""+round(Math.abs(value), places);

    if (places > 0)
    {
       len = val.length;
       if ((pos = val.indexOf(".")) == -1)
       {
           val = padd_suffix(val+".", "0", places);
       }
       else if ((len-pos) < (places+1))
       {
           val = padd_suffix(val, "0", 1+(places-(len-pos)));
       }
    }
    
    len = val.length;
    if ((pos = val.indexOf(".")) == -1)
        pos = val.length;
        
    if (pos > 3)
    {
        left = (pos%3);
        ret = "";
        
        for(i=0;i<len;i++)
        {
            adj = (i-left);
            if (i < pos && i > 0)
            {
                if ((adj%3) == 0)
                    ret += ",";
            }
            ret += val.charAt(i);
        }
    }
    else
        ret = val;
    
    return (isneg ? (paren ? "("+prefix+ret+suffix+")" : prefix+"-"+ret+suffix) : prefix+ret+suffix);
}

function bubble_offset(source, offset)
{
   var parent;
   if (offset == null)
   {
       offset = new Object();
       offset.x = offset.y = 0;
   }

   offset.x+= source.offsetLeft;
   offset.y+= source.offsetTop;
   if (source.tagName != "BODY")
   {
      offset.x-= source.scrollLeft;
      offset.y-= source.scrollTop;
   }
   
   if ((parent = source.offsetParent) != null)
       bubble_offset(parent, offset);
   return offset;
}

function keycheck_enter(handler, event)
{
    updateEvent(event);
    if (getEvent().keyCode == 13)
        handler();
}

