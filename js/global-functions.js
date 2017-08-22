function formatSales(d) {
    // example: if d == 13655, then return 14k

    const prefix = d3.formatPrefix(d);
    const num = prefix.scale(d).toFixed();

    return num + prefix.symbol;
}