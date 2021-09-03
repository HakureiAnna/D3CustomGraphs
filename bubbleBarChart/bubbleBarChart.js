var bubbleBarChart = function() {
	return {
		chartHeight: 256,	// 图标高
		chartWidth: 1024,	// 图标宽
		dataPointColor: "black",
		dataSelectedColor: "orange",
		dataSelectedLineColor: "orange",
		dataSelectedR: 15,		// 被选中数据点圆圈半径
		dataSelectedTextColor: "white",
		dataset: {
			x: ["小珠山", "陡崖子", "周家奋", "戴戈庄", "铁山", "殷家河", "孙家屯", "台子沟", "塔山河",],
			y: [850.0, 1310.0, 1150.0, 1230.0, 1716.0, 2250.0, 2110.0, 1450.0, 750.0],
		},
		dataUnitR: 5,				// 数据点圆圈单元半径
		gradientEndColor: "rgb(233, 150, 122)",
		gradientStartColor: "rgb(233, 150, 122)",	
		gradientStartOpacity: 0.1,
		gradientEndOpacity: 0.5,		
		lineCircleColor: "#bbb",	// 网格末端圆圈颜色
		lineCircleR: 3,				// 网格末端圆圈半径
		lineColor: "#bbb",			// 网格线颜色
		lineWidth: 2,				// 网格线粗度
		padding: {					// 图标边距
			left: 30,		
			right: 10,
			bottom: 20, 
			top: 10,	
		},
		svg: null,					// internal use
		xScale: null,				// internal use
		xZeroLabel: '(千）',		// x轴0位标签
		yMax: 0,
		yScale: null,				// internal use
		yUnit: 1000,				// y轴单元大小
		createGradient: function() {
			this.svg.append("defs");
			this.svg.select("defs").append("linearGradient")
				.attr("id", "selectionGradient")
				.attr("x1", 0)
				.attr("x2", 0)
				.attr("y1", 0)
				.attr("y2", 1);
			this.svg.select("#selectionGradient")
				.selectAll("stop")
				.data([
					{offset: "0%",  color: this.gradientStartColor, opacity: this.gradientStartOpacity},
					{offset: "100%", color: this.gradientEndColor, opacity: this.gradientEndOpacity}
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
		},
		dataSetAsJson: function() {			
			var retVal = [];
			for (var i=1; i<this.dataset.x.length; ++i) {
				retVal.push({
					x: this.dataset.x[i],
					y: this.dataset.y[i-1],
				});
			}
			return retVal;
		},
		drawAxes: function() {
			this.svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + (this.chartHeight-this.padding.bottom) + ")")
				.call(this.xAxis);

			this.svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + this.padding.left + ",0)")
				.call(this.yAxis);
		},
		drawData: function() {
			var datasetJson = this.dataSetAsJson(this.dataset);
			var xScale = this.xScale;
			var yScale = this.yScale;
			var yUnit = this.yUnit;
			var dataUnitR = this.dataUnitR;
			var dataSelectedR = this.dataSelectedR;
			var unitWidth = this.getUnitWidth();
			var padding = this.padding;
			var chartHeight = this.chartHeight;
			var svg = this.svg;
			var dataSelectedColor = this.dataSelectedColor;
			var dataSelectedTextColor = this.dataSelectedTextColor;
			var dataPointColor = this.dataPointColor;
			var dataSelectedLineColor = this.dataSelectedLineColor;
			var lineWidth = this.lineWidth;

			svg.append("g")
				.attr("id", "data")
				.selectAll("circle")
				.data(datasetJson)
				.enter()
				.append("circle")
				.attr("id", function(d) {
					return d.x;
				})
				.attr("cx", function(d) {
					return xScale(d.x);
				})
				.attr("cy", function(d) {
					return yScale(d.y/yUnit);
				})
				.attr("r", function(d) {
					return (d.y/yUnit)*dataUnitR;
				})
				.on("click", function(d) {
					svg.select("#selectionRect").remove();
					svg.select("#selectionText").remove();
					svg.select("#selectionLine").remove();
					// return all data points to normal
					svg.select("#data").selectAll("circle")
						.data(datasetJson)
						.transition()
						.attr("cx", function(d) {
							return xScale(d.x);
						})
						.attr("cy", function(d) {
							return yScale(d.y/yUnit);
						})
						.attr("r", function(d) {
							return (d.y/yUnit)*dataUnitR;
						})
						.attr("fill", dataPointColor);
		
					// transform selected data point
					svg.select("#" + d.x)
						.transition()
						.attr("fill", dataSelectedColor)
						.attr("r", dataSelectedR);
					// insert highlight rect
					svg.select("#data").selectAll("rect")
						.data([d])
						.enter()
						.append("rect")
						.attr("id", "selectionRect")
						.attr("x", function(d) {
							return xScale(d.x) - unitWidth/2;
						})
						.attr("y", function(d) {
							return padding.top;
						})
						.attr("width", function(d) {
							return unitWidth;
						})
						.attr("height", function(d) {
							return chartHeight - padding.top - padding.bottom;
						})
						.attr("fill", "url(#selectionGradient)");
		
					svg.select("#data").selectAll("text")
						.data([d])
						.enter()
						.append("text")
						.attr("id", "selectionText")
						.text(d.y)
						.attr("x", function(d) {
							return xScale(d.x);
						})
						.attr("y", function(d) {
							return yScale(d.y/yUnit) + svg.select("#"+d.x).attr("r")/2;
						})
						.attr("text-anchor", "middle")
						.attr("alignment-baseline", "middle")
						.attr("fill", dataSelectedTextColor);
		
					svg.select("#data").selectAll("line")
						.data([d]) 
						.enter()
						.append("line")
						.attr("id", "selectionLine")
						.attr("x1", function(d) {
							return xScale(d.x) - unitWidth/2;
						})
						.attr("x2", function(d) {
							return xScale(d.x) + unitWidth/2;
						})
						.attr("y1",	yScale(0))
						.attr("y2", yScale(0))
						.attr("stroke", dataSelectedLineColor)
						.attr("stroke-width", lineWidth);
				});
		},
		drawLines: function() {		
			var yScale = this.yScale;	
			this.svg.append("g")
				.attr("id", "lines")
				.selectAll("line")
				.data(d3.range(this.yMax+1))
				.enter()
				.append("line")
				.attr("x1", this.padding.left)
				.attr("x2", this.chartWidth - this.padding.right)
				.attr("y1", function(d) {
					return yScale(d);
				})
				.attr("y2", function(d) {
					return yScale(d);
				})
				.attr("stroke", this.lineColor)
				.attr("stroke-width", this.lineWidth);

			this.svg.select("#lines")
				.append("g")
				.attr("id", "leftCircles")
				.selectAll("circle")
				.data(d3.range(this.yMax+1))
				.enter()
				.append("circle")
				.attr("cx", this.padding.left)
				.attr("cy", function(d) {
					return yScale(d);
				})
				.attr("r", this.lineCircleR)
				.attr("fill", this.lineCircleColor);

			this.svg.select("#lines")
				.append("g")
				.attr("id", "rightCircles")
				.selectAll("circle")
				.data(d3.range(this.yMax+1))
				.enter()
				.append("circle")
				.attr("cx", this.chartWidth - this.padding.right)
				.attr("cy", function(d) {
					return yScale(d);
				})
				.attr("r", this.lineCircleR)
				.attr("fill", this.lineCircleColor);
		},
		formatX: function(x) {					
			retVal = [this.xZeroLabel];
			for (var i=0; i<x.length;++i) {
				retVal.push(x[i]);
			}
			return retVal;
		},
		getUnitHeight: function() {
			return (this.chartHeight - this.padding.top - this.padding.bottom)/this.dataset.x.length;
		},
		getUnitWidth: function() {
			return (this.chartWidth - this.padding.left - this.padding.right)/this.dataset.x.length;
		},
		getXRange: function(x) {			
			var retVal = [this.padding.left];
			var unitWidth = this.getUnitWidth();
			for (var i=1; i<x.length; ++i) {
				retVal.push(i*unitWidth + this.padding.left);
			}
			return retVal;
		},
		setup: function(svgId) {			
			this.dataset.x = this.formatX(this.dataset.x);
			
			this.xScale = d3.scaleOrdinal()
				.domain(this.dataset.x)
				.range(this.getXRange(this.dataset.x));

			this.yMax = parseInt(d3.max(this.dataset.y)/this.yUnit) + 1;

			this.yScale = d3.scaleLinear()
				.domain([0, this.yMax])
				.rangeRound([this.chartHeight-this.padding.bottom, this.padding.top]);

			this.xAxis = d3.axisBottom()
				.scale(this.xScale);

			this.yAxis = d3.axisLeft()
				.scale(this.yScale)
				.ticks(d3.range(this.yMax).length);

			this.svg = d3.select("#" + svgId)
				.attr("width", this.chartWidth)
				.attr("height", this.chartHeight);
		},
		run: function(svgId) {
			this.setup(svgId);
			this.createGradient();
			this.drawLines();
			this.drawData();
			this.drawAxes();
		}
	};
};

