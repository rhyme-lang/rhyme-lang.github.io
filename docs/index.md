---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Rhyme"
  text: "An Expressive \nData-Centric \nQuery Language"
  tagline: Query nested data, produce nested data as result
  image: 
    src: "https://avatars.githubusercontent.com/u/150201258?s=400&u=c165a8a5fc98d1ddc149652fcdb818e4222f3094&v=4"
    alt: Rhyme
  actions:
    - theme: brand
      text: Overview
      link: /overview
    - theme: alt
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: Examples
      link: /examples

features:
  - title: Tree-to-Tree Queries
    details: Process nested structures (JSON, Tensors) as input, produce nested structures as result.
  - title: Easy to Metaprogram
    details: Compose query fragments in JS, following the structure of the input or output.
  - title: Compile to JS (or C)
    details: Queries are optimized and translated to low-level code for maximum performance.
---

## From Query to Code

A Rhyme query is compiled through an intermediate representation (IR) that makes data
dependencies explicit, optimized, and finally translated to efficient JavaScript (or C).

<div class="rhyme-pipeline">

<div class="rhyme-stage">
<div class="rhyme-stage-title">1 &middot; Source Query</div>

```js
// share of total population, per country
rh`{
  data.*A.country:
      sum(data.*A.population)
    / sum(data.*B.population)
}`
```

</div>

<div class="rhyme-stage">
<div class="rhyme-stage-title">2 &middot; Intermediate Representation</div>
<div class="rhyme-ir"><img class="rhyme-ir-img" src="/images/ir.svg" alt="IR graph: t2 accumulates the total population, t1 the per-country sum, t0 divides them" /></div>
</div>

<div class="rhyme-stage">
<div class="rhyme-stage-title">3 &middot; Generated Code</div>

```js
inp => {
  let tmp = {}
  tmp.t1 ??= {}
  tmp.t2 ??= 0
  for (let xB in inp.data) {
    tmp.t2 += inp.data[xB].population
  }
  tmp.t0 ??= {}
  for (let xA in inp.data) {
    let k = inp.data[xA].country
    tmp.t1[k] ??= 0
    tmp.t1[k] += inp.data[xA].population
    tmp.t0[k] = tmp.t1[k] / tmp.t2
  }
  return tmp.t0
}
```

</div>

</div>
