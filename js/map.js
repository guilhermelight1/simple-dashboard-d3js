(function () {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const projection = d3.geo.albersUsa()
        .translate([width / 2 + 10, (height / 2) - 80])
        .scale([height + 50]);

    const path = d3.geo.path()
        .projection(projection);

    const color = d3.scale.linear()
        .range(['rgb(229,245,224)', 'rgb(199,233,192)', 'rgb(161,217,155)', 'rgb(116,196,118)', 'rgb(65,171,93)', 'rgb(35,139,69)', 'rgb(0,90,50)']);

    // create SVG element
    const svg = d3.select('#bottomRight')
        .append('svg')
        .attr('width', width)
        .attr('height', height);


    // load in Sales Data
    d3.csv('data/2017-state-sales.csv', data => {

        // set input domain for color scale
        color.domain([0, d3.max(data, d => d.sales)]);

        //  load in GeoJSON data
        d3.json('data/us.json', function (json) {

            // merge the SalesDdata and GeoJSON
            data = data.map(stateSalesDataItem => {
                const stateJson = json.features.find(item => item.properties.NAME === stateSalesDataItem.state);
                stateJson && (stateJson.properties.value = parseFloat(stateSalesDataItem.sales));
            });

            // add tooltip
            const mapTooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .attr('id', 'mapTooltip')
                .style('opacity', 0);

            // build Map
            svg.selectAll('path')
                .data(json.features)
                .enter()
                .append('path')
                .attr('d', path)
                .style('fill', d => {
                    const value = d.properties.value;

                    return value
                        ? color(value)
                        : '#fff';
                })
                .on('mouseover', function (d) {
                    mapTooltip.transition()
                        .duration(500)
                        .style('opacity', .9);

                    let tip = [
                        `<strong>${d.properties.NAME}</strong><br/>`,
                        `<strong>Sales:</strong> $${formatSales(d.properties.value)}<br/>`
                    ].join('');

                    mapTooltip.html(tip)
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY - 28) + 'px');
                })
                .on('mouseout', function (d) {
                    mapTooltip.transition()
                        .duration(500)
                        .style('opacity', 0);
                });


            // sort values for color legend
            const legendData = json.features
                .map(item => parseFloat(item.properties.value))
                .filter(item => item)
                .sort();

            const rectWidth = width / legendData.length;

            // add color legend
            svg.selectAll('rect')
                .data(legendData)
                .enter()
                .append('rect')
                .attr({
                    x: (d, i) => i * rectWidth,
                    y: height - 140,
                    width: (d, i) => rectWidth,
                    height: 10,
                    fill: d => color(d)
                });


            svg.selectAll('text')
                .data([legendData[0], legendData[legendData.length - 1]])
                .enter()
                .append('text')
                .text(d => formatSales(d))
                .attr({
                    x: (d, i) => (width - (margin.left / 2)) * i,
                    y: height - 150,
                    'font-size': '12px',
                    'font-family': 'sans-serif'
                });
        });
    });
})()