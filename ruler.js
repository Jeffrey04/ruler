var ruler = {library: {_mappings: {}}}

ruler._get = function(name) {
    return ruler.library._mappings[ruler.name_add_prefix(name)]
}

ruler.name_add_prefix = function(alias) {
    return 'ruler.'.concat(alias)
}

ruler.parse = function parse(sequence, _result) {
    result = _result || []
    to_return = null

    if(sequence.length > 0) {
        if(_.isArray(_.head(sequence))) {
            to_return = parse(_.tail(sequence), result.concat([parse(_.head(sequence))]))
        } else if(_.has(ruler.library._mappings, ruler.name_add_prefix(_.head(sequence)))) {
            to_return = parse(_.tail(sequence), result.concat([ruler.library._mappings[ruler.name_add_prefix(_.head(sequence))]]))
        } else {
            to_return = parse(_.tail(sequence), result.concat(_.head(sequence)))
        }
    } else {
        if(_.isFunction(_.head(result))) {
            to_return = _.head(result).apply(this, _.tail(result))
        } else {
            to_return = result
        }
    }

    return to_return
}

ruler.library._mappings = {}
ruler.library.register = function(alias, func) {
    ruler.library._mappings[ruler.name_add_prefix(alias)] = func

    return func
}

ruler.library.register('basic.Field', function(key) {
    return function(context) {
        return context[key]
    }
})

ruler.library.register('boolean.And', function() {
    var args = arguments
    return function(context) {
        return _.reduce(args,
                        function(result, incoming) {
                            return result && incoming(context)
                        },
                        true)
    }
})

ruler.library.register('boolean.Or', function() {
    var args = arguments
    return function(context) {
        return _.reduce(args,
                        function(result, incoming) {
                            return result || incoming(context)
                        },
                        false)
    }
})

ruler.library.register('boolean.Not', function(arg) {
    return function(context) {
        return ! arg(context)
    }
})

ruler.library.register('boolean.Tautology', function() {
    return function() { return true }
})

ruler.library.register('condition.Equal', function(key, value) {
    return function(context) {
        return context[key] == value
    }
})

ruler.library.register('condition.In', function(key, values) {
    return function(context) {
        return _.contains(values, context[key])
    }
})

ruler.library.register('condition.Is_Null', function(key) {
    return function(context) {
        return _.isNull(context[key])
    }
})

ruler.library.register('condition.Is_True', function(key) {
    return function(context) {
        return context[key] === true
    }
})

ruler.library.register('string.Concat', function(link) {
    var values = _.tail(arguments)

    return function(context) {
        return _.map(values,
                    function(value) {
                        return _.isFunction(value) ? value(context) : value
                    }).join(link)
    }
})

ruler.library.register('string.Concat_Fields', function(link) {
    var keys = _.tail(arguments)

    return ruler._get('string.Concat').apply(this, [link].concat(_.map(keys,
                                                         function(key) {
                                                             return ruler._get('basic.Field').call(key)
                                                         })))
})

ruler.library.register('string.Lower', function(value) {
    return function(context) {
        return _.isFunction(value) ? value(context).toLowerCase() : value.toLowerCase()
    }
})
