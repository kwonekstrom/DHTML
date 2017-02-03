
var drag_targ = null;
var debug = true;
var drag_pos  = new coord(0,0);
var mouseOffset = new coord(0,0);
document.onmousemove = mouseMove;
document.ondragstart =  function () { return false; };
function init_drag()
{
   document.getElementById('panner').onmousemove = mouseMove;
}

//document.getElementById('panner').onmousemove = mouseMove;
//document.getElementById('drag').onmousemove = mouseMove;
//document.getElementById('drag2').onmousemove = mouseMove;

function getMouseOffset(target, ev)
{
   var docPos    = getPosition(target);
   var mousePos  = mouseCoords(ev);

   return new coord(mousePos.x-docPos.x, mousePos.y-docPos.y);
}

function getPosition(e)
{
   var left = 0;
   var top  = 0;

   while(e.offsetParent)
   {
      left += e.offsetLeft;
      top  += e.offsetTop;
      e     = e.offsetParent;
   }

   left += e.offsetLeft;
   top  += e.offsetTop;

   return new coord(left, top);
}

function mouseMove(ev)
{
   var msg = document.getElementById("message");
   if (drag_targ == null)
       return;

   ev           = ev || window.event;
   var mousePos = mouseCoords(ev);
   var pCoord   = new coord(0,0);

//   msg.innerHTML += "Mouse Pos: X["+mousePos.x+"] Y["+mousePos.y+"]<br />";
//   msg.innerHTML += "Mouse Off: X["+mouseOffset.x+"] Y["+mouseOffset.y+"]<br />";
//   msg.innerHTML += "Viewer: X["+drag_targ.clientX+"] Y["+drag_targ.clientY+"]<br />";


   if (drag_targ != null)
   {
      var tmp   = document.getElementById('drag2');
      var dragO = document.getElementById('dragO');
      var dragP = getPosition(dragO);
      var dragX = new coord(dragP.x+dragO.clientWidth, dragP.y+dragO.clientHeight);
      var off   = getPosition(drag_targ);
      var tX, tY, minX, minY, maxX, maxY;
      var sX, sY;
      var safety = false;
      var msg = document.getElementById("message");

      tX = (mousePos.x - mouseOffset.x);
      tY = (mousePos.y - mouseOffset.y);

      minX = dragP.x;
      minY = dragP.y;
      maxX = dragX.x;
      maxY = dragX.y;
      
      pos = CheckBounds(tX, tY, drag_targ.clientWidth, drag_targ.clientHeight, minX, minY, maxX, maxY);

      if (mousePos.x > dragX.x+25 || mousePos.x < dragP.x-25)
          safety = true;

      if (mousePos.y > dragX.y+25 || mousePos.y < dragP.y-25)
          safety = true;


      pA   = document.getElementById("dragO");
      pD   = document.getElementById("drag");

      tmp.style.top  = (-pos.x)+"px";
      tmp.style.left = (-pos.y)+"px";

      drag_targ.style.position = "absolute";
      drag_targ.style.top      = pos.x+"px";
      drag_targ.style.left     = pos.y+"px";

      if (safety)
          drag_targ = null;

      synch_scroll(pos);
   }
}

function CheckBounds(x,y,width, height, minx, miny, maxx, maxy)
{
   var msg = document.getElementById("message");
//   message.innerHTML = "Pos["+x+","+y+"] Size["+width+","+height+"] Min["+minx+","+miny+"] Max["+maxx+","+maxy+"]<br />";

   if (x < minx)
   {
//      message.innerHTML += "MINX["+x+":"+minx+"]";
      x = minx;
   }

   if (y < miny)
   {
//      message.innerHTML += "MINX["+y+":"+miny+"]";
      y = miny;
   }

   if ((x+width) > maxx)
   {
//      message.innerHTML += "MAXX["+x+":"+maxx+"]";
      x = maxx-width;
   }

   if ((y+height) > maxy)
   {
//      message.innerHTML += "MAXY["+y+":"+maxy+"]";
      y = maxy-height;
   }
   return new coord(y,x);
}


function mouseCoords(ev)
{
   return new coord(
      ev.clientX + document.body.scrollLeft - document.body.clientLeft,
      ev.clientY + document.body.scrollTop  - document.body.clientTop
   );
}

function coord(px, py)
{
   this.x = px;
   this.y = py;
}

var viewSize, imageSize;

function click_drag(root, evt)
{
   evt = evt || window.event;
   var x = evt.clientX;
   var y = evt.clientY;
   var e_pan = document.getElementById("dragO");
   
   var w = e_pan.clientWidth;
   var h = e_pan.clientHeight;

   x = x-(w/2);
   y = y-(h/2);

   var targ  = document.getElementById('drag');
   var dragO = document.getElementById('dragO');
   var dragI = document.getElementById('drag2');
   var dragP = getPosition(dragO);
   var dragX = new coord(dragP.x+dragO.clientWidth, dragP.y+dragO.clientHeight);

   minX = dragP.x;
   minY = dragP.y;
   maxX = dragX.x;
   maxY = dragX.y;
      
   pos = CheckBounds(x, y, targ.clientWidth, targ.clientHeight, minX, minY, maxX, maxY);

   dragI.style.top  = (-pos.x)+"px";
   dragI.style.left = (-pos.y)+"px";

   targ.style.position = "absolute";
   targ.style.top      = pos.x+"px";
   targ.style.left     = pos.y+"px";
   synch_scroll(pos);
}

function start_drag(root, evt)
{
   if (drag_targ != null)
   {
       drag_targ = null;
       return;
   }
   evt = evt || window.event;

   var elem_view, elem_photo, elem_pan;
   
   elem_view  = document.getElementById("photo");
   elem_photo = document.getElementById("photo2");
   elem_pan   = document.getElementById("dragO");

   update_panner();

   var msg = document.getElementById("message");
//   msg.innerHTML += "Start: ID["+root+"]<br />";
   drag_targ = document.getElementById(root);

   drag_start = getPosition(drag_targ);
   drag_off   = new coord((evt.clientX-drag_start.x),(evt.clientY-drag_start.y));
   mouseOffset = drag_off;

//   msg.innerHTML += "Target: X["+drag_start.x+"] Y["+drag_start.y+"]<br />";
//   msg.innerHTML += "Offset: X["+drag_off.x+"] Y["+drag_off.y+"]<br />";

//   msg.innerHTML += "EVT: X["+evt.clientX+"] Y["+evt.clientY+"]<br />";
   return false;
}

var panAdj = null;

function update_panner()
{
   var x1, y1, x2, y2, x3, y3, x4, y4;
   var elem_view, elem_photo, elem_pan;
   var targ;
   var msg = document.getElementById("message");

   targ       = document.getElementById("drag");
   elem_view  = document.getElementById("photo");
   elem_photo = document.getElementById("photo2");
   elem_pan   = document.getElementById("dragO");

   var phV = new coord(elem_view.clientWidth, elem_view.clientHeight);
   var phA = new coord(elem_photo.clientWidth, elem_photo.clientHeight);
   var paA = new coord(elem_pan.clientWidth, elem_pan.clientHeight);
   var paV = new coord(targ.clientWidth, targ.clientHeight);
   
//   msg.innerHTML = ""
//                 + "PHV: "+coord_str(phV)
//                 + "PHA: "+coord_str(phA)
//                 + "PAV: "+coord_str(paV)
//                 + "PAA: "+coord_str(paA);

   x1 = (phV.x < phA.x ? (phV.x / phA.x) : 1.00);
   y1 = (phV.y < phA.y ? (phV.y / phA.y) : 1.00);

   x2 = (paA.x * x1);
   y2 = (paA.y * y1);   

   panAdj = new coord(x2, y2);

   targ.style.width = x2+"px";
   targ.style.height = y2+"px";
}

function synch_scroll(pos)
{
   var ePH = document.getElementById("photo");

   var elem_view  = document.getElementById("drag");
   var elem_photo = document.getElementById("photo");
   var phV = new coord(elem_view.clientWidth, elem_view.clientHeight);
   var phA = new coord(elem_photo.clientWidth, elem_photo.clientHeight);
   var x1 = (phV.x < phA.x ? (phV.x / phA.x) : 1.00);
   var y1 = (phV.y < phA.y ? (phV.y / phA.y) : 1.00);

   pan = new coord(x1, y1);
   ePH.scrollTop  = pos.x/pan.x;
   ePH.scrollLeft = pos.y/pan.y;
}

function synch_scroll2()
{
   var phV, phD;
   var paV, paD;
   
   phV = document.getElementById("photo");
   phD = document.getElementById("photo2");

   paV = document.getElementById("dragO");
   paD = document.getElementById("drag");
   paX = document.getElementById("drag2");
   
   c1  = new coord((paD.x/phD.x), (paD.y/phD.y));
   c2  = new coord(phV.scrollLeft, phV.scrollTop);
   pos = new coord((c2.x*c1.x),(c2.y*c1.y));
   
   paD.style.top  = pos.x+"px";
   paD.style.left = pos.y+"px";
   paX.style.top  = "-"+(pos.x)+"px";
   paX.style.left = "-"+(pos.y)+"px";
}

function coord_str(c)
{
    return "X["+c.x+"]Y["+c.y+"]<br />";
}

function update_scroll(x1, y1, x2, y2)
{
   
}

function stop_drag()
{
    drag_targ = null;
}

function clear_dragtarg()
{
   drag_targ.style.position = "relative";
   drag_targ.style.top      = "0px";
   drag_targ.style.left     = "0px";
   drag_targ = null;
}

var base_width = 750;
var min_pct = 50;
var max_pct = 200;
var cur_zoom = 100;
function zoom_to(pct)
{
   if (pct < min_pct)
      pct = min_pct;
   if (pct > max_pct)
      pct = max_pct;
   
   var elem = document.getElementById('photo2');
   elem.width = (base_width*(pct/100));
//   var drag = document.getElementById('drag');
//   var pos  = getPosition(drag);
   update_panner();
//   synch_scroll2()
//   synch_scroll(pos);
   cur_zoom = pct;
}

function zoom_in()
{
   zoom_to(cur_zoom+10);
}

function zoom_out()
{
   zoom_to(cur_zoom-10);
}

