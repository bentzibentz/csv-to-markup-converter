const fs = require("fs");
const { parse } = require("csv-parse");
const slugify = require('slugify')
let { render } = require("mustache")


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

// Parse .csv to get column and row data and start .md file generation
parseCsvFile('./demo.csv', 2, null, true).then(
    (res) => {
        generateMd(res);
    }
).catch(
    (err) => {
        console.log('rows:', err);
    }
);

// Generate .md files based on given data
const generateMd = (rows) => {
    let template = fs.readFileSync("./template/basic.md").toString()
    rows.forEach( (row) => {
        const page = {
            id: row.id,
            title: row.title,
            slug: slugify(row.title, {lower: true, strict: true}),
            genres: row.genres,
            release: row.release,
            description: row.description,
        }
        console.log(page);
        let output = render(template, page)
        fs.writeFileSync(`./md-files/${page.slug}.md`, output)
    })
}

