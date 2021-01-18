
function createData(slno, data) {
    return { slno, data };
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

exports.createData = createData;
exports.a11yProps = a11yProps;