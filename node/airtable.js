const BASE_ID = process.env.AIRTABLE_BASE_ID

const base = require('airtable').base(BASE_ID);

var records = base('Inventory Overview').select({
    // Selecting the first 3 records in Overview:
    maxRecords: 3,
    view: "Overview"
})

var res = base('Inventory Overview').create([
    {
        "fields": {
            "barcode number": {
                "text": "1234567"
            },
            "Letter Label": "Z1",
            "Serial Number": "C02KHQ4CF56J",
            "Product Model": "A1465",
            "Type": "Macbook Pro",
            "Device Type": "Laptop",
            "IT Staffer": ["recGwZGwq7a5xDycq"],
            "Status": "Available for use",
            "Donated By": ["reckdU2upZtDRK5xS"],
            "Quality Tier": "A"
        }
    }
], function (err, records) {
    if (err) {
        console.error(err);
        return;
    }
    records.forEach(function (record) {
        console.log(record.getId());
    });
});