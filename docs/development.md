---
outline: deep
---

# Development Setup

<!-- ## Setup -->

Clone the repo and run `npm install` to install all the dependencies.

If you want to use the development version of the library you cloned in a different
project, you can run `npm link` in the root directory of the repo and then run
`npm link rhyme-lang` in your project directory.

## Setup for Running in the Browser

If you want to use the development version of the library in the browser, you can use
webpack to build the browser version of the library.
Use the following commands.

```bash
npm install webpack webpack-cli --save-dev 
./node_modules/.bin/webpack
```

This will generate a file `umd/rhyme-lang.min.js` that you can include in your HTML file.

## Code Structure

The code is broadly structured according to compiler phases. 
The following four javascript files provide useful entry points into the codebase:
- `src/rhyme.js`: Contains the main APIs that are exposed to the user.
- `src/parser.js`: Contains the logic for the parser that provides a simple
textual interface for writing Rhyme expressions.
- `src/ir.js`: Contains the logic for creating the Rhyme intermediate representation (IR) from input query ASTs.
- `src/codegen.js`: Contains the logic for generating optimized javascript code from the Rhyme IR.


## Running tests

Typing `npm test` will run all the tests that are in the `test` directory. 

Running tests that involve running generated C++ code will also need Niels Lohmann's 
[C++ JSON library](https://github.com/nlohmann/json) installed. This can be done
either system-wide (e.g. using `brew install nlohmann-json`) or by cloning the
git repo in a Rhyme subdirectory called 'thirdparty'.

If you're using VSCode, you can install [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) extension and run/debug individual tests.

