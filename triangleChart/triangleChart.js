triangleChart = (svgId, data) => {
    return {
        getCustomId: (id) => {
            return "triangleChart-" + id;
        },
        axes: {
            x: {
                base: 1/2,
                color: "#8e9195",                
                scale: null,
                unit: 5000,
                width: 2,
                offset: 0,
            },
            y: {
                color: "#8e9195",       
                height: 0,
                width: 2,
                totalUnits: 7,
            },            
        },
        chart: {                
            width: 1024,        
            height: 512,
        },
        circle: {
            color: "white",
            radius: 5,
        },
        common: {
            baseY: 0,
            pointBase0: {
                x: 0,
                y: 0,
            },
            pointBase1: {
                x: 0,
                y: 0,
            },
        },
        dashedLine: {
            color: "white",
            pattern: [6,4],
            width: 1,
            y0: 0,
            y1: 0,
            topUnits: 0.9,
            bottomUnits: 6.1,
        },
        gradients: [
            {
                id: "triangleGradient",
                type: GRADIENT_LINEAR,
                x1:0,
                x2:0,
                y1:0,
                y2:1,
                stops: [
                    {
                        offset: 0,
                        stopColor: "#70d1fb",
                        stopOpacity: 0.75,
                    },
                    {
                        offset: 50,
                        stopColor: "#70d1fb",
                        stopOpacity: 0.25,
                    },
                    {
                        offset: 100,
                        stopColor: "#70d1fb",
                        stopOpacity: 0.95,
                    },
                ]
            }
        ],
        padding: {
            bottom: 20,
            left: 20,
            right: 20,
            top: 20,
        },
        title: {
            color: "white",
            fontFamily: "sans-serif",
            fontSize: 12,
            fontWeight: "bold",
            offsetY: -3,
            rectColor: "#5c99b4",
            rectHeight: 30,
            rectRadius: 4,
            rectWidth: 90,
            rectYOffset: 5,
            textLength: 70,
        },
        triangle: {
            color: "#70d1fb",
            width: 2,
            topUnits: 1,
            bottomUnits: 6,
        },
        valueText: {
            color: "#70d1fb",
            fontFamily: "sans-serif",
            fontSize: 12,
            fontWeight: "normal",
            offsetY: 30,
            subColor: "#5c99b4",
            subFontFamily: "sans-serif",
            subFontSize: 10,
            subFontWeight: "normal",
            textLength: 80,
        },
        createGradients: function() {
            addDefs(this.svg);
            var gradients = this.gradients;
            for (var i=0; i<gradients.length; ++i){
                var gradient = gradients[i];
                switch (gradient.type) {
                    case GRADIENT_LINEAR:
                        addLinearGradient(
                            gradient.x1,
                            gradient.x2,
                            gradient.y1,
                            gradient.y2,
                            gradient.stops,
                            this.getCustomId(gradient.id)
                        );
                        break;
                }
            }
        },
        createScales: function() {
            this.axes.x.scale = createPowScale(
                this.axes.x.base,
                [
                    0, 
                    scaleToUnit(d3.max(this.data, function(d) { return d.data[0].x; }), this.axes.x.unit)
                ],
                [
                    this.padding.left, 
                    this.chart.width - this.padding.right
                ]
            );

            this.axes.y.height = this.chart.height - this.padding.top - this.padding.bottom;
            
            this.common.pointBase0.x = this.axes.x.scale(this.axes.x.offset);
            this.common.pointBase1.x = this.axes.x.scale(this.axes.x.offset);
        },
        draw: function() {
            this.drawAxes();
            this.drawData();
        },
        drawAxes: function() {
            var axes = addGroup(
                this.svg, 
                this.getCustomId("axes"));
            drawLine(
                axes, 
                this.axes.y.color, 
                this.axes.y.width, 
                this.axes.x.scale(this.axes.x.offset), 
                this.axes.x.scale(this.axes.x.offset), 
                this.padding.top, 
                this.chart.height - this.padding.bottom
            );
            drawLine(
                axes,
                this.axes.x.color,
                this.axes.x.width,
                this.axes.x.scale.range()[0],
                this.axes.x.scale.range()[1],
                this.chart.height/2,
                this.chart.height/2
            );
        },
        drawData: function() {
            var dataGroup = addGroup(this.svg, this.getCustomId("data"));
            var triangles = addGroup(dataGroup, this.getCustomId("triangles"));
            var dataset = [];
            for (var i=0; i<this.data.length; ++i) {
                var data = [this.common.pointBase0, this.common.pointBase1];
                data.push({
                    x: this.axes.x.scale(this.data[i].data[0].x),
                    y: this.common.baseY
                });
                dataset.push(data);
            }
            drawPolygon(
                triangles.selectAll("polygon").data(dataset).enter(),
                "url(#" + this.getCustomId(this.gradients[0].id) + ")",
                this.triangle.color,
                this.triangle.width,
                function(d) { return formatPolygonPoints(d); }
            );

            var dashedLines = addGroup(dataGroup, this.getCustomId("dashedLines"));
            var xScale = this.axes.x.scale;
            drawDashedLine(
                dashedLines.selectAll("line").data(this.data).enter(),
                this.dashedLine.color,
                this.dashedLine.width,
                function(d) { return xScale(d.data[0].x); },
                function(d) { return xScale(d.data[0].x); },
                this.dashedLine.y0,
                this.dashedLine.y1,
                this.dashedLine.pattern
            );

            var circles = addGroup(dataGroup, this.getCustomId("circles"));
            drawCircle(
                circles.selectAll("circle").data(this.data).enter(),
                this.circle.color,
                "none",
                0,
                function(d) {
                    return xScale(d.data[0].x);
                },
                this.common.baseY,
                this.circle.radius
            );

            var titles = addGroup(dataGroup, this.getCustomId("titles"));
            var rectW = this.title.rectWidth;
            drawRoundedRect(
                titles.selectAll("rect").data(this.data).enter(),
                this.title.rectColor,
                "none",
                0,
                function(d) {
                    return xScale(d.data[0].x) - rectW/2;
                },
                this.dashedLine.y0 - this.title.rectHeight - this.title.rectYOffset,
                rectW,
                this.title.rectHeight,
                this.title.rectRadius,
                this.title.rectRadius
            );
            var textLen = this.title.textLength;
            drawText(
                titles.selectAll("text").data(this.data).enter(),
                this.title.color,
                this.title.fontFamily,
                this.title.fontSize,
                this.title.fontWeight,
                this.title.textLength,
                function(d) {
                    return xScale(d.data[0].x) - textLen/2; 
                },
                this.dashedLine.y0 - this.title.fontSize + this.title.offsetY,
                function(d) {
                    return d.name;
                }
            );

            var values = addGroup(dataGroup, this.getCustomId("values"));
            var valueTextLen = this.valueText.textLength;
            var xOffset = this.axes.x.offset;
            drawText(
                values.selectAll("text").data(this.data).enter(),
                this.valueText.color,
                this.valueText.fontFamily,
                this.valueText.fontSize,
                this.valueText.fontWeight,
                this.title.textLength,
                function(d) {
                    return xScale(d.data[0].x) - valueTextLen/2;
                },
                this.dashedLine.y1 - this.valueText.fontSize + this.valueText.offsetY,
                function(d) {
                    return d.data[0].x - xOffset;
                },
                [{
                    color: this.valueText.subColor,
                    fontFamily: this.valueText.subFontFamily,
                    fontSize: this.valueText.subFontSize,
                    fontWeight: this.valueText.subFontWeight,
                    text: "t",
                    id: "",
                    cls: "",
                }]
            );
        },
        prepareData: function() {
            this.axes.x.offset = Math.abs(scaleToUnit(d3.min(this.data, function(d) { return d.data[0].x; }), this.axes.x.unit));
            for (var i=0; i<this.data.length-1; ++i) {
                this.data[i].data[0].x += this.axes.x.offset;
            }

            var drawingAreaH = this.chart.height - this.padding.top - this.padding.bottom;
            this.common.baseY = this.padding.top +  drawingAreaH/2;
            this.common.pointBase0.y = this.padding.top + drawingAreaH * this.triangle.topUnits / this.axes.y.totalUnits;
            this.common.pointBase1.y = this.padding.top + drawingAreaH * this.triangle.bottomUnits / this.axes.y.totalUnits;

            this.dashedLine.y0 = this.padding.top + drawingAreaH * this.dashedLine.topUnits / this.axes.y.totalUnits;
            this.dashedLine.y1 = this.padding.top + drawingAreaH * this.dashedLine.bottomUnits / this.axes.y.totalUnits;
        },
        run: function(svgId, data) {
            this.setup(svgId, data);
            this.draw();
        },
        setup: function(svgId, data) {
            this.svg = d3.select("#" + svgId)
                .attr("width", this.chart.width)
                .attr("height", this.chart.height);

            this.data = data;

            this.prepareData();

            this.createScales();

            this.createGradients();
        },
    };
}