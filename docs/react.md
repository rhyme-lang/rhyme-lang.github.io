---
outline: deep
---

# React

In addition to pure DOM components, Rhyme can also be made to produce React trees.



## Simple React Blog

Generate a simple blog UI from a JSON dataset.

::: sandbox {template=static showTabs=true rtl previewHeight=320 coderHeight=320}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
```js data.jsx
// Define our blog data
let data = [{
	title: "My first post",
	body: "Lorem ipsum dolor sit amet"
},{
	title: "My second post",
	body: "Gallia est omnis divisa in partes tres"
}]
```
```js Post.jsx
// Custom React elements as UDF
function Post({title, body}) {
	return <div><h2>{title}</h2><p>{body}</p></div>
}
```
```js Main.jsx [active]
// Rhyme query: we construct the equivalent of:
//
// let Main = props => 
//  <Fragment>
//    <h1>My Fancy Blog</h1>
//    <div><Post title="data.*.title" body="data.*.body"/></div>
//  </Fragment>
//
// (It would not be too hard to add a wrapper for literal JSX input)

let main = rh.compile({
  '"$react"': "udf.Fragment", 
  children: [{
    '"$react"': "h1", children: ['"My Fancy Blog"']
  },{
    '"$react"': "div", children: [{
      '"$react"': "udf.Post", 
      props: { title: "data.*.title", body: "data.*.body" }
    }]
  }]
})

let Main = props => reactify(main(props))
let udf = { Post, Fragment: React.Fragment }
root.render(<Main data={data} udf={udf}/>)
```
```html index.html [hidden]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Rhyme React Example</title>
    <style type="text/css">
      body {
        margin: 40px
        auto;
        max-width: 650px;
        line-height: 1.4;
        font-size: 16px;
        font-family: sans-serif;
        color: #333;
        padding: 0
        10px
      }
      h1, h2, h3 {
        line-height: 1.1
      }
    </style>
    <!-- <script src="https://unpkg.com/rhyme-lang/umd/rhyme-lang.min.js"></script> -->
    <script src="rhyme-lang.min.js"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script crossorigin src="https://unpkg.com/babel-standalone@6/babel.js"></script>
  </head>

  <body>
    <div id="root"></div>

    <script>
      try { rhyme } catch (e) { 
        document.write(`<p><b>ERROR</b>: ../umd/rhyme-lang.min.js doesn't exist. 
To create it, run the following commands at the top level of the Rhyme repository:</p>
<pre>
npm install webpack webpack-cli --save-dev
./node_modules/.bin/webpack
</pre>`)
        throw e 
      }
    </script>

    <script type="text/babel">

      // Import Rhyme API
      let rh = rhyme.api

      // Set up a React root
      let root = ReactDOM.createRoot(document.getElementById("root"))

      // Define a function to convert plain JSON values to React elements.
      //
      // We'll use { $react: "div", props: ..., children: ... } to
      // express <div> ... </div>. 
      //
      // Note (A): this step isn't strictly necessary, as 
      // React elements themselves are objects of the form
      // { $$typeof: Symbol(react.element), type: "div", 
      //   ref: null, props: {children: [...]}}.
      // However, 'ref' and 'props.children' have to be present, 
      // so our form is a slight convenience.
      function reactify(obj) {
        if (typeof(obj) === "string") return obj
        if (typeof(obj) === "number") return obj
        if (obj && "$react" in obj) {
          let children = []
          for (let k in obj.children)
            children.push(reactify(obj.children[k]))
          return React.createElement(obj["$react"], obj.props, ...children)
        }
        return JSON.stringify(obj)
      }

    </script>
    
    <script type="text/babel" src="data.jsx"></script>
    <script type="text/babel" src="Post.jsx"></script>
    <script type="text/babel" src="Main.jsx"></script>

    <script type="text/babel">
      // A few possible avenues to go from here:
      // - try producing React elements directly from Rhyme queries (see (A) above)
      // - try taking JSX as Rhyme query input (see (B) above)
      // - provide an alternative API to construct React trees,
      //   e.g. similar to S-exprs: (Fragment (h1 "My Blog" (div [Post ...])))

      // Note: there is some ambiguity in where elements are collected.
      // Consider lists of posts and their children:
      //  <div><h2>data.*.title</h2><p>data.*.body</p></div>
      // It's not a priori clear if the outer div should be iterated
      // or the inner h2 and p (or any other enclosing element)
      //
      // This can be made explicit by using object syntax with explicit
      // keys { "*": ... } instead of implicit array collection syntax [...]

    </script>



  </body>
</html>
```
:::


## React Todo App

Here we show a slightly more involved example, implementing a Todo app in the style of [TodoMVC](https://todomvc.com).

Note that this example orchestrates multiple Rhyme queries to update various pieces of application state.

::: sandbox {template=static showTabs=true rtl previewHeight=320 coderHeight=320}
<<< @/public/sandbox/rhyme-lang.min.js{#hidden}
```js data.jsx
// Define our app data -- note that we use a struct to hold
// our items instead of an array to maintain stable ids
let data = {
  nextId: 2,
  items: {
    0: {
      title: "First item",
      done: false,
    },
    1: {
      title: "Second item",
      done: false,
    }
  }
}
```
```js util.jsx
// Import Rhyme API
let rh = rhyme.api

// Set up a React root
let root = ReactDOM.createRoot(document.getElementById("root"))

// Define a function to convert plain JSON values to React elements.
//
// We'll use { $react: "div", props: ..., children: ... } to
// express <div> ... </div>. 
//
// Note (A): this step isn't strictly necessary, as 
// React elements themselves are objects of the form
// { $$typeof: Symbol(react.element), type: "div", 
//   ref: null, props: {children: [...]}}.
// However, 'ref' and 'props.children' have to be present, 
// so our form is a slight convenience.
function reactify(obj) {
  if (typeof(obj) === "string") return obj
  if (typeof(obj) === "number") return obj
  if (typeof(obj) === "boolean") return String(obj)
  if (obj && "$react" in obj) {
    let children = []
    for (let k in obj.children)
      children.push(reactify(obj.children[k]))
    return React.createElement(obj["$react"], obj.props, ...children)
  }
  return JSON.stringify(obj)
}

// Some convenience methods for constructing React elements
let g = (tag, props, ...children) => ({
  '"$react"': tag, props, children: {...children} 
  // use obj not array for children -- do not accumulate
})

let gg = tag => (...children) => g(tag, {}, ...children)

let re = {
  p: gg("p"),
  h1: gg("h1"),
  h2: gg("h2"),
  div: gg("div"),
  list: (children) => ({ '"$react"': "div", children })
}
```
```js Main.jsx [active]
// We will use Rhyme query expressions to update our app data:
let toggleQuery = {"data": {"items": { "*I": { "done": "udf.toggle"}}}}
let deleteQuery = {"data": {"items": { "*I": "udf.delete"}}}
let insertQuery = "udf.insert"

// These currently require some helper UDFs:
let udf = {}
udf.toggle = x => { console.log("TOGGLE", x); return !x},
udf.delete = x => { console.log("DELETE", x); return null},
udf.insert = x => { 
  console.log("INSERT", x.event); 
  x.data.items[x.data.nextId++] = { title: x.event, done: false }
  return x
}

// Rhyme doesn't support update queries natively yet, so we
// define our own minimal "update interpreter" here:
let update = q => input => {
  // console.log(q, typeof(q), input)
  if (q === null) return null
  if (typeof(q) === "function") return q(input)
  if (typeof(q) === "number") return q+input
  if (typeof(q) !== "object") return q
  for (let k in q) {
    let e = update(q[k])(input[k])
    if (e !== null)
      input[k] = e
    else
      delete input[k]
  }
  return input
}

// NOTE: there is a question at which "stage" udf.toggle etc should 
// live (function objects vs symbolic "udf.xxx" string references).
//
// Currently it works fine b/c update can deal with function values
// but this wouldn't work if we passed toggleQuery as-is to Rhyme 
// for compilation.



// How does state management work? We define a Main app component
// that renders the results of a Rhyme query and re-executes
// the query after any state change. The key trick is to
// expose setState as UDF to the query itself!
function Main({renderFunc, data, udf}) {
  let [state, setState] = React.useState(data)
  let res = renderFunc({data:state, udf: {setState,...udf}})
  return reactify(res)
}

// Event handlers can then use setState to apply a given update query
udf.updateHandler = (setState) => (qexpr) => event => { 
  // console.log("UPDATE HANDLER", qexpr)
  setState(data => {
    let p = { data, event }
    let p1 = update(qexpr)(p)
    return {...p1.data} })
}

let h = query => rh.apply("udf.updateHandler(udf.setState)", query)


// Custom React elements
udf.InputElem = ({onSubmit}) => {
  let handleKeyDown = e => {
    if (e.key != "Enter") return
    let str = e.target.value.trim()
    if (str.length <= 1) return
    onSubmit(str)
    e.target.value = ""
  }
  return <input placeholder="New item" onKeyDown={handleKeyDown}/>
}


// We are now ready to define our main render query -- first, items:
let item = re.div(
  "*I", '": "', "data.items.*I.title", '" "',
  g("button", { onClick: h(toggleQuery) }, '"Done: "', "data.items.*I.done"),
  g("button", { onClick: h(deleteQuery) }, '"X"'))

// Main app screen
let query = re.div(
  re.h1('"Todo MVC"'), 
  re.p(g("udf.InputElem", { placeholder: '"New item"', onSubmit: h(insertQuery)})),
  re.list({"*I": item}),
  re.p(
    '"Total: "', "count data.items.*I",
    '" Todo: "', rh.sum(rh.get({true:0,false:1},"data.items.*I.done")),
    '" Done: "', rh.sum(rh.get({true:1,false:0},"data.items.*I.done")),
    ))


// Compile our query once
let func = rh.compile(query)
// console.log("Explain: ", func.explain)

// Finally, render the main app component
root.render(<Main renderFunc={func} data={data} udf={udf}/>)


// EXERCISE: add additional functionality from https://todomvc.com
//
// - show list and footer only if there is at least one item
// - allow editing of individual items
// - add buttons to filter display:
//   - show only todo
//   - show only done
//   - these modes should use URL routing (/, /todo, /done)
// - add buttons to change global state:
//   - mark all items done
//   - delete all done items
```
```html index.html [hidden]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Rhyme React Example</title>
    <style type="text/css">
      body {
        margin: 40px
        auto;
        max-width: 650px;
        line-height: 1.4;
        font-size: 16px;
        font-family: sans-serif;
        color: #333;
        padding: 0
        10px
      }
      h1, h2, h3 {
        line-height: 1.1
      }
    </style>
    <!-- <script src="https://unpkg.com/rhyme-lang/umd/rhyme-lang.min.js"></script> -->
    <script src="rhyme-lang.min.js"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script crossorigin src="https://unpkg.com/babel-standalone@6/babel.js"></script>
  </head>

  <body>
    <div id="root"></div>

    <script>
      try { rhyme } catch (e) { 
        document.write(`<p><b>ERROR</b>: ../umd/rhyme-lang.min.js doesn't exist. 
To create it, run the following commands at the top level of the Rhyme repository:</p>
<pre>
npm install webpack webpack-cli --save-dev
./node_modules/.bin/webpack
</pre>`)
        throw e 
      }
    </script>

    <script type="text/babel" src="data.jsx"></script>
    <script type="text/babel" src="util.jsx"></script>
    <script type="text/babel" src="Main.jsx"></script>
    <script type="text/babel">

    </script>
  </body>

</html>

```
:::
