# Nodejs CSV to Markdown converter

This little helper script converts every row of a give CSV file to simple Markdown files.

This will NOT create a Markdown table.

## Usage
Just clone this repository and run ``npm install``, after the installation of all dependencies run ``node index.js``.

### Template
You can just update the ``basic.md`` template to fit your needs or just add another template file.
All templates must be placed at the template directory.

### Schema
To map your CSV columns to the template we use a simple ``schema`` object. 

### User input

You get promoted to enter some data:

1. ``path`` to your .csv file, e.g. ``./demo.csv``
2. ``templateName`` the name of your template, placed at the template directory, default value ``basic.md``
3. ``from`` to line where to start from at your .csv file, default value ``1``
4. ``till`` to line where to stop at your .csv file, default value ``null`` to stop at the end of the .csv
5. ``userColumns`` possible answers ``y``or ``N``, default value ``y``

then your csv. file will be parsed and all markdown files will be generated at the md-files directory.
