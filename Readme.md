# Nodejs CSV to Markdown converter

This little helper script converts every row of a give CSV file to simple Markdown files.

This will NOT create a Markdown table.

## Usage
Coming soon…

### Template
You can just update the ``basic.md`` template to fit your needs or just add another template file.
All templates must be placed at the template directory.

### User input

You get promoted to enter some data:

1. ``path`` to your .csv file, e.g. ``./demo.csv``
2. ``templateName`` the name of your template, placed at the template directory, default value ``basic.md``
3. ``from`` to line where to start from at your .csv file, default value ``1``
4. ``till`` to line where to stop at your .csv file, default value ``null`` to stop at the end of the .csv
5. The available markdown templates are generated based on your CSV column names. All available variables are promoted to you at the console.
6. ``variable`` based on the entered variable the filename and slug are generates. Fallback: ``id``

Now your markdown files are generated, every generated file ist logged to the console.
