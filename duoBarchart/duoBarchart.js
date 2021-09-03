duoBarchart = (svgId, data) => {
    return {
        getCustomId: (id) => {
            return "duoBarchart-" + id;
        },
        axes: {
            xLeft: {
                scale: null,
                unit: 10000,
                limit: 0,
            },
            xRight: {
                scale: null,
                unit: 10000,
            },
            y: {
                scale: null,
            },
        },
        bar: {
            colorLeft: "#a7ed7c",
            colorRight: "#80d2f2",
            lineWidth: 2,
            offsetY: 7,
            width: 18,
        },
        chart: {
            height: 512,
            width: 1024,
        },
        currentId: 0,
        dataText: {
            colorLeft: "#a7ed7c",
            colorRight: "#80d2f2",
            fontFamily: "sans-serif",
            fontSize: 18,
            fontWeight: "bold",
            offsetX: 60,
            offsetY: -20,
            textLength: 40,
        },
        dateText: {
            color: "white",
            fontFamily: "sans-serif",
            fontSize: 12,
            fontWeight: "normal",
            format: "%m-%d",
            textLength: 40,
            textOffsetX: 10,
        },
        gradients: [
            {
                id: "barLeftGradient",
                type: GRADIENT_LINEAR,
                x1: 0,
                x2: 1,
                y1: 0,
                y2: 0,
                stops: [
                    {
                        offset: 0,
                        stopColor: "#a7ed7c",
                        stopOpacity: 0.4,
                    },
                    {
                        offset: 100,
                        stopColor: "#a7ed7c",
                        stopOpacity: 0,
                    }
                ]
            },
            {
                id: "barRightGradient",
                type: GRADIENT_LINEAR,
                x1: 0,
                x2: 1,
                y1: 0,
                y2: 0,
                stops: [
                    {
                        offset: 0,
                        stopColor: "#80d2f2",
                        stopOpacity: 0,
                    },
                    {
                        offset: 100,
                        stopColor: "#80d2f2",
                        stopOpacity: 0.5,  
                    }
                ],
            },
            {
                id: "selectGradient",
                type: GRADIENT_LINEAR,
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 1,
                stops: [
                    {
                        offset: 0,
                        stopColor: "#80d2f2",
                        stopOpacity: 0,
                    },
                    {
                        offset: 100,
                        stopColor: "#80d2f2",
                        stopOpacity: 0.4,  
                    }
                ],
            },
        ],
        padding: {
            bottom: 20,
            left: 20,
            right: 20,
            top: 100,
        },
        parsers: {
            inputDate: null,
            outputDate: null,
        },
        svg: null,
        transitions: {
            delayUnit: 100,
        },
        typeText: {
            color: "#80d2f2",
            fontFamily: "sans-serif",
            fontSize: 15,
            fontWeight: "normal",
            lineWidth: 2,
            offsetX: 0,
            offsetY: 10,        
            rectHeight: 30,
            rectWidth: 80,
            textLength: 60,
            textOffsetX: 0,
            textOffsetY: 0,
        },
        unitText: {
            color: "#80d2f2",
            fontFamily: "sans-serif",
            fontSize: 15,
            fontWeight: "normal",
            textLength: 80,
            offsetX: 20,
            offsetY: 50,
        },
        valueBox: {
            leftColor:"#a7ed7c",
            leftRectColor: "rgba(167,237,124,0.25)",
            fontFamily: "sans-serif",
            fontWeight: "normal",
            fontSize: 12,
            rectHeight: 30,
            rectOffsetY: 12,
            rectWidth: 80,
            rightColor:"#80d2f2",
            rightRectColor: "rgba(128,210,242,0.25)",
            textLength: 40,
            textOffsetX: 10,
            textOffsetY: 4,
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
        createScales: function(max) {
            var step = (this.chart.height - this.padding.top - this.padding.bottom)/(this.data.data.length - 1);
            var curPos = this.padding.top;
            var range = [];
            for (var i=0; i<this.data.data.length; ++i) {
                range.push(curPos);
                curPos += step;
            }

            this.axes.y.scale = createOrdinalScale(
                d3.range(this.data.data.length),
                range,
            );

            this.axes.xLeft.limit = (this.chart.width - this.padding.left - this.padding.right - this.valueBox.rectWidth * 2 - this.dateText.textOffsetX * 2 - this.dateText.textLength)/2;
            this.axes.xLeft.scale = createLinearScale(
                [0, max],
                [this.padding.left + this.valueBox.rectWidth + this.axes.xLeft.limit, this.padding.left + this.valueBox.rectWidth]
            );
            this.axes.xRight.scale = createLinearScale(
                [0, max],
                [this.padding.left + this.valueBox.rectWidth + this.axes.xLeft.limit + this.dateText.textLength + this.dateText.textOffsetX * 2, this.padding.left + this.valueBox.rectWidth + this.axes.xLeft.limit*2 + this.dateText.textLength + this.dateText.textOffsetX *2]
            );
        },
        draw: function() {
            this.drawData();
            this.drawLabels();
            this.drawInteractive();
        },
        drawData: function() {
            var dataGroup = addGroup(this.svg, this.getCustomId("data"));

            var dateGroup = addGroup(dataGroup, this.getCustomId("dateText"));
            var parse = this.parsers.outputDate;
            var yScale = this.axes.y.scale;
            drawText(
                dateGroup.selectAll("text").data(this.data.data).enter(),
                this.dateText.color,
                this.dateText.fontSize,
                this.dateText.fontFamily,
                this.dateText.fontWeight,
                this.dateText.textLength,
                this.axes.xLeft.scale.range()[0] + this.dateText.textOffsetX,
                function(d, i) {
                    return yScale(i);
                },
                function(d) {
                    return parse(d.date);
                }
            );

            var leftGroup = addGroup(dataGroup, this.getCustomId("left"));

            var leftValueBoxes = addGroup(leftGroup, this.getCustomId("left-valueBoxes"));
            var rectOffsetY = -this.valueBox.rectHeight + this.valueBox.rectOffsetY;
            drawRect(
                leftValueBoxes.selectAll("rect").data(this.data.data).enter(),
                this.valueBox.leftRectColor,
                "none",
                0,
                this.padding.left,
                function(d, i) {
                    return yScale(i) + rectOffsetY;
                },
                this.valueBox.rectWidth,
                this.valueBox.rectHeight
            );
            var currentId = this.currentId;
            var textOffsetX = this.valueBox.textOffsetX;
            var textOffsetY = this.valueBox.textOffsetY;
            drawText(
                leftValueBoxes.selectAll("text").data(this.data.data).enter(),
                this.valueBox.leftColor,
                this.valueBox.fontSize,
                this.valueBox.fontFamily,
                this.valueBox.fontWeight,
                this.valueBox.textLength,
                this.padding.left + this.valueBox.textOffsetX,
                function(d, i) {
                    return yScale(i) + textOffsetY;
                },
                function(d) {
                    return d.data[currentId].production;
                }
            );

            var leftBars = addGroup(leftGroup, this.getCustomId("left-bars"));
            var xLeftScale = this.axes.xLeft.scale;
            var barWidth = this.bar.width;
            var barOffsetY = this.bar.offsetY;
            var lineWidth = this.bar.lineWidth;
            drawRect(
                leftBars.selectAll("rect").data(this.data.data).enter(),
                "url(#" + this.getCustomId(this.gradients[0].id) + ")",
                "none",
                0,
                function(d) {
                    return xLeftScale(d.data[currentId].production);
                },
                function(d, i) {
                    return yScale(i) - barWidth + barOffsetY;
                },
                function(d) {
                    return xLeftScale(0) - xLeftScale(d.data[currentId].production);
                },
                this.bar.width,
            );
            drawLine(
                leftBars.selectAll("line").data(this.data.data).enter(),
                this.bar.colorLeft,
                lineWidth,
                function(d) {
                    return xLeftScale(d.data[currentId].production) - lineWidth/2;
                },
                function(d) {
                    return xLeftScale(d.data[currentId].production) - lineWidth/2;
                },
                function(d, i) {
                    return yScale(i) - barWidth + barOffsetY;
                },
                function(d, i) {
                    return yScale(i) + barOffsetY;
                }
            );

            var rightGroup = addGroup(dataGroup, this.getCustomId("right"));

            var rightValueBoxes = addGroup(rightGroup, this.getCustomId("right-valueBoxes"));
            drawRect(
                rightValueBoxes.selectAll("rect").data(this.data.data).enter(),
                this.valueBox.rightRectColor,
                "none",
                0,
                this.padding.left + this.valueBox.rectWidth + this.axes.xLeft.limit * 2 + this.dateText.textLength + this.dateText.textOffsetX*2,
                function(d, i) {
                    return yScale(i) + rectOffsetY;
                },
                this.valueBox.rectWidth,
                this.valueBox.rectHeight,
            );            
            drawText(
                rightValueBoxes.selectAll("text").data(this.data.data).enter(),
                this.valueBox.rightColor,
                this.valueBox.fontSize,
                this.valueBox.fontFamily,
                this.valueBox.fontWeight,
                this.valueBox.textLength,
                this.padding.left + this.valueBox.rectWidth + this.axes.xLeft.limit * 2 + this.dateText.textOffsetX * 2 + this.dateText.textLength + this.valueBox.textOffsetX,
                function(d, i) {
                    return yScale(i) + textOffsetY;
                },
                function(d) {
                    return d.data[currentId].consumption;
                }
            );

            var rightBars = addGroup(rightGroup, this.getCustomId("right-bars"));
            var xRightScale = this.axes.xRight.scale;
            drawRect(
                rightBars.selectAll("rect").data(this.data.data).enter(),
                "url(#" + this.getCustomId(this.gradients[1].id) + ")",
                "none",
                0,
                function(d) {
                    return xRightScale(0);
                },
                function(d, i) {
                    return yScale(i) - barWidth + barOffsetY;
                },
                function(d) {
                    return xRightScale(d.data[currentId].consumption) -  xRightScale(0);
                },
                this.bar.width,
            );
            drawLine(
                rightBars.selectAll("line").data(this.data.data).enter(),
                this.bar.colorRight,
                lineWidth,
                function(d) {
                    return xRightScale(d.data[currentId].consumption) - lineWidth/2;
                },
                function(d) {
                    return xRightScale(d.data[currentId].consumption) - lineWidth/2;
                },
                function(d, i) {
                    return yScale(i) - barWidth + barOffsetY;
                },
                function(d, i) {
                    return yScale(i) + barOffsetY;
                }
            );

        },
        drawInteractive: function() {
            var interactiveGroup = addGroup(this.svg, this.getCustomId("interactive"));

            // background
            drawRect(
                interactiveGroup,
                "url(#" + this.getCustomId(this.gradients[2].id) + ")",
                "none",
                0,
                this.typeText.offsetX,
                this.typeText.offsetY,
                this.typeText.rectWidth,
                this.typeText.rectHeight,
                this.getCustomId("bg" + this.data.params.ID_POWER)
            ).style("visibility", "visible");
            drawLine(
                interactiveGroup,
                this.typeText.color,
                this.typeText.lineWidth,
                this.typeText.offsetX,
                this.typeText.offsetX + this.typeText.rectWidth,
                this.typeText.offsetY + this.typeText.rectHeight - this.typeText.lineWidth/2,
                this.typeText.offsetY + this.typeText.rectHeight - this.typeText.lineWidth/2,
                this.getCustomId("ln" + this.data.params.ID_POWER)
            ).style("visibility", "visible");
            drawRect(
                interactiveGroup,
                "url(#" + this.getCustomId(this.gradients[2].id) + ")",
                "none",
                0,
                this.typeText.offsetX + this.typeText.rectWidth,
                this.typeText.offsetY,
                this.typeText.rectWidth,
                this.typeText.rectHeight,
                this.getCustomId("bg" + this.data.params.ID_GAS)
            ).style("visibility", "hidden");
            drawLine(
                interactiveGroup,
                this.typeText.color,
                this.typeText.lineWidth,
                this.typeText.offsetX + this.typeText.rectWidth,
                this.typeText.offsetX + this.typeText.rectWidth * 2,
                this.typeText.offsetY + this.typeText.rectHeight - this.typeText.lineWidth/2,
                this.typeText.offsetY + this.typeText.rectHeight - this.typeText.lineWidth/2,
                this.getCustomId("ln" + this.data.params.ID_GAS)
            ).style("visibility", "hidden");

            // text
            drawText(
                interactiveGroup,
                this.typeText.color,
                this.typeText.fontSize,
                this.typeText.fontFamily,
                this.typeText.fontWeight,
                this.typeText.textLength,
                this.typeText.offsetX + this.typeText.textOffsetX,
                this.typeText.offsetY + this.typeText.textOffsetY,
                this.data.params.types[0]
            );
            drawText(
                interactiveGroup,
                this.typeText.color,
                this.typeText.fontSize,
                this.typeText.fontFamily,
                this.typeText.fontWeight,
                this.typeText.textLength,
                this.typeText.offsetX + this.typeText.rectWidth + this.typeText.textOffsetX,
                this.typeText.offsetY + this.typeText.textOffsetY,
                this.data.params.types[1]
            );

            var me = this;

            var switcher = function() {                
                var id = +d3.select(this).attr("value");
                var otherId = id? 0: 1;
                interactiveGroup.select("#" + me.getCustomId("bg" + otherId)).style("visibility", "hidden");
                interactiveGroup.select("#" + me.getCustomId("ln" + otherId)).style("visibility", "hidden");
                interactiveGroup.select("#" + me.getCustomId("bg" + id)).style("visibility", "visible");
                interactiveGroup.select("#" + me.getCustomId("ln" + id)).style("visibility", "visible");

                me.currentId = id;

                var unit = me.svg.select("#" + me.getCustomId("unitText"));
                unit.text(me.data.params.units[me.currentId]);

                var leftGroup = me.svg.select("#" + me.getCustomId("left"));
                var leftValueBoxes = leftGroup.select("#" + me.getCustomId("left-valueBoxes"));
                leftValueBoxes.selectAll("text")
                    .text(function(d) {
                        return d.data[me.currentId].production;
                    });
                var leftBars = leftGroup.select("#" + me.getCustomId("left-bars"));
                leftBars.selectAll("rect")
                    .transition()
                    .delay(function(d, i) {
                        return i * me.transitions.delayUnit;
                    })
                    .attr("x", function(d) {
                        return me.axes.xLeft.scale(d.data[me.currentId].production);
                    })
                    .attr("width", function(d) {
                        return me.axes.xLeft.scale(0) - me.axes.xLeft.scale(d.data[me.currentId].production);
                    });
                leftBars.selectAll("line")
                    .transition()
                    .delay(function(d, i) {
                        return i * me.transitions.delayUnit;
                    })
                    .attr("x1", function(d) {
                        return me.axes.xLeft.scale(d.data[me.currentId].production) - me.bar.lineWidth/2;
                    })
                    .attr("x2", function(d) {
                        return me.axes.xLeft.scale(d.data[me.currentId].production) - me.bar.lineWidth/2;
                    });
                


                var rightGroup = me.svg.select("#" + me.getCustomId("right"));
                var rightValueBoxes = rightGroup.select("#" + me.getCustomId("right-valueBoxes"));
                rightValueBoxes.selectAll("text")
                    .text(function(d) {
                        return d.data[me.currentId].consumption;
                    });
                var rightBars = rightGroup.select("#" + me.getCustomId("right-bars"));
                rightBars.selectAll("rect")
                    .transition()
                    .delay(function(d, i) {
                        return i * me.transitions.delayUnit;
                    })
                    .attr("x", function(d) {
                        return me.axes.xRight.scale(0);
                    })
                    .attr("width", function(d) {
                        return me.axes.xRight.scale(d.data[me.currentId].consumption) - me.axes.xRight.scale(0);
                    });
                rightBars.selectAll("line")
                    .transition()
                    .delay(function(d, i) {
                        return i * me.transitions.delayUnit;
                    })
                    .attr("x1", function(d) {
                        return me.axes.xRight.scale(d.data[me.currentId].consumption) - me.bar.lineWidth/2;
                    })
                    .attr("x2", function(d) {
                        return me.axes.xRight.scale(d.data[me.currentId].consumption) - me.bar.lineWidth/2;
                    });

                d3.select("#" + me.getCustomId("label-left"))
                    .text(me.data.params.data[me.currentId][0]);
                d3.select("#" + me.getCustomId("label-right"))
                    .text(me.data.params.data[me.currentId][1]);
            };
            // selection area
            drawRect(
                interactiveGroup,
                "rgba(0,0,0,0)",
                "none",
                0,
                this.typeText.offsetX,
                this.typeText.offsetY,
                this.typeText.rectWidth,
                this.typeText.rectHeight,
            ).attr("value", this.data.params.ID_POWER)
                .on("mouseover", switcher);
            drawRect(
                interactiveGroup,
                "rgba(0,0,0,0)",
                "none",
                0,
                this.typeText.offsetX + this.typeText.rectWidth,
                this.typeText.offsetY,
                this.typeText.rectWidth,
                this.typeText.rectHeight,
            ).attr("value", this.data.params.ID_GAS)
                .on("mouseover", switcher);

        },
        drawLabels: function() {
            var labels = addGroup(this.svg, this.getCustomId("labels"));

            drawText(
                labels,
                this.dataText.colorLeft,
                this.dataText.fontSize,
                this.dataText.fontFamily,
                this.dataText.fontWeight,
                this.dataText.textLength,
                this.padding.left + this.valueBox.rectWidth + this.axes.xLeft.limit - this.dataText.offsetX,
                this.axes.y.scale(0) +  this.dataText.offsetY,
                this.data.params.data[this.currentId][0],
                [],
                this.getCustomId("label-left")

            );
            
            drawText(
                labels,
                this.dataText.colorRight,
                this.dataText.fontSize,
                this.dataText.fontFamily,
                this.dataText.fontWeight,
                this.dataText.textLength,
                this.padding.left + this.valueBox.rectWidth + this.axes.xLeft.limit + this.dateText.textLength + this.dateText.textOffsetX * 2 + this.dataText.offsetX - this.dataText.textLength,
                this.axes.y.scale(0) +  this.dataText.offsetY,
                this.data.params.data[this.currentId][1],
                [],
                this.getCustomId("label-right")
            );

            var unitText = this.unitText;
            var currId = this.currentId;
            drawText(
                labels,
                unitText.color,
                unitText.fontSize,
                unitText.fontFamily,
                unitText.fontWeight,
                unitText.textLength,
                this.unitText.offsetX,
                this.unitText.offsetY,
                this.data.params.unitText,
                [
                    {
                        color: unitText.color,
                        fontSize: unitText.fontSize,
                        fontFamily: unitText.fontFamily,
                        fontWeight: unitText.fontWeight,
                        text: this.data.params.units[currId],
                        id: this.getCustomId("unitText")
                    }
                ]
            );
        },
        prepareData: function() {
            this.currentId = this.data.params.ID_POWER;
            this.valueBox.textOffsetX = (this.valueBox.rectWidth - this.valueBox.textLength)/2;
            this.valueBox.textOffsetY = -(this.valueBox.rectHeight/3) + this.valueBox.fontSize;
            this.dataText.offsetX += this.dataText.textLength;
            this.dataText.offsetY += -this.dataText.fontSize;
            this.typeText.offsetX = this.chart.width - this.typeText.rectWidth * 2;
            this.typeText.textOffsetX = (this.typeText.rectWidth - this.typeText.textLength)/2;
            this.typeText.textOffsetY = this.typeText.rectHeight - this.typeText.fontSize/2;
            var max = 0;
            var data = this.data.data;
            var params = this.data.params;
            for (var i=0; i<data.length; ++i) {
                data[i].date = this.parsers.inputDate(data[i].date);
                if (data[i].data[params.ID_POWER].production > max)
                    max = data[i].data[params.ID_POWER].production;
                if (data[i].data[params.ID_POWER].consumption > max)
                    max = data[i].data[params.ID_POWER].consumption;
                if (data[i].data[params.ID_GAS].production > max)
                    max = data[i].data[params.ID_GAS].production;
                if (data[i].data[params.ID_GAS].consumption > max)
                    max = data[i].data[params.ID_GAS].consumption;
            }
            return scaleToUnit(max, this.axes.xLeft.unit);
        },
        setup: function(svgId, data) {            

            this.svg = d3.select("#" + svgId)
                .attr("width", this.chart.width)
                .attr("height", this.chart.height);

            this.createGradients();
            this.data = data;
            this.parsers.inputDate = d3.timeParse("%Y/%m/%d");
            this.parsers.outputDate = d3.timeFormat(this.dateText.format);
            var max = this.prepareData();

            this.createScales(max);
        },
        run: function(svgId, data) {
            this.setup(svgId, data);
            this.draw();
        }
    };
}