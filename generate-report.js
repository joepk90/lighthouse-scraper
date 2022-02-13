const fs = require('fs');
const path = require('path')
const { parse } = require('json2csv');

const getData = async (files) => {
    
    let dataArray = [];
    files.forEach(file => {
        let data = {};
        const fileData = fs.readFileSync(path.join('./reports', file));
        const json = JSON.parse(fileData.toString());
        data[file] = json;

        dataArray.push(data)        
    });

    return dataArray;

}

// every JSON file has been appended with a key of the file name. this functionality could be removed.
const getFirstPropertyOfObject = (file) => {

    if (!file[Object.keys(file)[0]]) {
        console.log('the JSON object is empty!');
        return;
    }

    return file[Object.keys(file)[0]]
    
}

const extractResourceSummaries = (file) => {

    const requiredData = {}

    data = getFirstPropertyOfObject(file);

    // get requested url property and assign it to the new required data object
    if (!("requestedUrl" in data)) {
        console.log("requestedUrl propery not fount in JSON file!");
        return;
    }
    requiredData.requestedUrl = data.requestedUrl;

    if (!('audits' in data)) {
        console.log('audits propery not fount in JSON file!');
        return;
    }
    const auditsObject = data.audits;    

    if (!('resource-summary' in auditsObject)) {
        console.log('resource-summary propery not fount in JSON file!');
        return;
    }
    const resourceSummary = auditsObject['resource-summary' ]


    if (!('details' in resourceSummary)) {
        console.log('details propery not fount in JSON file!');
        return;
    }
    const resourceSummaryDetails = resourceSummary['details']


    if (!('items' in resourceSummaryDetails)) {
        console.log('items propery not fount in JSON file!');
        return;
    }

    const resourceSummaryDetailsItems = resourceSummaryDetails['items']


    requiredData.resources = resourceSummaryDetailsItems;
    return requiredData;
    
}

const restructureData = (data) => {

    let restructuredData = {};

    if (!data) {
        console.log("data empty!");
        return;
    }

    if (!('requestedUrl' in data)) {
        console.log('requestedUrl property not fount in JSON data!');
        return;
    }

    restructuredData.url = data.requestedUrl

    if (!('resources' in data)) {
        console.log('resources property not fount in JSON data!');
        return;
    }


    data.resources.forEach(resourceType => {
        
        if (!('label' in resourceType) || !('transferSize' in resourceType)) {
            console.log('label or transferSize property not fount in JSON data!');
            return;
        }

        restructuredData[resourceType.label] = resourceType.transferSize

    });

    return restructuredData;
}


const saveCSV = (csv) => {

    fs.writeFile('csv-reports/report.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });

};

const generateCSV = (structuredData) => {
    
    const fields = [
        'url',
        'Script',
        'Document',
        'Font',
        'Stylesheet',
        'Other',
        'Image',
        'Media',
        'Third-party',
        'Total',
    ]

    const opts = { fields };

    let csv;

    try {
        csv = parse(structuredData, opts);
        console.log(csv);
    } catch (err) {
        console.error(err);
    }

    return csv;    

};



const generateReport = async () => {

    const jsonFiles = await fs.readdirSync('./reports').filter(file => path.extname(file) === '.json');
    const files = await getData(jsonFiles);


    const struturedDataArray = []
    files.forEach(file => {
        const resourceItems = extractResourceSummaries(file);
        const structuredData = restructureData(resourceItems);
        struturedDataArray.push(structuredData);
    })
    
    const CSVData = generateCSV(struturedDataArray);
    saveCSV(CSVData);

};


exports.generateReport = generateReport;