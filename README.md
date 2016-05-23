# ruler
A rule dsl language parser in Javascript

## ruler DSL

The mini-language is very much inspired by LISP, as everything is represented by a list of string, including the function name. The main advantage of the language is that it is actually JSON.

### Syntax & Structure

```
["some.function_name", "some_arguments"]
```

A rule is usually consist of a function name, and a list of (sometimes optional) arguments. Function names are often namespaced (e.g. `"boolean.And"`, `"condition.Equal"` etc.) and usually only recognized if placed in the first elemnt.

Unless otherwise specified, a rule can be inserted as an argument to another rule, for example a `boolean.And` rule.

```
["boolean.And", ["condition.Equal", ["basic.Field", "fieldA"], "X"],
                ["condition.Equal", ["basic.Field", "fieldB"], "Y"]]
```

## Pre-requisite

* Underscore.js is needed

## Parsing and computing result

In order to parse the rule, just call `ruler.parse`. The result is a function where you can put in a context object in order for it to compute a result.

```
rule = ruler.parse(["condition.Equal", ["basic.Field", "fieldA"], "X"])
context = {"fieldA": "X"}
rule(context) // should yield true
```

## API overview

### Basic functions

Some random functions that don't fit anywhere else goes here

#### basic.Context

```
["basic.Context", $context_sub, $rule]
```

Temporarily change the context to `$context_sub`, and perform `$rule` with `$context_sub` as the new `context`

* `$context_sub` *(required)*: A struct, or a rule to extract a new struct w.r.t. the original `context`
* `$rule` *(required)*: the rule to be applied w.r.t. `$context_sub`

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

* `$key` *(required)*: is a `key` in the `context`.
* `$default` *(optional)*: is a default value to be returned when `context[key]` does not exist.

#### basic.Value

```
["basic.Value", $value]
```

Returns a value, regardless what is in the `context`

* `$value` *(required)*: a value to return. **MAY NOT** be a sub-rule

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
