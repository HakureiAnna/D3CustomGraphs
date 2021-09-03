diamondDistribution = (svgId, data) => {
    return {
        getCustomId: (id) => {
            return "diamondDistribution-" + id;
        },
        axes: {
            xLeft: {
                scale: null,
            },
            xRight: {
                scale: null,
            },
            yBottom: {
                scale: null,
            },
            yTop: {
                scale: null,
            },
        },
        chart: {
            height: 512,
            width: 1024,
        },
        padding: {
            bottom: 40,
            left: 100,
            right: 100,
            top: 40,
        },
        settings: {
            halfLength: 0,
        },
        svg: null,      
        createScales: function() {
            this.axes.xLeft.scale = d3.scaleLinear()
                .domain(this.data.params.domain)
                .range([this.chart.width/2, this.chart.width/2 - this.settings.halfLength]);
            this.axes.xRight.scale = d3.scaleLinear()
                .domain(this.data.params.domain)
                .range([this.chart.width/2, this.chart.width/2 + this.settings.halfLength]);
            this.axes.yTop.scale = d3.scaleLinear()
                .domain(this.data.params.domain)
                .range([this.chart.height/2, this.chart.height/2 - this.settings.halfLength]);
            this.axes.yBottom.scale = d3.scaleLinear()
                .domain(this.data.params.domain)
                .range([this.chart.height/2, this.chart.height/2 + this.settings.halfLength]);
        },
        draw: function() {
            this.drawGrid();
            this.drawData();
            this.drawLabels();
        },
        drawData: function() {
            var dataGroup = addGroup(this.svg, this.getCustomId("data"));
            var d = "";
            var data = this.data.data;
            var coords = [];
            var x, y;
            for (var i=0; i<data.length; ++i) {
                switch (i) {
                    case 0:
                        x = this.axes.xLeft.scale(0);
                        y = this.axes.yTop.scale(data[i].value);
                        d += "M " + x + " " + y;
                        break;
                    case 1:
                        x = this.axes.xRight.scale(data[i].value);
                        y = this.axes.yTop.scale(0);
                        d += " L " + x + " " + y;
                        break;
                    case 2:
                        x = this.axes.xLeft.scale(0);
                        y = this.axes.yBottom.scale(data[i].value);
                        d += " L " + x + " " + y;
                        break;
                    case 3:
                        x = this.axes.xLeft.scale(data[i].value);
                        y = this.axes.yTop.scale(0);
                        d += " L " + x + " " + y;
                        break;
                }              
                coords.push({
                    x: x,
                    y: y,
                });  
            }
            d += " z";
            drawPath(
                dataGroup,
                this.data.params.dataColorFill,
                this.data.params.dataColorStroke,
                this.data.params.dataStrokeWidth,
                d
            );
            drawCircle(
                dataGroup.selectAll("circle").data(coords).enter(),
                this.data.params.dataColorStroke,
                "none",
                0,
                function(d) { return d.x; },
                function(d) { return d.y; },
                this.data.params.dataRadius,
            );
        },
        drawGrid: function() {
            var gridGroup = addGroup(this.svg, this.getCustomId("grid"));

            // horizontal
            drawLine(
                gridGroup,
                this.data.params.lineColorStroke,
                this.data.params.lineStrokeWidth,
                this.axes.xLeft.scale(this.data.params.domain[1]),
                this.axes.xRight.scale(this.data.params.domain[1]),
                this.axes.yTop.scale(0),
                this.axes.yTop.scale(0)
            );

            // vertical
            drawLine(
                gridGroup,
                this.data.params.lineColorStroke,
                this.data.params.lineStrokeWidth,
                this.axes.xLeft.scale(0),
                this.axes.xLeft.scale(0),
                this.axes.yTop.scale(this.data.params.domain[1]),
                this.axes.yBottom.scale(this.data.params.domain[1])
            );
            
            var unitLen = this.data.params.domain[1] / this.data.params.divisions;
            var curPos = unitLen;
            for (var i=0; i<this.data.params.divisions; ++i) {  
                // outer
                var d = "M " + this.axes.xLeft.scale(0) + " " + this.axes.yTop.scale(curPos) + 
                    " L " + this.axes.xRight.scale(curPos)  + " " + this.axes.yTop.scale(0) + 
                    " L " + this.axes.xLeft.scale(0) + " " + this.axes.yBottom.scale(curPos) +
                    " L " + this.axes.xLeft.scale(curPos) + " " + this.axes.yTop.scale(0);
                if (i > 0) {
                    // inner 
                    d += " L " + this.axes.xLeft.scale(0) + " " + this.axes.yTop.scale(curPos) +
                        " M " + this.axes.xLeft.scale(0) + " " + this.axes.yTop.scale(curPos - unitLen) + 
                        " L " + this.axes.xLeft.scale(curPos-unitLen) + " " + this.axes.yTop.scale(0) +
                        " L " + this.axes.xLeft.scale(0) + " " + this.axes.yBottom.scale(curPos-unitLen) +
                        " L " + this.axes.xRight.scale(curPos-unitLen)  + " " + this.axes.yTop.scale(0);
                }
                d += " z";
                drawPath(
                    gridGroup, 
                    (i % 2)? this.data.params.gridColorFill: "none",
                    this.data.params.gridColorStroke,
                    this.data.params.gridStrokeWidth,
                    d
                );
                curPos += unitLen;
            }
        },  
        drawLabels: function() {
            var labelsGroup = addGroup(this.svg, this.getCustomId("labels"));
            var data = this.data.data;
            var me = this;
            drawText(
                labelsGroup.selectAll("text").data(data).enter(),
                this.data.params.textColor,
                this.data.params.fontSize,
                this.data.params.fontFamily,
                this.data.params.fontWeight,
                this.data.params.textLength,
                function(d, i) {
                    switch (i) {
                        case 0:
                        case 2:
                            return me.axes.xLeft.scale(0) - me.data.params.textLength/2;
                        case 1:
                            return me.axes.xLeft.scale(me.data.params.domain[1]) - me.data.params.textOffsetX - me.data.params.textLength;
                        case 3:
                            return me.axes.xRight.scale(me.data.params.domain[1]) + me.data.params.textOffsetX;
                    }
                },
                function(d, i) {
                    switch (i) {
                        case 0:
                            return me.axes.yTop.scale(me.data.params.domain[1]) - me.data.params.textOffsetY;
                        case 2:
                            return me.axes.yBottom.scale(me.data.params.domain[1]) + me.data.params.textOffsetY + me.data.params.fontSize;
                        case 1:
                        case 3:
                            return me.axes.yTop.scale(0) + me.data.params.fontSize/2;
                    }

                },
                function(d) {
                    return d.name;
                }
            );
        },   
        prepareData: function() {
            var h = this.chart.height - this.padding.top - this.padding.bottom;
            var w = this.chart.width - this.padding.left - this.padding.right;
            this.settings.halfLength = (h > w? w: h)/2;
        },
        setup: function(svgId, data) {            
            this.data = data;
            this.svg = d3.select("#" + svgId)
                .attr("width", this.chart.width)
                .attr("height", this.chart.height);

            this.prepareData();
            this.createScales();
        },
        run: function(svgId, data) {
            this.setup(svgId, data);
            this.draw();
        }
    };
}