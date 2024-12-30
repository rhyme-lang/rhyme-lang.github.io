---
outline: deep
---

# SVG

In addition to HTML components, Rhyme can produce other DOM nodes as well. 
Here, we show how to use Rhyme to produce SVG drawings.



## Basic SVG Geoms

Generating basic SVG shapes or "geoms" works the same as generating HTML nodes.

::: sandbox {template=static showTabs=false rtl previewHeight=150 coderHeight=320}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
```js query.js [active]
display({
  "$display": "dom", type: "svg:svg",
  props: { width: "300px", height: "50px" },
  children: [{
    "$display": "dom", type: "svg:rect",
    props: { width: "30px", height: "30px", x: "10px", y: "10px", fill: "black" },
  },{
    "$display": "dom", type: "svg:ellipse",
    props: { rx: "15px", ry: "15px", cx: "75px", cy: "25px", fill: "black" },
  },{
    "$display": "dom", type: "svg:rect",
    props: { width: "30px", height: "30px", x: "110px", y: "10px", fill: "black" },
  }]
})
```
:::


## SVG Plots

Using Rhyme queries, we can produce shapes based on data to draw custom plots.

In this example, notice how we use the same facilities to draw a collection of rects or 
circles, one per data point, or a polyline, which is a single SVG node covering 
an entire list of data points. 
Note also how the code for the individual plots is reused between the all-in-one
and the side-by-side views.


::: sandbox {template=static showTabs=false rtl previewHeight=200 coderHeight=320}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
```js query.js [active]
let data = [{x:20,y:70},{x:40,y:30},{x:60,y:50},{x:80,y:60},{x:100,y:40}]

let line = {
  "$display": "dom", type: '"svg:polyline"',
  props: { points: api.join([api.plus("data.*.x",api.plus('","',api.plus("data.*.y",'" "')))]), stroke: "black", fill:"none" },
}
let bars = {
  "$display": "dom", type: '"svg:rect"',
  props: { width: 16, height: api.minus(100,"data.*.y"), x: api.minus("data.*.x",8), y: "data.*.y", stroke: '"black"', fill: '"none"' },
}
let points = {
  "$display": "dom", type: '"svg:ellipse"',
  props: { rx: 3, ry: 3, cx: "data.*.x", cy: "data.*.y", stroke: '"black"', fill: '"#EEE"' },
}

let query = {
  "$display": "select",
  data: {
    '"All in one"': {
      "$display": "dom", type: '"svg:svg"',
      props: { width: '"300px"', height: '"100px"' },
      children: [bars, line, points]
    },
    '"Side by side"': {
      "$display": "dom", type: "div",
      children: [{
        "$display": "dom", type: '"svg:svg"',
        props: { width: '"120px"', height: '"100px"' },
        children: api.array(points)
      },{
        "$display": "dom", type: '"svg:svg"',
        props: { width: '"120px"', height: '"100px"' },
        children: api.array(line)
      },{
        "$display": "dom", type: '"svg:svg"',
        props: { width: '"120px"', height: '"100px"' },
        children: api.array(bars)
      }]
    },
  }
}
let func = api.compileFastPathOnly(query)
// console.log("SVG Plots:", func.explain)
let res = func({data})
api.display(res, domParent)
```
:::


## Data-Driven Drawings

Of course we are not limited to traditional plots, but we can produce a variety of other
data-driven drawings.


::: sandbox {template=static showTabs=false rtl previewHeight=280 coderHeight=320}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
```js query.js [active]
let data = []
for (let j = 0; j < 360; j += 20) 
  data.push(j)

let query = {
  "$display": "dom", type: '"svg:svg"',
  props: { width: 300, height: 200 },
  children: [{
    "$display": "dom", type: '"svg:ellipse"',
    props: { rx: 40, ry: 15, cx: 200, cy: 100,
      fill: api.plus('"hsl("', api.plus("data.*", '" 90% 50%)"')),
      '"fill-opacity"': '"70%"',
      transform: api.plus('"rotate(-"',api.plus("data.*",'" 150 100)"')) },
  }]
}
let func = api.compileFastPathOnly(query)
// console.log("Other SVG Graphics:", func.explain)
let res = func({data})
api.display(res, domParent)
```
:::

