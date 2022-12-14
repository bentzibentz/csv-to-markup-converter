const fs = require("fs");
const { parse } = require("csv-parse");
const slugify = require('slugify');
const prompt = require('prompt-sync')({sigint: true});
const clc = require("cli-color");
const { resolve } = require('path');
let { render } = require("mustache");

const convertCsvToMarkdown = () => {
    // Parse the .csv file and return the data
    const parseCsvFile = async (file, from, to = null, useColumns = false) => {

        // Build parser options object
        let parserOptions = { delimiter: ",", from_line: from, to_line: to }
        if (useColumns) {
            parserOptions = { columns: header => header.map(column => column.trim()) }
        }

        // Parse file
        let records = []
        const parser = fs
            .createReadStream(file)
            .pipe(parse(parserOptions));
        for await (const record of parser) {
            records.push(record)
        }
        return records
    }

// Generate .md files based on given data
    const generateMd = (rows, templateName, outputPath) => {

        if (!rows.length) {
            console.log('No variables could be generated from the CVS columns, please check your CSV and try again.');
            return;
        }

        let schema = {};
        const keys = Object.keys(rows[0]);

        if (!keys.length) {
            console.log('No variables could be generated from the CVS columns, please check your CSV and try again.');
            return;
        }

        const mdVariables = prompt(`Available markdown variables: ${clc.red(keys.join(','))}, please update your markdown template. Updated? (y/N):` , 'y', {autocomplete: complete(['y', 'N'])});
        if (mdVariables !== 'y') {
            console.log('Markdown template not updated, please update and restart.');
            return;
        }

        let selectedKey = prompt('Which variable should be used to generate slug and file name? ', 'id', {autocomplete: complete(keys)});

        if (!keys.includes(selectedKey)) {
            console.log(`Key are not part of your available variables: ${clc.red(keys.join(', '))}, fallback is used.`, clc.red(selectedKey));
            if (!selectedKey) { selectedKey = schema[0]; }
        } else {
            console.log('Slug and filename generated based on key: ', clc.red(selectedKey));
        }

        let template = fs.readFileSync(`${templateName}`).toString();
        rows.forEach( (row) => {

            keys.forEach((key, i) => {
                schema[key] = row[key] ? row[key] : '';
            });

            schema.slug = slugify(row[selectedKey], {lower: true, strict: true});

            let output = render(template, schema)
            fs.writeFileSync(`${outputPath}/${schema.slug}.md`, output);
            console.log(`~ Markdown file ${clc.red(schema.slug)}.md generated.`);
        })

    }

// Init parser and get user input
    const initCsvParser = () => {

        let csvPath = prompt('Enter path to .csv file (e.g. ./demo.csv): ');
        if (!csvPath) {
            csvPath = prompt('Enter path to .csv file (e.g. ./demo.csv): ');
        }
        console.log('Your path: ', clc.red(csvPath));
        const path = resolve(process.cwd(), csvPath);

        let mdPath = prompt('Enter path to .md template file (e.g. ./basic.md): ');
        if (!mdPath) {
            mdPath = prompt('Enter path to .md template file (e.g. ./basic.md): ');
        }
        console.log('Your template name: ', clc.red(mdPath));
        const templateName = resolve(process.cwd(), mdPath);

        let mdFilesPath = prompt('Enter path to output directory, the directory must exist (e.g. ./md-files): ');
        if (!mdFilesPath) {
            mdFilesPath = prompt('Enter path to .md template file (e.g. ./basic.md): ');
        }
        console.log('Your output directory: ', clc.red(mdFilesPath));
        const outputPath = resolve(process.cwd(), mdFilesPath);

        const from = prompt('Enter start from line: ', 1);
        console.log('Your start from Line: ', clc.red(Number(from)));

        const till = prompt('Enter end line: ', null);
        console.log('Your end Line: ', till ? clc.red(till) : clc.red('runs till the end of the file'));

        console.log('The CSV column names are used for variable and schema generation!');
        const useColumns = 'y';

        // Parse .csv to get column and row data and start .md file generation
        parseCsvFile(path, from, till ? Number(till) : null, useColumns).then(
            (res) => {
                generateMd(res, templateName, outputPath);
            }
        ).catch(
            (err) => {
                console.log('rows:', err);
            }
        );

    }

    initCsvParser();
}

// Helper functions
function complete(commands) {
    return function (str) {
        let i;
        let ret = [];
        for (i=0; i< commands.length; i++) {
            if (commands[i].indexOf(str) === 0)
                ret.push(commands[i]);
        }
        return ret;
    };
}

module.exports = convertCsvToMarkdown;
