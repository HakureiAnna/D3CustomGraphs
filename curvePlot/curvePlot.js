var curvePlot = function() {
    return {
        axes: {
            xAxis: null,
            yAxis: null,
        },
        colors: {
            curves: ["#3cf4f1", "#6be840", ],
            axes: "#3cf4f1",
            selection: "rgba(60,244,241, 0.2)"
        },
        gradients: {            
            opacity: {
                start: 0.2,
                end: 0.1,
            },
        },
        data: null,
        formatters: {
            inputTimeFormatter: {
                formatString: "%Y/%m/%d",
                parse: null,
            },
        },
        generators: {
            curve: null,
        },
        measurements: {
            axes: {
                x: {
                    labelOffset: 13,
                },
                y: {
                    labelOffset: -4,
                },
            },
            chart: {
                w: 1024,
                h: 256,
            },
            data: {
                pointRadius: 3,
            },
            legend: {
                lineW: 20,             
                offsetData: 20,
                offsetLineY: 2,
                offsetTextX: 10,
                offsetTextY: 2,
                offsetX: 800,
                offsetY: 10,   
                textW: 20,
                
            },
            padding: {
                b: 20,
                l: 40,
                r: 40,
                t: 30,
            },       
            selection: {
                boxH: 50,
                boxOffset: 10,
                boxW: 120,
                curveInfoOffset: 100,
                lineH: 220,
                lineOffset: 15,
                lineW: 20,
                unitFontSize: 12,
                unitXOffset: 70,
                unitYOffset: 3,
                valueFontSize: 15,
                valueXOffset: 40,
                valueYOffset: 4,
            },
            yTicksPerUnit: 5,  
            yUnit: 1000,
        },
        scales: {
            xScale: null,
            yScale: null,
        },
        svg: null,
        createGradients: function() {
            var curveColors = this.colors.curves;
            var gradientOpacity = this.gradients.opacity;
            this.svg.append("defs").selectAll("linearGradient")
                .data(curveColors)
                .enter()
                .append("linearGradient")
				.attr("id", function(d, i) {
                    return "curveGradient" + i;
                })
				.attr("x1", 0)
				.attr("x2", 0)
				.attr("y1", 0)
                .attr("y2", 1);
            for (var i=0; i<curveColors.length; ++i) {
                this.svg.select("#curveGradient" + i)
                    .selectAll("stop")
                    .data([
                        {offset: "0%",  color: curveColors[i], opacity: gradientOpacity.start},
                        {offset: "100%", color: curveColors[i], opacity: gradientOpacity.end}
                    ])
                    .enter()
                    .append("stop")
                    .attr("offset", function(d) {
                        return d.offset;
                    })
                    .attr("stop-color", function(d) {
                        return d.color;
                    })
                    .attr("stop-opacity", function(d) {
                        return d.opacity;
                    });
            }            
        },
        createSelection: function() {
            var selection = this.svg.append("g")
                .attr("id", "selection")
                .attr("transform", "translate(" + (this.measurements.chart.w+10) + "," + this.measurements.padding.t + ")");

            selection.append("line")
                .attr("x1", 0)
                .attr("x2", 0)
                .attr("y1", 0)
                .attr("y2", this.measurements.selection.lineH)
                .attr("stroke-dasharray", "10,10")
                .attr("stroke", this.colors.axes)
                .attr("stroke-width", 2);

            var infoBox = selection.append("g")
                .attr("id", "selection-infoBox")
                .attr("transform", "translate(" + this.measurements.selection.boxOffset + "," + this.measurements.selection.boxH/2 + ")");
            
            // create box
            var box = infoBox.append("rect")
                .attr("id", "selection-box")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", this.measurements.selection.boxW)
                .attr("height", this.measurements.selection.boxH)
                .attr("fill", this.colors.selection);

            // create text
            var h13 = this.measurements.selection.boxH / 3;
            var h23 = this.measurements.selection.boxH * 2 / 3;
            infoBox.append("line")
                .attr("id", "selection-line-1")
                .attr("x1", this.measurements.selection.lineOffset)
                .attr("x2", this.measurements.selection.lineOffset + this.measurements.selection.lineW)
                .attr("y1", h13)
                .attr("y2", h13)
                .attr("stroke", this.colors.curves[0]);

            infoBox.append("text")
                .attr("id", "selection-value-1")
                .text("100")
                .attr("x", this.measurements.selection.valueXOffset)
                .attr("y", h13+this.measurements.selection.valueYOffset)
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "central")
                .attr("fill", "white")
                .attr("font-size", 18);

            infoBox.append("text")
                .attr("id", "selection-unit-1")
                .text("(个)")
                .attr("x", this.measurements.selection.unitXOffset)
                .attr("y", h13+this.measurements.selection.valueYOffset)
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "central")
                .attr("fill", this.colors.curves[0])
                .attr("font-size", 12);

            infoBox.append("line")
                .attr("id", "selection-line-2")
                .attr("x1", this.measurements.selection.lineOffset)
                .attr("x2", this.measurements.selection.lineOffset + this.measurements.selection.lineW)
                .attr("y1", h23)
                .attr("y2", h23)
                .attr("stroke", this.colors.curves[1]);

            infoBox.append("text")
                .attr("id", "selection-value-2")
                .text("100")
                .attr("x", this.measurements.selection.valueXOffset)
                .attr("y", h23+this.measurements.selection.valueYOffset)
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "central")
                .attr("fill", "white")
                .attr("font-size", this.measurements.selection.valueFontSize);

            infoBox.append("text")
                .attr("id", "selection-unit-2")
                .text("(个)")
                .attr("x", this.measurements.selection.unitXOffset)
                .attr("y", h23+this.measurements.selection.unitYOffset)
                .attr("text-anchor", "start")
                .attr("alignment-baseline", "central")
                .attr("fill", this.colors.curves[1])
                .attr("font-size", this.measurements.selection.unitFontSize);


        },
        drawAxes: function(){
            this.svg.append("g")
                .attr("class", "axis x")
                .attr("transform", "translate(0," + (this.measurements.chart.h-this.measurements.padding.b) + ")")
                .call(this.axes.x);

            this.svg.select(".x.axis")
                .append("line")
                .attr("x1", this.measurements.padding.l * 3 / 4)
                .attr("x2", this.measurements.chart.w - (this.measurements.padding.r / 2))
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("stroke", this.colors.axes);

            this.svg.select(".x.axis")
                .append("text")
                .text("(日期)")
                .attr("fill", this.colors.axes)
                .attr("x", this.measurements.chart.w - this.measurements.padding.r/2)
                .attr("y", this.measurements.axes.x.labelOffset);

            this.svg.append("g")
                .attr("class", "axis y")
                .attr("transform", "translate(" + (this.measurements.padding.l*3/4) + ",0)")
                .call(this.axes.y);

            this.svg.select(".y.axis")
                .append("text")
                .text("(个)")
                .attr("fill", this.colors.axes)
                .attr("x", this.measurements.axes.y.labelOffset)
                .attr("y", this.measurements.padding.t / 2);
        },
        drawData: function(){
            var lineGenerator = this.generators.line;
            var svg = this.svg;
            var curveColors = this.colors.curves;
            var padding = this.measurements.padding;
            var chart = this.measurements.chart;
            var xScale = this.scales.x;
            var yScale = this.scales.y;
            
            // draw lines
            svg.append("g")
                .attr("id", "data")
                .selectAll("path")
                .data(this.data)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", function(d, i) {
                    return curveColors[i];
                })
                .attr("stroke-width", 2)
                .attr("d", function(d) {
                    return lineGenerator(d.data);
                });

            // draw points
            for (var i=0; i<this.data.length; ++i) {
                var name = this.data[i].name;
                var measurements = this.measurements;
                var curveColors = this.colors.curves;
                svg.select("#data")
                    .append("g")
                    .attr("id", name);

                svg.select("#" + name)
                    .selectAll("circle")
                    .data(this.data[i].data) 
                    .enter()
                    .append("circle")
                    .attr("id", function(d) {
                        return name + d.x;
                    })
                    .attr("cx", function(d) {
                        return xScale(d.x);
                    })
                    .attr("cy", function(d) {
                        return yScale(d.y);
                    })
                    .attr("r", this.measurements.data.pointRadius)
                    .attr("fill", "rgba(0,0,0,0)")
                    .attr("color", this.colors.curves[i])
                    .attr("value", function(d) {
                        return d.y;
                    })
                    .on("mouseenter", function() {            

                        // fill colors
                        var point = svg.select("#" + this.id);
                        var otherPoint;
                        point.attr("fill", point.attr("color"));
                        d3.select("#data").selectAll("circle").attr("fill", function(d) {
                            var me = svg.select("#" + this.id);
                            if (me.attr("cx") == point.attr("cx"))
                            {
                                otherPoint = me;
                                return me.attr("color");
                            }
                            return "rgba(0, 0, 0, 0)";
                        });

                        // move info box
                        var selection = svg.select("#selection");
                        selection.attr("transform", "translate(" + point.attr("cx") + "," + measurements.padding.t + ")");
                        var yOffset = Number(point.attr("cy")) - measurements.selection.boxH*2/3;
                        console.log(yOffset);
                        var infoBox = selection.select("#selection-infoBox");
                        infoBox.attr("transform", "translate(" + measurements.selection.boxOffset + "," + yOffset + ")");
                        if (point.attr("color") == curveColors[0]) {
                            infoBox.select("#selection-value-1").text(point.attr("value"));
                            infoBox.select("#selection-value-2").text(otherPoint.attr("value"));
                        } else {
                            infoBox.select("#selection-value-1").text(otherPoint.attr("value"));
                            infoBox.select("#selection-value-2").text(point.attr("value"));
                        }                        
                    });                    
            }

            // draw gradients
            svg.append("g")
                .attr("id", "gradients")
                .selectAll("path")
                .data(this.data)
                .enter()
                .append("path")
                .attr("fill", function(d, i) {
                    return "url(#curveGradient" + i + ")";
                })
                .attr("d", function(d) {
                    var pathData = lineGenerator(d.data);
                    pathData += "L" + xScale(d.data[d.data.length-1].x) + "," + (chart.h - padding.b)
                        + "L" + xScale(d.data[0].x) + "," + (chart.h - padding.b) + "z";
                    return pathData;
                })
                .style("pointer-events", "none");
        },
        drawLegend: function() {
            var legends = this.svg.append("g")
                .attr("transform", "translate(" + this.measurements.legend.offsetX + "," + this.measurements.legend.offsetY + ")");
            var x1 = this.measurements.legend.offsetData;
            var x2 = x1 + this.measurements.legend.lineW;
            for (var i=0; i<this.data.length; ++i) {
                legends.append("line")
                    .attr("x1", x1)
                    .attr("x2", x2)
                    .attr("y1", this.measurements.legend.offsetLineY)
                    .attr("y2", this.measurements.legend.offsetLineY)
                    .attr("stroke", this.colors.curves[i])
                    .attr("stroke-width", 1);
                x1 = x2 + this.measurements.legend.offsetTextX;
                legends.append("text")
                    .attr("x", x1)
                    .attr("y", this.measurements.legend.offsetY)
                    .text(this.data[i].name);
                x1 += this.measurements.legend.textW + this.measurements.legend.offsetData;
                x2 = x1 + this.measurements.legend.lineW;
            }
        },
        getCurveColor: function(i) {
            return this.colors.curves[i];
        },
        getXLength: function() {
            var length = 0;
            this.data.forEach(function(d) {
                var curLength = d.data.length;
                length = curLength > length? curLength: length;
            });
            return length;
        },
        getYMax: function() {
            var yUnit = this.measurements.yUnit;
            var max = d3.max(this.data, function(d) {
                return d3.max(d.data, function(e) {
                    return e.y;
                });
            });
            if (max % yUnit == 0)
                return max;
            return (parseInt(max / yUnit) + 1) * yUnit;
        },
        run: function(svgId, data) {
            this.setup(svgId, data);
            this.createGradients();
            this.createSelection();
            this.drawData();
            this.drawLegend();
            this.drawAxes();
        },
        setup: function(svgId, data) {
            // set up references to external resouces
            this.svg = d3.select("#" + svgId)
                .attr("width", this.measurements.chart.w)
                .attr("height", this.measurements.chart.h);
            this.data = data;

            // format input data
            this.formatters.inputTimeFormatter.parse = d3.timeParse(this.formatters.inputTimeFormatter.formatString);

            var parse = this.formatters.inputTimeFormatter.parse;
            this.data.forEach(function(d) {
                d.data.forEach(function(e) {
                    e.x = parse(e.x).getDate();                
                });
            });

            this.scales.x = d3.scaleLinear()
                .domain([
                    d3.min(this.data, function(d) {
                        return d3.min(d.data, function(e) {
                            return e.x;
                        });
                    }),
                    d3.max(this.data, function(d) {
                        return d3.max(d.data, function(e) {
                            return e.x;
                        });
                    })
                ])
                .rangeRound([this.measurements.padding.l, this.measurements.chart.w - this.measurements.padding.r]);            

            this.axes.x = d3.axisBottom()
                .scale(this.scales.x)
                .ticks(this.getXLength());

            this.scales.y = d3.scaleLinear()
                .domain([0, this.getYMax()])
                .rangeRound([this.measurements.chart.h - this.measurements.padding.b, this.measurements.padding.t]);

            this.axes.y = d3.axisLeft()
                .scale(this.scales.y)
                .ticks(this.getYMax() / 1000 * 5);

            var xScale = this.scales.x;
            var yScale = this.scales.y;
                
            this.generators.line = d3.line()
                .x(function(d) { 
                    return xScale(d.x); 
                })
                .y(function(d) {
                    return yScale(d.y);
                })
                .curve(d3.curveCardinal);
        },
    }
}