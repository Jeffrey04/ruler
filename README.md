# ruler

A rule dsl language parser in Javascript

## ruler DSL

This mini-language is partially inspired by LISP. A rule is represented by a list of string, including the name of the function. The main advantage of the language is that it is actually JSON, which makes it easy to be serialized.

### Syntax & Structure

```
["namespace.Function_Name", "some_arguments", "more_arguments_if_applicable"]
```

A rule is usually consist of a function name, and a list of (sometimes optional) arguments. Function names are often namespaced (e.g. `"boolean.And"`, `"condition.Equal"` etc.) and usually only recognized if placed in the first elemnt.

Unless otherwise specified, **a rule can be inserted as an argument to another rule**, for example a `boolean.And` rule.

```
["boolean.And", ["condition.Equal", ["basic.Field", "fieldA"], "X"],
                ["condition.Equal", ["basic.Field", "fieldB"], "Y"]]
```

## Parsing and computing result

In order to parse the rule, just call `ruler.parse`. The result is a function where you can put in a context object in order for it to compute a result. Check `demo.html` from the repository or the hosted version [here](https://coolsilon.com/ruler/demo.html) for live interactive examples.

```
rule = ruler.parse(["condition.Equal", ["basic.Field", "fieldA"], "X"])
context = {"fieldA": "X"}
rule(context) // should yield true
```

## Usage

I am relatively new to modern Javascript development, kindly send a PR to update this section (:

### Pre-requisite

- Iodash.js is needed

### In a Node.js project

Add the library as a dependency (I use yarn myself, but I suppose it is similar for npm user)

```
yarn add https://github.com/Jeffrey04/ruler
```

Then in your code, import and use as follows

```
import ruler from "ruler";

let rule = ruler.parse(["boolean.Tautology"])
console.log(rule({}))
```

### Web browser

Use the [es-module-shims](https://github.com/guybedford/es-module-shims) library by [Guy Bedford](https://github.com/guybedford/) to first load the dependencies.

```
<script defer src="https://unpkg.com/es-module-shims@latest/dist/es-module-shims.js"></script>
<script type="importmap-shim">
  {
    "imports": {
      "lodash": "https://cdn.jsdelivr.net/npm/lodash-es@4.17.15/lodash.min.js"
    }
  }
</script>
<script defer type="module-shim" src="path/to/your-script.js"></script>
```

Import the library in your script as follows

```
import ruler from "path/to/ruler.js";

let rule = ruler.parse(["boolean.Tautology"])
console.log(rule({}))
```

## Ruler API overview

### Array functions

Some array related functions.

#### array.Length

```
["array.Length", $argument]
```

Returns the length of a given array `$argument`.

### Basic functions

Some random functions that don't fit anywhere else goes here

#### basic.Context

```
["basic.Context", $context_sub, $rule]
```

Temporarily change the context to `$context_sub`, and perform `$rule` with `$context_sub` as the new `context`

- `$context_sub` _(required)_: A struct, or a rule to extract a new struct w.r.t. the original `context`
- `$rule` _(required)_: the rule to be applied w.r.t. `$context_sub`

An example:

```
context = {'sub': {'foo': 'bar'}}
rule = ruler.parse(['basic.Context', ['basic.Field', 'sub'],
                                     ['basic.Field', 'foo']])
result = rule(context)
print(result) # returns context['sub']['foo'], which is 'bar'
```

#### Basic.Field

```
["basic.Field", $key, $default]
```

Returns a field value from `context` when called.

- `$key` _(required)_: is a `key` in the `context`.
- `$default` _(optional)_: is a default value to be returned when `context[key]` does not exist.

#### basic.Value

```
["basic.Value", $value]
```

Returns a value, regardless what is in the `context`

- `$value` _(required)_: a value to return. **MAY NOT** be a sub-rule

### Boolean operators

Usually used to chain condition rules (see next section) together

#### boolean.And

```
["boolean.And", $argument1, $argument2, ...]
```

Returns `True` if all arguments returns `True`, or `False` otherwise.

#### boolean.Contradiction

```
["boolean.Contradiction"]
```

Always returns a `False`, a shorthand for

```
["basic.Value", false]
```

#### boolean.Not

```
["boolean.Not", $argument]
```

Returns the result of negation done to `$argument`.

#### boolean.Or

```
["bolean.Or", $argument2, $argument2]
```

Returns `True` if any of the arguments is `True`, or `False` otherwise.

#### boolean.Tautology

```
["boolean.Tautology"]
```

Returns `True` regardless

### Condition rules

Usually returns either true or false

#### condition.Equal

```
["condition.Equal", $alpha, $beta]
```

Returns `True` if and only if `$alpha` is equivalent to `$beta`.

#### condition.Greater_Than

```
["condition.Greater_Than", $alpha, $beta]
```

Returns `True` if and only if `$alpha` is greater than `$beta`.

#### condition.Greater_Than_Equal

```
["condition.Greater_Than_Equal", $alpha, $beta]
```

Returns `True` if and only if `$alpha` is greater than or equal to `$beta`.

#### condition.In

```
["condition.In", $alpha, $values]
```

Returns `True` if `$alpha` is in `$values`

#### condition.Is_Null

```
["condition.Is_Null", $alpha]
```

Returns `True` if `$alpha` is `null`

#### condition.Is_True

```
["condition.Is_True", $alpha]
```

Returns `True` if `$alpha` is `True`

#### condition.Less_Than

```
["condition.Less_Than", $alpha, $beta]
```

Returns `True` if and only if `$alpha` is less than `$beta`.

#### condition.Less_Than_Equal

```
["condition.Less_Than_Equal", $alpha, $beta]
```

Returns `True` if and only if `$alpha` is less than or equal to `$beta`.

### String operations

Some basic string operations

#### string.Concat

```
["string.Concat", $link, $argument1, $argument2, ..]
```

Concatenate arguments by `$link`

#### string.Concat_Fields

```
["string.Concat_Fields", $link, $key1, $key2, ..]
```

A short hand for

```
["string.Concat", $link, ["string.Field", $key1], ["string.Field", $key2], ...]
```

Note: `$key1`, `$key2` etc.

#### string.Lower

```
["string.Lower", $value]
```

Change `$value` to lowercase
