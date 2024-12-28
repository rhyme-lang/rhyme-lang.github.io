---
outline: deep
---

# Getting Started

Rhyme can be used in multiple different ways: as dependency in a node.js project,
directly in the browser, or as a command-line tool.


## Using Rhyme in Node Projects

To get started with the latest release of Rhyme in your node project,
run the following command:

```bash
npm install rhyme-lang
```

You can then import the library (as you would any other node module) and start using it:

```javascript
const { api } = require('rhyme-lang')

let data = [
    { key: "A", value: 10 },
    { key: "B", value: 20 },
    { key: "A", value: 30 }
]

let query = {
    total: api.sum("data.*.value"),
    "data.*.key": api.sum("data.*.value"),
}
let res = api.compile(query)({ data })
console.log("Result: " + JSON.stringify(res))
```

Visit [documentation](https://rhyme-lang.github.io/docs/) to get a glimpse of what Rhyme can do.


## Using Rhyme in the Browser/Frontend

The npm package `rhyme-lang` installed using the above commands is intended for use in node.js projects.
However, if you want to use Rhyme in the browser (especially the visualization features),
you can use `unpkg` CDN to get the browser version of the library.
Specifically, you can include the script from the following URL in your HTML file:
```
https://unpkg.com/rhyme-lang/umd/rhyme-lang.min.js
```


Shown below is a simple complete example HTML file:
```html
<!DOCTYPE html>
<html>
    <head>
        <title>Rhyme Example</title>
        <meta charset="UTF-8">
    </head>
        <body>
            <h1>Rhyme Example</h1>
            <div id="root"></div>

            <script src="https://unpkg.com/rhyme-lang/umd/rhyme-lang.min.js"></script>

            <script>
                let api = rhyme.api
                let domParent = document.getElementById("root")
                let data = [{x:20,y:70},{x:40,y:30},{x:60,y:50},{x:80,y:60},{x:100,y:40}]
                let query = {
                    "$display": "select",
                    data: data
                }
                let res = api.query(query)
                api.display(res({}), domParent)
            </script>
        </body>
</html>
```

## Using Rhyme as a Command-Line Tool

You can also use Rhyme as a command-line tool to process JSON files. For this, install rhyme globally:

```bash
npm install -g rhyme-lang
```

Then you can use it as follows:

```bash
echo '[1,2,3,4]' | rhyme 'sum stdin.*'
10
```

When given an argument ending in `.rh`, as in `rhyme query.rh`, Rhyme will treat it as a file name to load the query from.


