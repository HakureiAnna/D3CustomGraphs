var assignIdAndClass = function(selection, id, cls) {
    if (id.length > 0)
        selection = selection.attr("id", id);
    if (cls.length > 0)
        selection = selection.attr("class", cls);
    return selection;
}

var getMax = function(data, key) {
    return d3.max(data, function(d) {
        return d3.max(d.data, function(e) {
            return e[key];
        });
    });
}

var getMin = function(data, key) {
    return d3.min(data, function(d) {
        return d3.min(d, function(e) {
            return e[key];
        });
    });
}

var initializeSvg = function(svg, w, h) {
    return svg.attr("width", w)
        .attr("height", h);    
}

var newCircle = function(selection, cx, cy, r, id="", cls="") {
    var selection = selection.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r);
    return assignIdAndClass(selection, id, cls);    
}

var newGroup = function(selection, transform, id="", cls="") {
    var selection = selection.append("g");
    if (transform.length > 0)
        selection = selection.attr("transform", transform);
    return assignIdAndClass(selection, id, cls);
}

var newLine = function(selection, x1, x2, y1, y2, stroke, strokeWidth="", id="", cls="") {
    var selection = selection.append("line")
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth);
    return assignIdAndClass(selection, id, cls);
}

var newPath = function(selection, fill, stroke, strokeWidth, d, id="", cls="") {
    var selection = selection.append("path")
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("d", d);
    return assignIdAndClass(selection, id, cls);
}

var newRect = function(selection, x, y, w, h, fill="", id="", cls="") {
    var selection = selection.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", w)
        .attr("height", h);

    if (fill.length > 0)
        selection = selection.attr("fill", fill);
    return assignIdAndClass(selection, id, cls);
}

var newText = function(selection, x, y, fill, text, id="", cls="") {
    var selection = selection.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("fill", fill)
        .text(text);
    return assignIdAndClass(selection, id, cls);
}

var sumByKey = function(data, limit, key) {
    var retVal = [];
    for (var i=0; i<data[0].data.length; ++i) {
        var curVal = 0;
        for (var j=0; j<limit; ++j) {
            curVal += data[j].data[i][key];
        }
        retVal.push(curVal);
    }
    return retVal;
}