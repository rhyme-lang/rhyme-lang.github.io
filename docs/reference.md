---
outline: deep
---

# Reference

Before diving into different kinds of operators, we will first look the steps involved in 
running a Rhyme query.
We assume that you have already installed the `rhyme-lang` package in your project.
If not, please head over to the [installation](/getting-started#installation) page.

Rhyme works by compiling the given query into a function that can be run on data.
The compilation step is done by the `api.compile` function.
This returns a JS function which can be run on any input data to get the result of the query.

```js
// import the library
let { api } = require("rhyme-lang")

// define the query
let query = rh`{ data.*.key: sum(data.*.value) }`

// use the api.compile function to compile the query
let func = api.compile(query)

// run the compiled function on some sample data
let sampleData = [
    { key: "A", value: 10 },
    { key: "B", value: 20 },
    { key: "A", value: 30 }
]
let result = func({"data": sampleData})
```

Now that we have seen the basic steps involved in running a Rhyme query, let us look at the different kinds of operators available in Rhyme.

### Metaprogramming API

We have seen above how to use the ``rh`{ data.*.key: ...}` `` syntax to specify a Rhyme query.

To facilitate metaprogramming and composition of queries in JS, Rhyme also allows to
specify the query using JS objects directly:

````js
let query = {
    "data.*.key": api.sum("data.*.value")
}
````



### Simple Indexing
Like JQ, we can use the `.` operator to index into objects and arrays. For instance the query `data.0` will return the first element of the array `data`.


### Iterating
We can use the `*` operator to iterate over arrays and compute aggregations. For instance, the query `data.*.value` will
iterate through `data` and collect all the `value` attributes.

```js
[data.*.value] // collect all the values
```

Note that if no top-level aggregation is specified explicitly, the first value is returned. 
For instance, the query `data.*.value` will return `10` for the sample data above.

We will see later that these iterators can be named like `*A`, `*B`, `*item`, etc. instead of using the default `*` symbol
to allow for more complex queries.

### Aggregations

We can use aggregate operators to compute aggregations over iterated values.
For instance, the query `sum(data.*.value)` will compute the sum of all the values.
Below is a list of all the aggregate operators currently available in Rhyme.

| Aggregation | Description |
| ----------- | ----------- |
| `sum` | Computes the sum of the values |
| `min` | Computes the minimum of the values |
| `max` | Computes the maximum of the values |
| `mean` | Computes the mean of the values |
| `count` | Computes the number of values |
| `array` or `[ ]` | Collects all the values into an array |

### Arithmetic (Binary Operators)
Rhyme supports the usual basic arithmetic operations like, addition,
subtraction, multiplication, division, etc.

<!-- | Operator | Description |
| -------- | ----------- |
| `api.plus` | Addition |
| `api.minus` | Subtraction |
| `api.mul` | Multiplication |
| `api.div` | Division |
| `api.fdiv` | Floor division |
| `api.mod` | Modulo |
 -->

### Grouping
Group-bys in Rhyme are implicitly expressed using keys. For instance, having `data.*.key` as the key would do
a group-by on the `key` attribute of the data and whenever `data.*` is iterated within this key, it will only
iterate over the values that have the same key.
We can use nested JSON objects to express group-bys on multiple keys.
For instance, the query below will do a group-by on the `key1` and `key2` attributes of the data.

```js
{
    data.*.key1: {
        data.*.key2: sum(data.*.value)
    }
}
```

### Joins
Rhyme supports efficient equi-joins in a natural way. Joins between two objects are expressed as 
lookup on the other object based on the key.
The following query will do a join between `data1` and `data2` based on 
the `key` attribute and compute the sum of products of the `value` attributes.

```js
{
    data2.(data1.*.key): sum(data2.*.value * data1.*.value)
}
```

This example assumes that `data2` can be directly indexed by the `key` field of `data1`. 
If this is not the case, `data2` needs to be grouped by the matching key (as shown above) 
beforehand.


### UDFs
Rhyme supports user-defined functions (UDFs) which can be used to express custom computations.
UDFs are expressed as using normal JS functions that are passed as additional input when
the query is run.
For instance, the following query will apply the `multiply10` function to all the values 
in `data.*.value`.

```js
// define udfs
let udf = { multiply10: x => x * 10 }

// define query
let query = rh`udf.multiply10(data.*.value)`

// compile query
let func = api.compile(query)

// pass udf as additional input when running query
let result = func({"data": sampleData, "udf": udf})
```

### Generated Code

After compiling a Rhyme query, we can inspect the generated code:
```js
// define the query
let query = rh`{ data.*.key: sum(data.*.value) }`

// use the api.compile function to compile the query
let func = api.compile(query)

// print generated code
console.log(func.explain.codeString)

```


:::details Show output
```js
inp => {
    let tmp = {}
    tmp[0] ??= {}
    for (let x in inp['data']) {
        tmp[0][inp['data'][x]['key']] ??= 0
        tmp[0][inp['data'][x]['key']] += inp['data'][x]['value']
    }
    return tmp[0]
}
````
:::

