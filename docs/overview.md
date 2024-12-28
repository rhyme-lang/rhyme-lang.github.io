---
outline: deep
---

# Rhyme

Rhyme is a declarative query language designed for querying and transforming nested data 
structures like JSON or tensors (nested arrays). It is designed to be easy to use, and to 
express complex queries in a simple way, while also achieving high performance by constructing 
an IR which gets optimized and translated to efficient JS or C code.

Rhyme takes inspiration from existing approaches like GraphQL, Datalog, JQ, XQuery, and 
similar query languages, as well as from functional logic and array languages.

Rhyme can represent all the usual query operators like aggregations, joins, group-by, etc.,
but also supports tensor computations in the style of einops. Rhyme also profits from integration
with the JS ecosystem, e.g., for producing visualizations as DOM trees, React components, etc.


## Quick Examples

Below is an example that computes a group-by aggregation based on keys:
```js
let data = [
    {"key": "A", "value": 30},
    {"key": "B", "value": 20},
    {"key": "A", "value": 45},
]
// rhyme-query
let query = {
    "data.*.key": api.sum("data.*.value")
}
// compile 
let fun = api.compile(query)
// run the compiled query
let result = fun({data})
```

Likewise, we can also express other types of workloads like tensor computations:
```js
let A = [[1, 2], [3, 4]]
let B = [[5, 6], [7, 8]]

// rhyme-query
let matmul = {"*i": {"*j": api.sum("A.*i.*k * B.*k.*j")}}
// compile
let fun = api.compile(matmul)
// run the compiled query
let result = fun({A, B})
```

To learn more about the different ways of using Rhyme, including different APIs, check out the [documentation](/reference).



## Useful Links

- Slides presented at the 24th IFIP WG 2.11 Meeting (Dec 2024): [Rhyme: A Data-Centric Multi-Paradigm Query Language](https://docs.google.com/presentation/d/1yljJLrcbHdGiKhMhAoQkgLJnMqCgEc5Uy6Se0Dz0V0Y/view)

- Poster presented at the Midwest PL Summit (Nov 2024): [Rhyme: A Data-Centric Expressive Query Language for Nested Data Structures](https://docs.google.com/drawings/d/16PsXYFohtb8WhrVIC3y53FeYj3xHDZvQUcSp5fyd0Bg/view)

- Paper published at FLOPS (Jun 2024):
  [Rhyme: A Data-Centric Multi-Paradigm Query Language based on Functional Logic Metaprogramming](https://www.cs.purdue.edu/homes/rompf/papers/abeysinghe-preprint2401.pdf)

- Paper published at PADL (Jan 2024):
  [Rhyme: A Data-Centric Expressive Query Language for Nested Data Structures](https://www.cs.purdue.edu/homes/rompf/papers/abeysinghe-padl24.pdf)

- An interactive blog post introducing (an early version of) Rhyme:
  [Let's build a Query Language!](https://tiarkrompf.github.io/notes/?/js-queries/)


## Development

Rhyme is developed by members of [Prof. Tiark Rompf](https://tiarkrompf.github.io)'s'research group 
at Purdue University and is available for use under a permissive MIT license. 
Before using Rhyme for anything critical, please consider the usual caveats around research-oriented 
software developed by a small team.

