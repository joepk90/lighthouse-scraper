const fs = require('fs');
const path = require('path')
const { parse } = require('json2csv');

const jsonFiles = fs.readdirSync('./reports').filter(file => path.extname(file) === '.json');

const getData = async (files) => {
    
    let data = {};
    files.forEach(file => {
        const fileData = fs.readFileSync(path.join('./reports', file));
        const json = JSON.parse(fileData.toString());
        data[file] = json;        
    });

    return data;

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
    if (('requestedUrl' in data)) {
        requiredData.requestedUrl = data.requestedUrl
    }

    if (!('audits' in data)) {
        throw('audits propery not fount in JSON file!');
        return;
    }
    const auditsObject = data.audits;    

    if (!('resource-summary' in auditsObject)) {
        throw 'resource-summary propery not fount in JSON file!';
        return;
    }
    const resourceSummary = auditsObject['resource-summary' ]


    if (!('details' in resourceSummary)) {
        throw 'details propery not fount in JSON file!';
        return;
    }
    const resourceSummaryDetails = resourceSummary['details']


    if (!('items' in resourceSummaryDetails)) {
        throw 'details propery not fount in JSON file!';
        return;
    }

    const resourceSummaryDetailsItems = resourceSummaryDetails['items']


    requiredData.resources = resourceSummaryDetailsItems;
    return requiredData;
    
}

const restructureData = (data) => {

    let restructuredData = {};

    if (!('requestedUrl' in data)) {
        throw 'requestedUrl property not fount in JSON data!';
        return;
    }

    restructuredData.url = data.requestedUrl

    if (!('resources' in data)) {
        throw 'resources property not fount in JSON data!';
        return;
    }


    data.resources.forEach(resourceType => {
        
        if (!('label' in resourceType) || !('transferSize' in resourceType)) {
            throw 'label or transferSize property not fount in JSON data!';
            return;
        }

        restructuredData[resourceType.label] = resourceType.transferSize

    });

    return restructuredData;
}


const saveCSV = (csv) => {

    console.log(csv);

    fs.writeFile('reports.csv', csv, function(err) {
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

    const files = await getData([jsonFiles[0]]);
    const resourceItems = extractResourceSummaries(files);
    const structuredData = restructureData(resourceItems)
    const CSVData = generateCSV(structuredData);
    saveCSV(CSVData);

};


exports.generateReport = generateReport;