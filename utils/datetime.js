exports.getTime = () => {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

exports.getDateTime = () => {
    const date = new Date();
    return `${date.toISOString().split('T')[0]}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

exports.getDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

exports.calculateInterval = (d2, d1) => {
    const t2 = d2.split(':');
    const t1 = d1.split(':');
    return (+t2[0]*3600 - +t1[0]*3600) + (+t2[1]*60 - +t1[1]*60) + (+t2[2] - +t1[2]);
}