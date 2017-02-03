function tree_view(cell,row,type,child,field,term,isall, id)
{
    var elem_row, elem_cur, elem_cell, elem_tbl, type2, id2, rowid, toggle, elem_row2;
    var i, max, debug, mode, elem_cell1, elem_cell2, term2;

    if (child == "")
        return;
    elem_row = document.getElementById('r_'+row);
    debug = false;

    elem_tbl = document.getElementById("target");

    elem_cell1 = elem_row.cells[0];
    elem_cell2 = elem_row.cells[1];

    mode = elem_cell1.getAttribute("mode");
    elem_cell1.setAttribute("mode", (mode == "show" ? "hide" : "show"));

    elem_cell1.setAttribute("title", (mode == "show" ? "Collapse " : "Expand ")+term+".");
    elem_cell1.innerHTML = (mode == "show" ? "-" : "+");

    elem_cell2.setAttribute("title", (mode == "show" ? "Collapse everything under this " : "Expand everything under this ")+term+".");

    if (elem_row.className.indexOf(" node_open"))
        elem_row.className = elem_row.className.replace(" node_open", "");
    if (elem_row.className.indexOf(" node_closed"))
        elem_row.className = elem_row.className.replace(" node_closed", "");
    elem_row.className += (mode == "show" ? " node_open" : " node_closed");

    for(i=0,max=elem_tbl.rows.length; i<max; i++)
    {
        elem_cur  = elem_tbl.rows[i];
        elem_cell = elem_cur.cells[0];
        type2 = elem_cell.getAttribute("table");
        rowid = elem_cell.getAttribute("rowid");
        term2 = elem_cell.getAttribute("term");

        if (type2 == type)
            continue;

        id2   = elem_cell.getAttribute(field);
        if (debug)
            debug = confirm(type+"\n"+type2+"\n-------\n"+id+"\n"+id2+"\n"+field);
        if (id2 == "")
            continue;
        if (id != id2)
            continue;

        if (isall)
        {
            if (id2 == "")
                continue;

            if (elem_cur.className.indexOf(" node_open"))
                elem_cur.className = elem_cur.className.replace(" node_open", "");
            if (elem_cur.className.indexOf(" node_closed"))
                elem_cur.className = elem_cur.className.replace(" node_closed", "");

            elem_cell1 = elem_cur.cells[0];
            elem_cell2 = elem_cur.cells[1];

            if (elem_cell1.innerHTML == "+" || elem_cell1.innerHTML == "-")
            {
                elem_cur.className += (mode == "show" ? " node_open" : " node_closed");

                elem_cell1.setAttribute("title", (mode == "show" ? "Collapse " : "Expand ")+term2+".");
                elem_cell1.innerHTML = (mode == "show" ? "-" : "+");
                elem_cell2.setAttribute("title", (mode == "show" ? "Collapse everything under this " : "Expand everything under this ")+term2+".");
            }

            elem_cell.setAttribute("mode", (mode == "show" ? "hide" : "show"));
            if (mode == "show")
            {
                elem_cell.setAttribute("activate", "true");
                elem_cur.style.display = "block";
            }
            else
            {
                elem_cell.setAttribute("activate", "false");
                elem_cur.style.display = "none";
            }
        }
        else if (type2 == child)
        {
            if (mode == "show")
            {
                elem_cell.setAttribute("activate", "true");
                elem_cur.style.display = "block";
            }
            else
            {
                elem_cell.setAttribute("activate", "false");
                elem_cur.style.display = "none";
            }
        }
        else if (elem_cell.getAttribute("activate") == "true")
        {
            elem_cur.style.display = (mode == "show") ? "block" : "none";
        }
    }
}
