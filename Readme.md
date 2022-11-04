# Nodejs CSV to Markdown converter

This little helper script converts every row of a give CSV file to simple Markdown files.

This will NOT create a Markdown table.

## Usage
To install run ```npm i csv-to-markup-converter```

### Template
Add a markdown template file like the example and store it in your project.
```markdown
---
id: "{{id}}"
title: "{{title}}"
slug: "{{slug}}"
genres: "{{genres}}"
release: "{{release}}"
---

{{description}}
```

### Output folder
Add a output folder to your project.

### Start generator
Run ```npm run convert convert-csv-md```

### User input

You get promoted to enter some data:

1. ``input`` to your .csv file, e.g. ``./demo.csv``
2. ``template path`` the path and name of your template, e.g. ``./template/demo.csv``
3. ``output path`` the path to your output directory, e.g. ``./output``, directory must exist
4. ``from`` to line where to start from at your .csv file, default value ``1``
5. ``till`` to line where to stop at your .csv file, default value ``null`` to stop at the end of the .csv
6. The available markdown templates are generated based on your CSV column names. All available variables are promoted to you at the console.
7. ``variable`` based on the entered variable the filename and slug are generates. Fallback: ``id``

Now your markdown files are generated, every generated file ist logged to the console.
