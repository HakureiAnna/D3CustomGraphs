var dashedBarchart = function() {
    return {
        getCustomId: function(x) {
            return "noob" + "-" + x;
        },
        axes: {
            x: {
                axis: null,
                color: "#84eaff",
                domain: [],
                lineWidth: 2,
                range: [],
                scale: null,
                textFontSize: 12,
            },
            y: {
                color: "#84eaff",
                domain:  [0, 100],
                range: [],
                scale: null,
                unit: 20,
            },
        },
        barchart: {
            barWidth: 20,
            lineStrokeWidth: 40,
            lineWidth: 3,
            spaceWidth: 5,
            topStrokeWidth: 2,
            highestColor: "#F4AB2C",
            highestColorA: "rgba(244, 171, 44, 0.3)",
            symbol: '%',
            textColor: "black",
            textFontSize: 14,
            textFontFamily: "sans-serif",
            textOffsetX: -10,
            textOffsetY: -8,
        },
        chart: {
            w: 1024,
            h: 356,
        },
        data: null,
        gradients: [
            {
                id: "bar-gradient-0",
                data: [
                    {offset: "0%",  color: "black", opacity: 0.7},
                    {offset: "100%", color: "black", opacity: 0.3}
                ],
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1,
            },
            {
                id: "bar-gradient-1",
                data: [
                    {offset: "0%",  color: "black", opacity: 0.7},
                    {offset: "100%", color: "black", opacity: 0.3}
                ],
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1,
            },
        ],
        legend: {
            dataOffset: 100,
            legendOffsetX: 700,
            legendOffsetY: 5,
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
            lineStrokeWidth: 2,
            lineWidth: 5,
            spaceWidth: 2,
            textFontFamily: "sans-serif",
            textFontSize: 12,
            textOffsetX: 5,
            textOffsetY: 4,
            unit: '%',
        },
        padding: {
            b: 30,
            l: 20,
            r: 20,
            t: 50,
        },
        createGradients: function() {
            var data = this.data;
            this.gradients[0].data.forEach((d) => {
                d.color = data[1].color;
            });
            this.gradients[1].data.forEach((d) => {
                d.color = this.barchart.highestColor;
            });
            

            var defs = this.svg.append("defs");
            for (var i=0; i<this.gradients.length; ++i) {
                defs.append("linearGradient")
                    .attr("id", this.getCustomId(this.gradients[i].id))
                    .attr("x1", this.gradients[i].x1)
                    .attr("x2", this.gradients[i].x2)
                    .attr("y1", this.gradients[i].y1)
                    .attr("y2", this.gradients[i].y2);
                this.svg.select("#" + this.getCustomId(this.gradients[i].id))
                    .selectAll("stop")
                    .data(this.gradients[i].data)
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
        drawAxes: function() {
            var xAxis = newGroup(
                this.svg, 
                "translate(0," + (this.chart.h - this.padding.b) + ")",
                this.getCustomId("x-axis"),
                "axis"
            ).call(this.axes.x.axis)
                .style("color", this.axes.x.color)
                .style("font-size", this.axes.x.textFontSize);

            newLine(
                xAxis,
                this.padding.l,
                this.chart.w - this.padding.r,
                0,
                0,
                this.axes.x.color,
                this.axes.x.lineWidth);

        },
        drawBarcharts: function() {            
            var data = this.data;
            var xScale = this.axes.x.scale;
            var yScale = this.axes.y.scale;
            var lineStrokeWidth = this.barchart.lineStrokeWidth;
            var barWidth = this.barchart.barWidth;
            var yRange = this.axes.y.range;
            var gradientId = this.getCustomId(this.gradients[0].id);
            var topStrokeWidth = this.barchart.topStrokeWidth;
            var highestGradientId = this.getCustomId(this.gradients[1].id);
            var highestColor = this.barchart.highestColor;
            var highestColorA = this.barchart.highestColorA;
            var highestY = d3.max(this.data[1].data, function(d) {
                return d.y;
            });

            var bars = newGroup(
                this.svg,
                "translate(0, 0)",
                this.getCustomId("bars")
            );

            var back = newGroup(
                bars,
                "translate(0, 0)",
                this.getCustomId("back")
            ).attr("fill", "url(#" + gradientId + ")");
            newLine(
                bars.selectAll("line")
                    .data(this.data[1].data)
                    .enter(),
                    function(d) {
                        return xScale(d.x);
                    },
                    function(d) {
                        return xScale(d.x);
                    },
                    yRange[0],
                    yRange[1],
                    function(d) {
                        if (d.y != highestY)                    
                            return data[1].colorA;
                        return highestColorA;                                    
                    },
                    lineStrokeWidth
            ).attr("stroke-dasharray", this.barchart.lineWidth + "," + this.barchart.spaceWidth);

            var front = newGroup(
                bars,
                "translate(0, 0)",
                this.getCustomId("front")
            );
            newRect(
                front.selectAll("rect")
                    .data(this.data[1].data)
                    .enter(),
                    function(d) {
                        return xScale(d.x) - barWidth/2;
                    },
                    function(d) {
                        return yScale(d.y);
                    },
                    barWidth,
                    function(d) {
                        return yRange[0] - yScale(d.y);
                    },
                    function(d) {
                        if (d.y != highestY)
                            return "url(#" + gradientId + ")";
                        return "url(#" + highestGradientId + ")";
                    }
            );
            newLine(
                front.selectAll("line")
                    .data(this.data[1].data)
                    .enter(),
                    function(d) {
                        return xScale(d.x) - barWidth/2;
                    },
                    function(d) {
                        return xScale(d.x) + barWidth/2;
                    },
                    function(d) {
                        return yScale(d.y);
                    },
                    function(d) {
                        return yScale(d.y);
                    },
                    function(d) {
                        if (d.y != highestY)
                            return data[1].color;
                        return highestColor;
                    },
                    topStrokeWidth
            );
            var textOffsetX = this.barchart.textOffsetX;
            var textOffsetY = this.barchart.textOffsetY;
            var textColor = this.barchart.textColor;
            var symbol = this.barchart.symbol;
            newText(
                bars.selectAll("text")
                    .data(this.data[1].data)
                    .enter(),
                    function(d) {
                        return xScale(d.x) + textOffsetX;
                    },
                    yRange[1] + textOffsetY,
                    function(d) {
                        if (d.y != highestY)
                            return textColor;
                        return highestColor;
                    },
                    function(d) {
                        return d.y + symbol;
                    }
            ).attr("font-family", this.barchart.textFontFamily)
                    .attr("font-size", this.barchart.textFontSize);
        },
        drawLegend: function() {
            var legend = newGroup(
                this.svg,
                "translate(" + this.legend.legendOffsetX + "," + this.legend.legendOffsetY + ")",
                this.getCustomId("legend")
            );
            var curX = 0;
            for (var i=0; i<this.data.length; ++i) {
                if (!i) {
                    newLine(
                        legend,
                        curX + this.legend.lineOffsetX,
                        curX + this.legend.lineOffsetX + this.legend.lineWidth,
                        this.legend.lineOffsetY,
                        this.legend.lineOffsetY,
                        this.data[i].color,
                        this.legend.lineStrokeWidth
                    ).attr("stroke-dasharray", this.line.lineWidth + "," + this.line.spaceWidth);                        
                } else {
                    newRect(
                        legend,
                        curX + this.legend.rectOffsetX,
                        this.legend.rectOffsetY,
                        this.legend.rectWidth,
                        this.legend.rectWidth,
                        this.data[i].color
                    );
                }
                newText(
                    legend,
                    curX + (!i?this.legend.textLineOffsetX: this.legend.textRectOffsetX),
                    this.legend.textOffsetY,
                    this.legend.textColor,
                    this.data[i].name
                ).attr("font-family", this.legend.textFontFamily)
                    .attr("font-size", this.legend.textFontSize);

                curX += this.legend.dataOffset;            
            }
        },
        drawLines: function() {
            var container = newGroup(                
                this.svg,
                "translate(0,0)",
                this.getCustomId("lines")
            );
            var lines = this.data[0];
            for (var i=0; i<lines.data.length; ++i) {
                var line = lines.data[i];
                console.log(line);
                newLine(
                    container,
                    this.padding.l,
                    this.chart.w - this.padding.r*4,
                    this.axes.y.scale(line.y),
                    this.axes.y.scale(line.y),
                    lines.color,
                    this.line.lineStrokeWidth
                ).attr("stroke-dasharray", this.line.lineWidth+","+this.line.spaceWidth);
                newText(
                    container,
                    this.chart.w - this.padding.r*4 +this.line.textOffsetX,
                    this.axes.y.scale(line.y) + this.line.textOffsetY,
                    lines.color,
                    line.y + this.line.unit
                ).attr("font-size", this.line.textFontSize)
                    .attr("font-family", this.line.textFontFamily);
            }
        },     
        processData: function() {
            var unitWidth = (this.chart.w - this.padding.l - this.padding.r) / this.data[1].data.length;
            var curX = this.padding.l + unitWidth/2;
            for (var i=0; i<this.data[1].data.length; ++i) {
                this.axes.x.domain.push(this.data[1].data[i].x);
                this.axes.x.range.push(curX);
                curX += unitWidth;
            }

            var minY = d3.min(this.data[1].data, function(d) {
                return d.y;
            });
            minY = Math.floor(minY / this.axes.y.unit) * this.axes.y.unit;
            this.axes.y.domain[0] = minY;

        },
        run: function(svgId, data) {
            this.setup(svgId, data);
            this.createGradients();
            this.drawLines();
            this.drawBarcharts();
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

            this.axes.x.axis = d3.axisBottom()
                .scale(this.axes.x.scale);

            this.axes.y.range = [this.chart.h - this.padding.b, this.padding.t];
            this.axes.y.scale = d3.scaleLinear()
                .domain(this.axes.y.domain)
                .range(this.axes.y.range);
        }
    };
};