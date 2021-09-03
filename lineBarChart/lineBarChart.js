var lineBarChart = function () {
    return {
        getCustomId: function (x) {
            return "dailyFlow" + "-" + x;
        },
        axes: {
            x: null,
            xUnit: {
                text: "小时",
                x: 1540,
                y: 25,
            },
            y: null,
            yUnit: {
                text: "(万m³)",
                x: -2,
                y: 32,
            },
            color: "#3cf4f1",
        },
        barchart: {
            barFill: "rgba(60,244,241, 0.2)",
            barSelectedFill: "rgb(250,47,47, 0.2)",
            barWidth: 20,
            dataId: 1,
            lineSelectedStroke: "#fa2f2f",
            lineStroke: "#3cf4f1",
            lineStrokeWidth: 3,
        },
        chart: {
            name: "lineBarChart",
            w: 1560,
            h: 280,
        },
        data: null,
        infoBox: {
            dataPointRadius: 4,
            fill: "rgba(7,63,100, 0.5)",
            h: 78,
            infoBoxOffset: -10,
            lineOffset: 15,
            lineStrokeWidth: 2,
            lineWidth: 20,
            rectOffset: 15,
            rectWidth: 10,
            unitFontSize: 20,
            unitFontFamily: "titleFont",
            unitOffsetX: 105,
            unitOffsetY: 8,
            unitText: "万m³",
            unitTextColor: "#56b8d4",
            valueFontSize: 26,
            valueFontFamily: "cyberpunk",
            valueOffsetX: 40,
            valueOffsetY: 8,
            valueTextColor: "white",
            w: 160,
        },
        legend: {
            dataOffset: 220,
            legendOffsetX: 1100,
            legendOffsetY: 20,
            lineOffset: 10,
            lineStrokeWidth: 4,
            lineWidth: 20,
            rectOffset: 5,
            rectWidth: 10,
            symbolOffset: 5,
            textColor: "#46a6c5",
            textFontSize: 27,
            textFontFamily: "titlefont",
            textOffsetX: 10,
            textOffsetY: 9,
        },
        lines: {
            dataId: 0,
            fill: "none",
            generator: null,
            strokeWidth: 2,
        },
        padding: {
            b: 30,
            l: 70,
            r: 70,
            t: 50,
        },
        scales: {
            x: null,
            y: null,
        },
        svg: null,
        drawAxes: function () {
            var xAxis = newGroup(this.svg, "translate(0," + (this.chart.h - this.padding.b) + ")", id = "", cls = "x axis");
            xAxis.call(this.axes.x);
            newText(xAxis, this.axes.xUnit.x, this.axes.xUnit.y, this.axes.color, this.axes.xUnit.text);
            newLine(xAxis, this.padding.l, this.chart.w, 0, 0, this.axes.color);

            var yAxis = newGroup(this.svg, "translate(" + this.padding.l + ",0)", id = "", cls = "y axis");
            yAxis.call(this.axes.y);
            newText(yAxis, this.axes.yUnit.x, this.axes.yUnit.y, this.axes.color, this.axes.yUnit.text);
        },
        drawBarChart: function () {
            var bars = newGroup(this.svg, "", this.getCustomId("bars"));
            var xScale = this.scales.x;
            var yScale = this.scales.y;
            var chartHeight = this.chart.h;
            var paddingTop = this.padding.t;
            var paddingBottom = this.padding.b;
            var barWidth = this.barchart.barWidth;
            var barSelectedFill = this.barchart.barSelectedFill;
            var lineSelectedStroke = this.barchart.lineSelectedStroke;
            var dataName = this.data[this.barchart.dataId].name;
            var chartName = this.chart.name;
            var barFill = this.barchart.barFill;
            var barWidth = this.barchart.barWidth;
            var lineStroke = this.barchart.lineStroke;
            var lineStrokeWidth = this.barchart.lineStrokeWidth;
            var getCustomId = this.getCustomId;
            var infoBoxWidth = this.infoBox.w;
            var infoBoxHeight = this.infoBox.h;
            var infoBoxOffset = this.infoBox.infoBoxOffset;

            newRect(
                bars.selectAll("rect").data(this.data[this.barchart.dataId].data).enter(),
                function (d) {
                    return xScale(d.x + 1) - barWidth / 2;
                },
                function (d) {
                    return yScale(d.y);
                },
                barWidth,
                function (d) {
                    return chartHeight - yScale(d.y) - paddingBottom;
                },
                this.barchart.barFill,
            );

            newLine(
                bars.selectAll("line").data(this.data[this.barchart.dataId].data).enter(),
                function (d) {
                    return xScale(d.x + 1) - barWidth / 2;
                },
                function (d) {
                    return xScale(d.x + 1) + barWidth / 2;
                },
                function (d) {
                    return yScale(d.y) - lineStrokeWidth / 2;
                },
                function (d) {
                    return yScale(d.y) - lineStrokeWidth / 2;
                },
                this.barchart.lineStroke,
                lineStrokeWidth,
                function (d) {
                    return chartName + dataName + d.x;
                },
            ).style("pointer-events", "none");

        },
        drawInfoBox: function () {
            var infoBoxGroup = newGroup(
                this.svg,
                "translate(" + this.chart.w / 2 + "," + this.chart.h / 2 + ")",
                this.getCustomId("infoBox")
            );

            newRect(infoBoxGroup, 0, 0, this.infoBox.w, this.infoBox.h, this.infoBox.fill);

            var h13 = this.infoBox.h / 3;
            var h23 = this.infoBox.h * 2 / 3;

            // data[0]
            newLine(
                infoBoxGroup,
                this.infoBox.lineOffset,
                this.infoBox.lineOffset + this.infoBox.lineWidth,
                h13 - this.infoBox.lineStrokeWidth / 2,
                h13 - this.infoBox.lineStrokeWidth / 2,
                this.data[0].color,
                this.infoBox.lineStrokeWidth
            );
            newText(
                infoBoxGroup,
                this.infoBox.valueOffsetX,
                h13 + this.infoBox.valueOffsetY,
                this.infoBox.valueTextColor,
                100,
                this.getCustomId("infoBox-Value-0")
            ).attr("font-size", this.infoBox.valueFontSize)
                .attr("font-family", this.infoBox.valueFontFamily);
            newText(
                infoBoxGroup,
                this.infoBox.unitOffsetX,
                h13 + this.infoBox.valueOffsetY,
                this.infoBox.unitTextColor,
                this.infoBox.unitText
            ).attr("font-size", this.infoBox.unitFontSize)
                .attr("font-family", this.infoBox.unitFontFamily);

            // data[1]
            newRect(
                infoBoxGroup,
                this.infoBox.rectOffset,
                h23 - this.infoBox.rectWidth / 2,
                this.infoBox.rectWidth,
                this.infoBox.rectWidth,
                this.data[1].color
            );
            newText(
                infoBoxGroup,
                this.infoBox.valueOffsetX,
                h23 + this.infoBox.valueOffsetY,
                this.infoBox.valueTextColor,
                100,
                this.getCustomId("infoBox-Value-1")
            ).attr("font-size", this.infoBox.valueFontSize)
                .attr("font-family", this.infoBox.valueFontFamily);
            newText(
                infoBoxGroup,
                this.infoBox.unitOffsetX,
                h23 + this.infoBox.valueOffsetY,
                this.infoBox.unitTextColor,
                this.infoBox.unitText
            ).attr("font-size", this.infoBox.unitFontSize)
                .attr("font-family", this.infoBox.unitFontFamily);

            // selected data point
            newCircle(infoBoxGroup, this.infoBox.w / 2, 0, this.infoBox.dataPointRadius, this.getCustomId("selected-point"))
                .attr("fill", this.data[0].color);
        },
        drawLegend: function () {
            var legend = newGroup(this.svg, "translate(" + this.legend.legendOffsetX + "," + this.legend.legendOffsetY + ")", this.getCustomId("legend"));

            var x = 0;
            var y = 0;
            // data[0]
            x += this.legend.lineOffset;
            newLine(
                legend,
                x,
                x + this.legend.lineWidth,
                0,
                0,
                this.data[0].color,
                this.legend.lineStrokeWidth
            );
            x += this.legend.lineWidth + this.legend.textOffsetX;
            newText(
                legend,
                x,
                this.legend.textOffsetY,
                this.legend.textColor,
                this.data[0].name
            ).attr("font-size", this.legend.textFontSize)
                .attr("font-family", this.legend.textFontFamily);
            x += this.legend.dataOffset;

            // data[1]
            newRect(
                legend,
                x,
                (this.legend.lineStrokeWidth - this.legend.rectWidth) / 2,
                this.legend.rectWidth,
                this.legend.rectWidth,
                this.data[1].color
            );
            x += this.legend.rectWidth + this.legend.textOffsetX;
            newText(
                legend,
                x,
                this.legend.textOffsetY,
                this.legend.textColor,
                this.data[1].name
            ).attr("font-size", this.legend.textFontSize)
                .attr("font-family", this.legend.textFontFamily);
        },
        drawLine: function () {
            var lines = newGroup(this.svg, "", this.getCustomId("lines"));
            var path = newPath(lines, this.lines.fill, this.data[this.lines.dataId].color, this.lines.strokeWidth, this.lines.generator(this.data[this.lines.dataId].data));
        },
        drawSelectArea: function () {
            // draw rects over each x-unit
            // attach mouseover event
            // get rect & line in region
            var xScale = this.scales.x;
            var areaWidth = xScale(1) - xScale(0);
            var svg = this.svg;
            var getCustomId = this.getCustomId;
            var barSelectedFill = this.barchart.barSelectedFill;
            var barFill = this.barchart.barFill;
            var yScale = this.scales.y;
            var lineSelectedStroke = this.barchart.lineSelectedStroke;
            var lineStroke = this.barchart.lineStroke;
            var lineData = this.data[0].data;
            var infoBoxWidth = this.infoBox.w;
            var infoBoxHeight = this.infoBox.h;
            var barWidth = this.barchart.barWidth;
            var infoBoxOffset = this.infoBox.infoBoxOffset;

            var selectAreas = newGroup(this.svg, "", this.getCustomId("selectAreas"));
            newRect(
                selectAreas.selectAll("rect").data(this.data[1].data).enter(),
                function (d) {
                    return xScale(d.x + 0.5);
                },
                this.scales.y.range()[1],
                areaWidth,
                this.scales.y.range()[0] - this.scales.y.range()[1],
                "rgba(1,1,1,0)"
            ).on("mouseover", function () {
                var me = d3.select(this);
                var xLowerBound = parseFloat(me.attr("x"));
                var xUpperBound = xLowerBound + parseFloat(me.attr("width"));
                var maxY = 0;
                var pointX = 0;
                var pointY = 0;
                var xId = 0;

                svg.select("#" + getCustomId("bars"))
                    .selectAll("rect")
                    .attr("fill", function (d) {
                        var xVal = xScale(d.x + 1);
                        if (xVal > xLowerBound && xVal < xUpperBound) {
                            pointX = xVal;
                            xId = d.x + 1;
                            maxY = yScale(d.y);
                            return barSelectedFill;
                        }
                        return barFill;
                    }
                    );
                svg.select("#" + getCustomId("bars"))
                    .selectAll("line")
                    .attr("stroke", function (d) {
                        var xVal = xScale(d.x + 1);
                        if (xVal > xLowerBound && xVal < xUpperBound) {
                            return lineSelectedStroke;
                        }
                        return lineStroke;
                    });

                pointY = yScale(lineData[xId].y);
                if (pointY < maxY)
                    maxY = pointY;

                var diffY = maxY - infoBoxHeight - infoBoxOffset;

                var infoBox = d3.select("#" + getCustomId("infoBox"));
                infoBox.attr("transform", "translate(" +
                    (pointX - infoBoxWidth / 2) + "," + diffY + ")");

                infoBox.select("#" + getCustomId("selected-point"))
                    .attr("cy", pointY - diffY);

                infoBox.select("#" + getCustomId("infoBox-Value-0")).text(data[0].data[xId].y);
                infoBox.select("#" + getCustomId("infoBox-Value-1")).text(data[1].data[xId-1].y);
            });
        },
        run: function (svgId, data) {
            this.setup(svgId, data);
            this.drawBarChart();
            this.drawLine();
            this.drawLegend();
            this.drawInfoBox();
            this.drawSelectArea();
            this.drawAxes();
        },
        setup: function (svgId, data) {
            this.svg = d3.select("#" + svgId);
            this.data = data;
            tempData = [{ x: 0, y: 0 }];
            for (var i = 0; i < data[0].data.length; ++i) {
                tempData.push(data[0].data[i]);
            }
            this.data[0].data = tempData;
            
            initializeSvg(this.svg, this.chart.w, this.chart.h);

            this.scales.x = d3.scaleLinear()
                .domain([0, getMax(this.data, "x")])
                .range([this.padding.l, this.chart.w - this.padding.r]);

            this.scales.y = d3.scaleLinear()
                .domain([0, getMax(this.data, "y")])
                .range([this.chart.h - this.padding.b, this.padding.t]);

            this.axes.x = d3.axisBottom()
                .scale(this.scales.x)
                .ticks(this.data[0].data.length / 2 + 1);

            this.axes.y = d3.axisLeft()
                .scale(this.scales.y)
                .ticks(6);

            var xScale = this.scales.x;
            var yScale = this.scales.y;
            this.lines.generator = d3.line()
                .x(function (d) {
                    return xScale(d.x);
                })
                .y(function (d) {
                    return yScale(d.y);
                });
        }
    };
};