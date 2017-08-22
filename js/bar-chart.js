(function() {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // get data and draw charts
    d3.csv('data/2017-monthly-sales.csv', (error, data) => {
        if (error) {
            return console.error(error);
        }

        buildLegend(data);
        buildBar(data);
    });

    function buildBar(ds) {
        const barTooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const formatRatio = d3.format('%');

        const x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        const y = d3.scale.linear()
            .range([height, 0]);

        const xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        const yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .tickFormat(d3.format('s'))
            .ticks(3);

        const minProfit = d3.min(ds, d => d.profit);
        const maxProfit = d3.max(ds, d => d.profit);

        const color = d3.scale.quantize()
            .domain([minProfit, maxProfit])
            .range(['rgb(202,0,32)', 'rgb(244,165,130)', 'rgb(186,186,186)', 'rgb(64,64,64)']);

        const chart = d3.select('#barChart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        d3.csv('data/2017-monthly-sales.csv', (error, data) => {
            x.domain(data.map(d => d.month));
            y.domain([0, d3.max(data, d => d.sales)]);

            chart.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxis);

            chart.append('g')
                .attr('class', 'y-axis')
                .call(yAxis);

            chart.selectAll('#barChart')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.month))
                .attr('y', d => y(d.sales))
                .attr('height', d => height - y(d.sales))
                .attr('width', x.rangeBand())
                .style('fill', d => color(d.profit))
                .on('mouseover', d => {
                    barTooltip.transition()
                        .duration(500)
                        .style('opacity', .9);

                    let tip = [
                        `<strong>Sales:</strong> $${formatSales(d.sales)}<br/>`,
                        `<strong>Profit:</strong> $${formatSales(d.profit)}<br/>`,
                        `<strong>Ratio:</strong> ${formatRatio(d.profit / d.sales)}<br/>`
                    ].join('');

                    barTooltip.html(tip)
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY - 28) + 'px');
                })
                .on('mouseout', function (d) {
                    barTooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });
        });
    }

    function buildLegend(data) {
        const minProfit = d3.min(data, d => d.profit);
        const maxProfit = d3.max(data, d => d.profit);

        const color = d3.scale.quantize()
            .domain([minProfit, maxProfit])
            .range(['rgb(202,0,32)', 'rgb(244,165,130)', 'rgb(186,186,186)', 'rgb(64,64,64)']);

        const barLegendData = data
            .map(item => parseFloat(item.profit))
            .filter(profit => profit)
            .sort();


        const header = d3.select('#barChartLegend')
            .attr('width', 200)
            .attr('height', 50)
            .attr('transform', `translate(${300}, ${-180})`);

        header.append('text')
            .text('Profit')
            .attr({
                x: 0,
                y: height + margin.top - 5,
                class: 'profitLabel'
            });

        const rectWidth = 200 / barLegendData.length;

        // add color legend
        header.selectAll('.barChartLegend')
            .data(barLegendData)
            .enter()
            .append('rect')
            .attr({
                x: (d, i) => i * rectWidth,
                y: height + margin.top,
                width: rectWidth,
                height: 10,
                fill: d => color(d),
                class: 'barChartLegend'
            });


        header.selectAll('text.profitLegend')
            .data([barLegendData[0], barLegendData[barLegendData.length - 1]])
            .enter()
            .append('text')
            .text(d => formatSales(d))
            .attr({
                x: (d, i) => (200 - (margin.left / 2)) * i,
                y: height + margin.bottom + 10,
                'font-size': '12px',
                'font-family': 'sans-serif',
                class: 'profitLegend'
            });
    }
})()