# ruler
A rule dsl language parser in Javascript

## ruler DSL

The mini-language is very much inspired by LISP, as everything is represented by a list of string, including the function name. The main advantage of the language is that it is actually JSON.

### Structure

Considering the following example (which is a valid JSON),

```
["condition.Equal", "fieldA", "X"]
```

Practically it is equivalent to the following Javascript snippet

```
function(context) {
    return context["fieldA"] == "X"
}
```

So the first element of the list is the function name, if it isn't then the parser will treat it as a normal list. The rest of the elements depends on the function signature, and each function may require different values to be passed in.

### Chaining multiple rules

The rules can be chained together, for example by an `boolean.And` rule.

```
["boolean.And", ["condition.Equal", "fieldA", "X"],
                ["condition.Equal", "fieldB", "Y"]]
```

## Pre-requisite

* Underscore.js is needed

## Parsing and computing result

In order to parse the rule, just call `ruler.parse`. The result is a function where you can put in a context object in order for it to compute a result.

```
func = ruler.parse(["condition.Equal", "fieldA", "X"])
context = {"fieldA": "X"}
func(context) // should yield true
```

## API overview

### Basic functions

Some random functions that don't fit anywhere else goes here

```
["basic.Field", "field_name"]
```
Fetch the value of a specified field (named `field_name` in this example) from context object.

### Boolean operators

Usually used to chain condition rules (see next section) together

```
["boolean.And", [<rule 1>], [<rule 2>], ...]
```
Returns true if all the defined rules return true.

```
["boolean.Or", [<rule 1>], [<rule 2>], ...]
```
Returns true if at least one of the rules is true

```
["boolean.Not", [<rule 1>]]
```
Negates the result of given rule

```
["boolean.Tautology"]
```
Returns true regardless

### Condition rules

Usually returns either true or false

```
["condition.Equal", "key", "value"]
```
Returns true if `context["key"]` equals `"value"`

```
["condition.In", "key", ["list", "of", "values"]]
```
Returns true if `context["key"]` is in `["list", "of", "values"]`

```
["condition.Is_Null", "key"]
```
Returns true if `context["key"]` is null

```
["condition.Is_True", "key"]
```
Returns true if `context["key"]` is true

### String operations

Some basic string operations

```
["string.Concat", "<separator>", "value1", "value2", ...]
```
Concatenate strings together, the above example yields `"value1<separator>value2<separator>..."`

```
["string.Concat_Fields", "<separator>", "key1", "key2", ...]
```
Concatenate values in `context` together by taking the values of `context["key1"]`, `context["key2"]` etc. together, separated by "<separator>". 

Note: This is a shorthand of `["string.Concat", "<separator>", ["basic.Field", "key1"], ["basic.Field", "key2"], ..]`

```
["string.Lower", "VALUE"]
```
Change `"VALUE"` ro lowercase `"value"`.

Note: `"VALUE"` can be replaced by a rule, e.g. `["string.Lower", ["basic.Field", "key1"]]`
