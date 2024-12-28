---
outline: deep
---

# Display

Rhyme includes a facility for rendering structured data as DOM components.
The presentation can be customized in various ways. 

The underlying mechanism is a tree-to-tree transformation, with some
embedded rendering directives (key `$display`).


## Default

The default is to present all the fields of an object in an expandable fashion,
much like the object inspector in Safari or Chrome developer tools.

::: sandbox {template=static showTabs=false rtl previewHeight=200 coderHeight=100}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
```js query.js [active]
let data = [{x:20,y:70},{x:40,y:30},{x:60,y:50},{x:80,y:60},{x:100,y:40}]
display(data)
```
:::


## Select

The behavior can be customized by choosing a different presentation, e.g.,
by showing only one specific entry, selected by the user.

::: sandbox {template=static showTabs=false rtl previewHeight=150 coderHeight=150}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
```js query.js [active]
let data = [{x:20,y:70},{x:40,y:30},{x:60,y:50},{x:80,y:60},{x:100,y:40}]
display({
    "$display": "select",
    data: data
})
```
:::


## Slider

For numerical keys, a range slider is sometimes more convenient than
individual buttions.

::: sandbox {template=static showTabs=false rtl previewHeight=150 coderHeight=150}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
```js query.js [active]
let data = [{x:20,y:70},{x:40,y:30},{x:60,y:50},{x:80,y:60},{x:100,y:40}]
display({
    "$display": "slider",
    data: data
})
```
:::


## Raw DOM

It is also possible to produce raw DOM trees directly.

::: sandbox {template=static showTabs=false rtl previewHeight=150 coderHeight=150}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
<<< @/public/sandbox/index.html{#hidden}
```js query.js [active]
display({
  "$display": "dom",
  type: "h1",
  props: { style: { color: "lime" }},
  children: ["hello", " ", "jolly", " ", "world"]
})
```
:::


## Nesting

The presentation behavior can be nested arbitrarily, e.g., to display 
[tables](tables.html) with structured entries.