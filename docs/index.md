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

