convexBarchart = (svgId, data) => {
    return {
        getCustomId: null,
        axes: {
            x: {
                axis: null,
                scale: null,
                unitLength: 0,
            },
            y: {
                scale: null,
            },
        },
        data: null,
        params: null,
        svg: null,
        createAxes: function() {
            this.axes.x.unitLength = this.params.chartWidth / (this.data.length + 2);
            var curPos = this.axes.x.unitLength;
            var domain = [];
            var range = [];
            for (var i=0; i<this.data.length; ++i) {
                domain.push(this.data[i].name);
                range.push(curPos);
                curPos += this.axes.x.unitLength;
            }
            this.axes.x.scale = createOrdinalScale(
                domain,
                range
            );

            this.axes.x.axis = d3.axisBottom()
                .scale(this.axes.x.scale)
                .ticks(5);

            this.axes.y.scale = createLinearScale(
                [0, d3.max(this.data, function(d) { return d.value; })],
                [this.params.chartHeight - this.params.paddingBottom, this.params.paddingTop]
            );
        },
        draw: function() {
            this.drawData();
            this.drawLabels();
            this.drawAxes();
        },
        drawAxes: function() {
            var axesGroup = addGroup(this.svg, this.getCustomId("axes"));
            var xAxis = addGroup(axesGroup, "x-axis")
                .attr("transform", "translate(0," + (this.params.chartHeight - this.params.paddingBottom) + ")")
                .call(this.axes.x.axis)                
                .attr("stroke", this.params.axisColor)
                .attr("color", this.params.axisColor)
                .attr("font-size", this.params.axisFontSize)
                .attr("font-family", this.params.axisFontFamily)
                .attr("font-weight", this.params.axisFontWeight);
            xAxis.selectAll("line")
                .attr("visibility", "hidden");
            xAxis.selectAll("path")
                .attr("visibility", "hidden");
            xAxis.selectAll("text")
                .attr("textLength", this.params.axisTextLength)
                .attr("dy", this.params.axisTextOffsetY);
            drawLine(
                xAxis,
                this.params.axisColor,
                this.params.axisWidth,
                0,
                this.params.chartWidth,
                -this.params.axisWidth/2,
                -this.params.axisWidth/2,
            );
        },
        drawData: function() {
            var dataGroup = addGroup(this.svg, this.getCustomId("data"));
            var me = this;
            drawPath(
                dataGroup.selectAll("path").data(this.data).enter(),
                this.params.barColor,
                "none",
                0,
                function(d) {
                    var baseX = me.axes.x.scale(d.name);
                    var baseY = me.axes.y.scale(0);
                    var barW = me.axes.x.unitLength * me.params.barWR;
                    var left = baseX - barW/2;
                    var right = baseX + barW/2;
                    var top = me.axes.y.scale(d.value);
                    var cpY = (top - baseY) * me.params.barCPRY + baseY;
                    var deltaX = barW/2 * me.params.barCPRX;
                    var cpLeft = baseX - deltaX;
                    var cpRight = baseX + deltaX;
                    var d = "M " + left + " " + baseY +
                        " Q " + cpLeft + " " + cpY + " " + baseX + " " + top +
                        " Q " + cpRight + " " + cpY + " " + right + " " + baseY +
                        " z";
                    return d;
                }
            ).on("mouseover", function() {
                dataGroup.selectAll("path")
                    .attr("fill", me.params.barColor);
                d3.select(this)
                    .attr("fill", me.params.barColorSelected);
            });
        },
        drawLabels: function() {
            var labelsGroup = addGroup(this.svg, this.getCustomId("labels"));
            var me = this;
            drawRect(
                labelsGroup.selectAll("rect").data(this.data).enter(),
                this.params.labelRectColor,
                "none",
                0,
                function(d) {
                    var baseX = me.axes.x.scale(d.name);
                    return baseX - me.params.labelRectWidth/2;
                },
                function(d) {
                    var baseY = me.axes.y.scale(d.value);
                    return baseY - me.params.labelRectHeight - me.params.labelRectOffsetY;
                },
                this.params.labelRectWidth,
                this.params.labelRectHeight
            );
            drawText(
                labelsGroup.selectAll("text").data(this.data).enter(),
                this.params.labelColor,
                this.params.labelFontSize,
                this.params.labelFontFamily,
                this.params.labelFontWeight,
                this.params.labelTextLength,
                function(d) {
                    var baseX = me.axes.x.scale(d.name);
                    return baseX - me.params.labelTextLength/2;
                },
                function(d) {
                    var baseY = me.axes.y.scale(d.value);
                    return baseY - me.params.labelTextOffsetY;
                },
                function(d) {
                    return d.value;
                }
            )
        },        
        run: function(svgId, args) {
            this.setup(svgId, args);
            this.draw();
        },
        setup: function(svgId, args) {
            this.data = args.data;
            this.getCustomId = args.getCustomId;
            this.params = args.params;
            this.svg = d3.select("#" + svgId)
                .attr("width", this.params.chartWidth)
                .attr("height", this.params.chartHeight);
            this.createAxes();
        }
    };
}