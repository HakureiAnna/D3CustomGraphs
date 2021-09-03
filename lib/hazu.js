const GRADIENT_LINEAR = 0;

addDefs = (selection, id="", cls="") => {
    selection = selection.append("defs");
    return assignIC(selection, id, cls);
}

addGroup = (selection, id="", cls="") => {
    selection = selection.append("g");
    return assignIC(selection, id, cls);
}

addLinearGradient = (x1, x2, y1, y2, stops, id) => {
    var selection = d3.select("defs")
        .append("linearGradient")
        .attr("id", id)
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2);
        selection.selectAll("stop").data(stops).enter()
            .append("stop")
            .attr("offset", function(d) {
                return d.offset + "%"; 
            })
            .attr("stop-color", function(d) {
                return d.stopColor;
            })
            .attr("stop-opacity", function(d) {
                return d.stopOpacity;
            });

    return selection;
}

assignIC = (selection, id, cls) => {
    if (id.length > 0)
        selection = selection.attr("id", id);
    if (cls.length > 0)
        selection = selection.attr("class", cls);
    return selection;
}

createLinearScale = (domain, range) => {
    return d3.scaleLinear()
        .domain(domain)
        .range(range);
}

createLogScale = (domain, range) => {
    return d3.scaleLog()
        .domain(domain)
        .range(range);
}

createOrdinalScale = (domain, range) => {
    return d3.scaleOrdinal()
        .domain(domain)
        .range(range);
}

createPowScale = (e, domain, range) => {
    return d3.scalePow()
        .exponent(e)
        .domain(domain)
        .range(range);
}

createQuantileScale = (domain, range) => {
    return d3.scaleQuantile()
        .domain(domain)
        .range(range);
}

drawCircle = (selection, fill, stroke, strokeWidth, cx, cy, r, id="", cls="") => {
    selection = selection.append("circle")
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r);
    return assignIC(selection, id, cls);
}

drawDashedLine = (selection, stroke, strokeWidth, x1, x2, y1, y2, pattern, id="", cls="") => {
    selection = drawLine(selection, stroke, strokeWidth, x1, x2, y1, y2);
    var dArray = pattern[0];
    for (var i=1; i<pattern.length; ++i) 
        dArray += " " + pattern[i];
    selection = selection.attr("stroke-dasharray", dArray);
    return selection;
}

drawLine = (selection, stroke, strokeWidth, x1, x2, y1, y2, id = "", cls = "") => {
    selection = selection.append("line")
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth);
    return assignIC(selection, id, cls);
}

drawPath = (selection, fill, stroke, strokeWidth, d, id="", cls="") => {
    selection = selection.append("path")
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("d", d);
    return assignIC(selection, id, cls);
}

drawPolygon = (selection, fill, stroke, strokeWidth, points, id = "", cls = "") => {
    selection = selection.append("polygon")
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth);

    selection = selection.attr("points", points);

    return assignIC(selection, id, cls);
}

drawRect = (selection, fill, stroke, strokeWidth, x, y, width, height, id = "", cls = "") => {
    selection = selection.append("rect")
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height);
    return assignIC(selection, id, cls);
}

drawRoundedRect = (selection, fill, stroke, strokeWidth, x, y, width, height, rx, ry, id="", cls="") => {
    selection = drawRect(selection, fill, stroke, strokeWidth, x, y, width, height, id, cls);
    selection = selection.attr("rx", rx)
        .attr("ry", ry);
    return selection;
}

drawSubText = (selection, fill, fontSize, fontFamily, fontWeight, text, id="", cls="") => {
    selection = selection.append("tspan")
        .attr("fill", fill)
        .attr("font-size", fontSize)
        .attr("font-family", fontFamily)
        .attr("font-weight", fontWeight)
        .text(text);
    return assignIC(selection, id, cls);
}

drawText = (selection, fill, fontSize, fontFamily, fontWeight, textLength, x, y, text, subTexts=[], id = "", cls = "") => {
    selection = selection.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("fill", fill)
        .attr("font-size", fontSize)
        .attr("font-family", fontFamily)
        .attr("font-weight", fontWeight)
        .attr("textLength", textLength)
        .text(text);
    for (var i=0; i<subTexts.length; ++i) {
        drawSubText(selection, subTexts[i].color, subTexts[i].fontSize, subTexts[i].fontFamily, subTexts[i].fontWeight, subTexts[i].text, subTexts[i].id, subTexts[i].cls);
    }
    return assignIC(selection, id, cls);
}

formatPolygonPoints = (d) => {
    var pts = d[0].x + "," + d[0].y;
    for (var i=1; i < d.length; ++i)
        pts += " " + d[i].x + "," + d[i].y;        
    return pts;
}

scaleToUnit = (data, unit) => {
    var isNegative = data < 0;
    return (isNegative? Math.floor(data/unit): Math.ceil(data/unit)) * unit;
}