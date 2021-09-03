var multiLineBarchart = function() {
    return {
        getCustomId: function(x) {
            return "noob" + "-" + x;
        },
        axes: {
            x: {
                axis: null,
                color: "#84eaff",
                domain:  [
                    "一月", "二月", "三月", "四月", "五月", "六月",
                    "七月", "八月", "九月", "十月", "十一月", "十二月",
                ],
                lineWidth: 2,
                range: [],
                scale: null,
                unitFontSize: 12,     
            },
            yL: {
                axis: null,
                axisOffset: 10,
                color: "#84eaff",
                domain: [],
                range: [],
                scale: null,
                unit: 300,
                unitFontFamily: "sans-serif",
                unitFontSize: 12,                
                unitText: "水量 (万m³)",
                unitTextOffsetX: 68,
                unitTextOffsetY: 52,                
            },
            yR: {
                axis: null,
                axisOffset: 10,
                color: "#84eaff",
                domain: [],
                range: [],
                scale: null,
                unit: 5,
                unitFontFamily: "sans-serif",
                unitFontSize: 12,
                unitText: "漏损率 (%)",
                unitTextOffsetX: -68,
                unitTextOffsetY: 52,                
            },
        },
        barchart: {
            barWidth: 20,
        },
        chart: {
            w: 1024,
            h: 356,
        },
        data: null,
        gradient: {
            id: "bar-gradient",
            data: [
                {offset: "0%",  color: "black", opacity: 1},
                {offset: "100%", color: "black", opacity: 0.5}
            ],
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,

        },
        legend: {
            dataOffset: 100,
            legendOffsetX: 0,
            legendOffsetY: 0,
            lineOffsetX: 10,
            lineOffsetY: 15,
            lineStrokeWidth: 2,
            lineWidth: 20,
            rectOffsetX: 10,
            rectOffsetY: 10,
            rectWidth: 10,
            textColor: "#84eaff",
            textFontFamily: "sans-serif",
            textFontSize: 12,
            textLineOffsetX: 40,
            textRectOffsetX: 30,
            textOffsetY: 20,
        },
        line: {
            generator: null,
            w: 2,
        },
        padding: {
            b: 30,
            l: 20,
            r: 20,
            t: 50,
        },
        createGradients: function() {
            var data = this.data;
            this.gradient.data.forEach((d) => {
                d.color = data[0].data[0].color;
            });
            this.svg.append("defs");
			this.svg.select("defs").append("linearGradient")
				.attr("id", this.getCustomId(this.gradient.id))
				.attr("x1", this.gradient.x1)
				.attr("x2", this.gradient.x2)
				.attr("y1", this.gradient.y1)
				.attr("y2", this.gradient.y2);
			this.svg.select("#" + this.getCustomId(this.gradient.id))
				.selectAll("stop")
				.data(this.gradient.data)
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
        },
        drawAxes: function() {
            var xAxis = newGroup(
                this.svg, 
                "translate(0," + (this.chart.h - this.padding.b) + ")",
                this.getCustomId("x-axis"),
                "axis"
            ).call(this.axes.x.axis)
                .style("color", this.axes.x.color);

            newLine(
                xAxis,
                this.padding.l + this.axes.yL.axisOffset,
                this.chart.w - this.padding.r - this.axes.yR.axisOffset,
                0,
                0,
                this.axes.x.color,
                this.axes.x.lineWidth);

            var yLAxis = newGroup(
                this.svg,
                "translate(" + (this.padding.l + this.axes.yL.axisOffset) + ",0)",
                this.getCustomId("yL-axis"),
                "axis"
            ).call(this.axes.yL.axis)
                .style("color", this.axes.yL.color);
            newText(
                yLAxis,
                this.axes.yL.unitTextOffsetX,
                this.axes.yL.unitTextOffsetY,
                this.axes.yL.color,
                this.axes.yL.unitText
            ).attr("font-size", this.axes.yL.unitFontSize)
                .attr("font-family", this.axes.yL.unitFontFamily);

            var yRAxis = newGroup(
                this.svg,
                "translate(" + (this.chart.w - this.padding.r - this.axes.yR.axisOffset) + ",0)",
                this.getCustomId("yR-axis"),
                "axis"
            ).call(this.axes.yR.axis)
                .style("color", this.axes.yR.color);        
            newText(
                yRAxis,
                this.axes.yR.unitTextOffsetX,
                this.axes.yR.unitTextOffsetY,
                this.axes.yR.color,
                this.axes.yL.unitText
            ).attr("font-size", this.axes.yR.unitFontSize)
                .attr("font-family", this.axes.yR.unitFontFamily);
        },
        drawBarcharts: function() {
            var container = newGroup(
                this.svg,
                "translate(0,0)",
                this.getCustomId("barcharts")
            );
            var prevY = [];
            var barcharts = this.data[0].data;
            var barWidth = this.barchart.barWidth;
            var xScale = this.axes.x.scale;
            var yScale = this.axes.yL.scale;
            var order = [0, 2, 1]
            var gradientId = this.getCustomId(this.gradient.id);
            

            for (var i=0; i<barcharts[0].data.length; ++i) {
                prevY.push(0);
            }

            for (var i=0; i<barcharts.length; ++i) {
                var barchart = barcharts[order[i]];
                var subContainer = newGroup(
                    container,
                    "translate(0, 0)",
                    this.getCustomId("barchart-" + barchart.name)
                );

                newRect(
                    subContainer.selectAll("rect")
                        .data(barchart.data)
                        .enter(),
                    function(d) {
                        return xScale(d.x) - barWidth/2;
                    },
                    function(d, i) {
                        return yScale(prevY[i] + d.y);
                    },
                    barWidth,
                    function(d, i) {
                        var tmp = prevY[i];
                        prevY[i] += d.y;
                        return yScale(tmp) - yScale(prevY[i]);
                    },
                    i? barchart.color: "url(#" + gradientId + ")"
                );
            }
        },
        drawLegend: function() {
            var legend = newGroup(
                this.svg,
                "translate(" + this.legend.legendOffsetX + "," + this.legend.legendOffsetY + ")",
                this.getCustomId("legend")
            );
            var curX = 0;
            for (var i=0; i<this.data.length; ++i) {
                for (var j=0; j < this.data[i].data.length; ++j) {
                    if (i) {
                        newLine(
                            legend,
                            curX + this.legend.lineOffsetX,
                            curX + this.legend.lineOffsetX + this.legend.lineWidth,
                            this.legend.lineOffsetY,
                            this.legend.lineOffsetY,
                            this.data[i].data[j].color,
                            this.legend.lineStrokeWidth
                        );                        
                    } else {
                        newRect(
                            legend,
                            curX + this.legend.rectOffsetX,
                            this.legend.rectOffsetY,
                            this.legend.rectWidth,
                            this.legend.rectWidth,
                            this.data[i].data[j].color
                        );
                    }
                    newText(
                        legend,
                        curX + (i?this.legend.textLineOffsetX: this.legend.textRectOffsetX),
                        this.legend.textOffsetY,
                        this.legend.textColor,
                        this.data[i].data[j].name
                    ).attr("font-family", this.legend.textFontFamily)
                        .attr("font-size", this.legend.textFontSize);

                    curX += this.legend.dataOffset;
                }
            }
        },
        drawLines: function() {
            var lines = newGroup(
                this.svg,
                "translate(0, 0)",
                this.getCustomId("lines")
            );
            var xScale = this.axes.x.scale;
            var yScale = this.axes.yR.scale;

            this.line.generator = d3.line()
                .x(function(d) {
                    return xScale(d.x);
                })
                .y(function(d) {
                    return yScale(d.y);
                });

            for (var i = 0; i < this.data[1].data.length; ++i) {
                newPath(
                    this.svg,
                    "none",
                    this.data[1].data[i].color,
                    this.line.w,
                    this.line.generator(this.data[1].data[i].data)
                );
            }
        },     
        processData: function() {
            // format input data
            var parse = d3.timeParse("%Y/%m/%d");
            
            for (var i=0; i<this.data.length; ++i) {
                for (var j=0; j<this.data[i].data.length; ++j) {
                    for (var k=0; k<this.data[i].data[j].data.length; ++k)
                    {
                        var tmp = this.data[i].data[j].data[k].x;
                        this.data[i].data[j].data[k].x = this.axes.x.domain[parse(tmp).getMonth()];
                    }
                }
            }

            // compute x range
            var xUnit = (this.chart.w - this.padding.l - this.padding.r)/(this.axes.x.domain.length + 1);
            var curX = this.padding.l;
            for (var i=0; i<this.axes.x.domain.length; ++i) {
                curX += xUnit;
                this.axes.x.range.push(curX);
            }

            // compute yL domain and range
            var sumXL = sumByKey(this.data[0].data, 3, "y");    
            var yLMax = Math.ceil(d3.max(sumXL)/this.axes.yL.unit) * this.axes.yL.unit;
            this.axes.yL.domain = [0, yLMax];
            this.axes.yL.range = [this.chart.h - this.padding.b, this.padding.t];

            // compute yR domain and range
            var yRMax = getMax(this.data[1].data, "y");
            var yRMax = Math.ceil(yRMax/this.axes.yR.unit) * this.axes.yR.unit;
            this.axes.yR.domain = [0, yRMax];
            this.axes.yR.range = [this.chart.h - this.padding.b, this.padding.t];
        },
        run: function(svgId, data) {
            this.setup(svgId, data);
            this.createGradients();
            this.drawBarcharts();
            this.drawLines();
            this.drawLegend();
            this.drawAxes();
        },
        setup: function(svgId, data) {
            this.svg = d3.select("#" + svgId)
                .attr("width", this.chart.w)
                .attr("height", this.chart.h);
            this.data = data;

            this.processData();

            this.axes.x.scale = d3.scaleOrdinal()
                .domain(this.axes.x.domain)
                .range(this.axes.x.range);

            this.axes.yL.scale = d3.scaleLinear()
                .domain(this.axes.yL.domain)
                .range(this.axes.yL.range);

            this.axes.yR.scale = d3.scaleLinear()
                .domain(this.axes.yR.domain)
                .range(this.axes.yR.range);

            this.axes.x.axis = d3.axisBottom()
                .scale(this.axes.x.scale)
                .ticks(this.axes.x.domain.length);

            this.axes.yL.axis = d3.axisLeft()
                .scale(this.axes.yL.scale)
                .ticks(this.axes.yL.domain[1]/this.axes.yL.unit + 1);

            this.axes.yR.axis = d3.axisRight()
                .scale(this.axes.yR.scale)
                .ticks(this.axes.yR.domain[1]/this.axes.yR.unit+1);
        }
    };
};