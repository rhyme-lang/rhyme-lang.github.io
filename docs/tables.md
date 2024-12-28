---
outline: deep
---

# Tables


Rhyme can display tabular data in a variety of formats. These include various
forms of pivot tables, bar charts, and combinations.


## Table with Custom Cells

To demonstrate some of the possibilities, below is a simple two-tab component 
that displays either a table with an embedded bar chart, or a structural
view of some other object.


::: sandbox {template=static showTabs=false rtl previewHeight=180 coderHeight=320}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
```js query.js [active]
let data = {
  "$display": "table",
  rows: 1, cols: 1, // number of row/col dimensions: 1 means flat (no nesting)
  data: [
    {region:"Asia",city:"Beijing","population":{"$display":"bar",value:40}},
    {region:"Asia",city:"Tokyo","population":{"$display":"bar",value:70}},
  ]
}
display({
  "$display": "select",
  data: {
    "Data Table": data,
    "Other Object": {A:1,b:2}
  }
})
```
:::


## Pivot Table

Based on the previous simple example, we show how to construct a pivot table 
of a simple dataset, grouped by and aggregated along several dimensions.

Note the two different styles of grouping, and how the `computeEntry` subquery
function is reused in multiple places.


::: sandbox {template=static showTabs=true rtl previewHeight=550 coderHeight=400}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
<<< @/public/sandbox/warehouse.csv
```js query.js [active]
loadCSV("warehouse.csv").then(data => {
  let udf = {
    formatUSD: p => "$"+p+".00",
    formatPercent: p => Math.trunc(p*100) + " %",
    percent: p => Math.trunc(p*100)
  }
  let computeEntry = {
    "Quantity":         api.sum("data.*.quantity"),
    '"Percent Total"':  api.apply("udf.formatPercent",api.fdiv(api.sum("data.*.quantity"),api.sum("data.*2.quantity"))),
    '"Bar Chart"': {
      "$display": "bar",
      value: api.apply("udf.percent",api.fdiv(api.sum("data.*.quantity"),api.sum("data.*2.quantity")))
    }
  }
  let query = {
    "$display": "select",
    data: {
      '"Grouped I"': {
        "$display": "table",
        rows: 4, cols: 1,
        template: {
          Quantity: {}, '"Bar Chart"':{}, '"Percent Total"': {}
        },
        data: { Total: {
          props: computeEntry,
          children: { "data.*.warehouse": {
            props: computeEntry,
            children: { "data.*.product": {
              props: computeEntry,
              children: {
                "data.*.model": computeEntry
              }
            }}
          }}
        }}
      },
      '"Grouped II"': {
        "$display": "table",
        rows: 3, cols: 1,
        data: {
          "Total": {
            '"-"': {
              '"-"': computeEntry
            }
          },
          "data.*.warehouse": {
            "Total": {
              '"-"': computeEntry,
            },
            "data.*.product": {
              "Total": computeEntry,
              "data.*.model": computeEntry
            }
          }
        }
      },
      '"Raw Data"': {
        "$display": "table",
        rows: 1, cols: 1,
        data: ".data"//{ "*i":"data.*i" }
      },
    }
  }

  let func = api.compileFastPathOnly(query)
  // console.log("Pivot Tables: ", func.explain)
  let res = func({data,udf})
  api.display(res, domParent)
})
```
:::



## Bar Chart Race

To demonstrate the interative features, we show an implementation of 
the popular 'Bar Chart Race' visualization. Drag the slider along to
see the largest cities swap places as time changes.

It would not be difficult to animate the process.

::: sandbox {template=static showTabs=true rtl previewHeight=500 coderHeight=400}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
<<< @/public/sandbox/city_populations.csv
```js query.js [active]
loadCSV("city_populations.csv").then(data => {
  function order(as) {
      let idx = as.map((x,i)=>i)
      return idx.sort((ix,iy) => as[iy]-as[ix]) // descending
  }
  let udf = {
    formatNum: p => new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(p*1000),
    order: order,
  }
  let maxByYear = {
    "data.*M.year": api.max("data.*M.value")
  }
  let item = { 
    City: "data.*.name", 
    Population: api.apply("udf.formatNum", "data.*.value"),
    '""': {
      "$display": "bar",
      "value": api.times(api.fdiv("data.*.value", api.get(maxByYear, "data.*.year")), 200)
    }
  }
  function sorted(item, key) {
    let permutation = api.apply("udf.order", [key])
    return { "*S": api.get([item], api.get(permutation, "*S")) }
  }
  let query = {
    "$display": "select",
    data: {
      '"Largest Cities by Year"': {
        "$display": "slider",
        data: {
          "data.*.year": {
            "$display": "table",
            rows: 1, cols: 1,
            data: sorted(item, "data.*.value")
          }
        }
      },
      '"Raw Data"': {
        "$display": "table",
        rows: 1, cols: 0,
        data: ".data"
      },
    }
  }
  let func = api.compileFastPathOnly(query)
  // console.log("Bar Chart Race: ", func.explain)
  let res = func({data,udf})
  api.display(res, domParent)
})
```
:::

