function padd_suffix(text, padd, num) {
    var pos, ret;
    ret = text;
    for (pos = 0; pos < num; pos++) {
        ret += padd;
    }
    return ret;
}

function round(value, places) {
    var ret;
    if (places == 0) {
        ret = Math.round(value);
    }
    else if (places > 0)
        ret = (Math.round(value * Math.pow(10, places)) / Math.pow(10, places));
    else
        ret = Math.round(value / Math.pow(10, Math.abs(places)));
    return ret;
}

function format_number(value, places, paren, prefix, suffix) {
    var val, len, right, left, pos, isneg;
    var i, ret, max;

    isneg = (value < 0);

    val = "" + round(Math.abs(value), places);

    if (places > 0) {
        len = val.length;
        if ((pos = val.indexOf(".")) == -1) {
            val = padd_suffix(val + ".", "0", places);
        }
        else if ((len - pos) < (places + 1)) {
            val = padd_suffix(val, "0", 1 + (places - (len - pos)));
        }
    }

    len = val.length;
    if ((pos = val.indexOf(".")) == -1)
        pos = val.length;

    if (pos > 3) {
        left = (pos % 3);
        ret = "";

        for (i = 0; i < len; i++) {
            adj = (i - left);
            if (i < pos && i > 0) {
                if ((adj % 3) == 0)
                    ret += ",";
            }
            ret += val.charAt(i);
        }
    }
    else
        ret = val;

    return (isneg ? (paren ? "(" + prefix + ret + suffix + ")" : prefix + "-" + ret + suffix) : prefix + ret + suffix);
}
