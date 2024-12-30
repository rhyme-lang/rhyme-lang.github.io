---
outline: deep
---

# Examples

The Rhyme test suite explores a number of use cases with helpful examples:

- [Test Suite Entry Point (test/)](https://github.com/rhyme-lang/rhyme/tree/main/test/) 
	- [Advent of Code (aoc/)](https://github.com/rhyme-lang/rhyme/tree/main/test/aoc):
		- [AOC 2023 (aoc_2023.test.js)](https://github.com/rhyme-lang/rhyme/tree/main/test/aoc/aoc_2023.test.js):
		full implementation of the 2023 advent of code challenges	 
	- [C generation (cgen/)](https://github.com/rhyme-lang/rhyme/tree/main/test/cgen/)
		generating C code for sparse tensors and SQL-style workloads
	- [Miscellaneous (original/)](https://github.com/rhyme-lang/rhyme/tree/main/test/original/)
		- [Grouping (grouping.test.js)](https://github.com/rhyme-lang/rhyme/blob/main/test/original/grouping.test.js) 
		  demontrate various forms of grouping
		- [Sorting (sorting.test.js)](https://github.com/rhyme-lang/rhyme/blob/main/test/original/sorting.test.js) 
		  demontrate how to implement sorting using UDFs
		- [Recursion (recursion.test.js)](https://github.com/rhyme-lang/rhyme/blob/main/test/original/recursion.test.js) 
		  demontrate how to implement recursion using an external driver loop
		- [Tensors (tensors.test.js)](https://github.com/rhyme-lang/rhyme/blob/main/test/original/tensors.test.js)
		  demonstrate various matrix and tensor operations, including batched matrix products
	- [Semantics (semantics/)](https://github.com/rhyme-lang/rhyme/tree/main/test/semantics/) 
		- [Custom data structures (se-datastruct.test.js)](https://github.com/rhyme-lang/rhyme/blob/main/test/semantics/se-datastruct.test.js) 
		  demontrate how to use custom datastructures (red black trees, typed arrays, sparse and dense tensors)
		- [Recursion (se-recursion.test.js)](https://github.com/rhyme-lang/rhyme/blob/main/test/semantics/se-recursion.test.js) 
		  demontrate how to implement recursion using an external driver loop (additional tests)
		- [Tree paths (se-tree-paths.test.js)](https://github.com/rhyme-lang/rhyme/blob/main/test/semantics/se-tree-paths.test.js) 
		  demonstrate shape polymorphism using tree-path variables
	- [Typing (typing/)](https://github.com/rhyme-lang/rhyme/tree/main/test/typing/)
		demonstrate experimental typing facility









## Interactive Demos

In addition, there are a number of interactive examples for
running Rhyme in the browser:

- [Display](/display)

- [Tables](/tables)

- [SVG](/svg)

- [React](/react)


Rhyme also comes with a commond-line tool that can be used
interactively or from shell scripts:

- [Command-Line Usage](/command-line)

