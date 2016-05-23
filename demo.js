(function() {

var demo = {
    basic: {
        Context: [
            function() {
                context = {sub: {foo: 'bar'}}
                rule = ruler.parse(['basic.Context', ['basic.Field', 'sub'],
                                                     ['basic.Field', 'foo']])
                return rule(context)
            }
        ],
        Field: [
            function() {
                context = {foo: 'bar'}
                rule = ruler.parse(['basic.Field', 'foo'])

                return rule(context)
            },
            function() {
                context = {baz: 'bar'}
                rule = ruler.parse(['basic.Field', 'foo', 'meow'])

                return rule(context)
            }
        ],
        Value: [
            function() {
                context = {foo: 'bar'}
                rule = ruler.parse(['basic.Value', 'meow'])

                return rule(context)
            }
        ]
    },
    boolean: {
        And: [
            function() {
                context = {}
                rule = ruler.parse(['boolean.And', ['basic.Value', true], ['basic.Value', false]])

                return rule(context)
            }
        ],
        Contradiction: [
            function() {
                context = {}
                rule = ruler.parse(['boolean.Contradiction'])

                return rule(context)
            }
        ],
        Not: [
            function() {
                context = {}
                rule = ruler.parse(['boolean.Not', ['basic.Value', false]])

                return rule(context)
            }
        ],
        Or: [
            function() {
                context = {}
                rule = ruler.parse(['boolean.Or', ['basic.Value', true], ['basic.Value', false]])

                return rule(context)
            }
        ],
        Tautology: [
            function() {
                context = {}
                rule = ruler.parse(['boolean.Tautology'])

                return rule(context)
            }
        ]
    },
    condition: {
        Equal: [
            function() {
                context = {foo: 'bar'}
                rule = ruler.parse(['condition.Equal', ['basic.Field', 'foo'], 'bar'])

                return rule(context)
            },
            function() {
                context = {foo: 'bar'}
                rule = ruler.parse(['condition.Equal', 'bar', ['basic.Field', 'foo']])

                return rule(context)
            },
            function() {
                context = {}
                rule = ruler.parse(['condition.Equal', 'bar', 'bar'])

                return rule(context)
            }
        ],
        In: [
            function() {
                context = {foo: 'bar'}
                rule = ruler.parse(['condition.In', ['basic.Field', 'foo'],
                                                    ['bar', 'baz']])

                return rule(context)
            },
            function() {
                context = {}
                rule = ruler.parse(['condition.In', 'bar',
                                                    ['bar', 'baz']])

                return rule(context)
            }
        ],
        Is_Null: [
            function() {
                context = {}
                rule = ruler.parse(['condition.Is_Null', null])

                return rule(context)
            },
            function() {
                context = {}
                rule = ruler.parse(['condition.Is_Null', ['basic.Value', null]])

                return rule(context)
            }
        ],
        Is_True: [
            function() {
                context = {}
                rule = ruler.parse(['condition.Is_True', true])

                return rule(context)
            },
            function() {
                context = {}
                rule = ruler.parse(['condition.Is_True', ['boolean.Tautology']])

                return rule(context)
            },
        ]
    },
    string: {
        Concat: [
            function() {
                context = {foo: 'hello', bar: 'world'}
                rule = ruler.parse(['string.Concat', ' ', ['basic.Field', 'foo'],
                                                          ['basic.Field', 'bar']])

                return rule(context)
            },
            function() {
                context = {link: ' ', bar: 'world'}
                rule = ruler.parse(['string.Concat', ['basic.Field', 'link'],
                                                     'hello',
                                                     ['basic.Field', 'bar']])

                return rule(context)
            },
            function() {
                context = {}
                rule = ruler.parse(['string.Concat', ' ', 'hello', 'world'])

                return rule(context)
            },
        ],
        Concat_Fields: [
            function() {
                context = {foo: 'hello', bar: 'world'}
                rule = ruler.parse(['string.Concat_Fields', ' ', 'foo', 'bar'])

                return rule(context)
            },
            function() {
                context = {link: ' ', foo: 'hello', bar: 'world'}
                rule = ruler.parse(['string.Concat_Fields', ['basic.Field', 'link'], 'foo', 'bar'])

                return rule(context)
            }
        ],
        Lower: [
            function() {
                context = {foo: 'HELLO'}
                rule = ruler.parse(['string.Lower', ['basic.Field', 'foo']])

                return rule(context)
            },
            function() {
                context = {}
                rule = ruler.parse(['string.Lower', 'HELLO'])

                return rule(context)
            },
        ]
    }
}

function widget_create_demo(func) {
    return $($.parseHTML('<pre class="demo"><code>' + func.toString() + '</code></pre>'))
}

function widget_create_result() {
    return $($.parseHTML('<pre class="result"><code></code></pre>'))
}

function widget_create_executor(func, result) {
    return $($.parseHTML('<button>Execute</button'))
            .click(function() {
                $('code', result)
                    .text('Result: ' + func())
            })
}

function page_initialize() {
    $('.namespace').each(function(_, namespace) {
        $('.function', namespace).each(function(_, name) {
            functions = demo[$(namespace).data('name')][$(name).data('name')]

            if(functions) {
                $.each(functions, function(_, func) {
                    result = widget_create_result()

                    $($.parseHTML('<div></div>'))
                        .append(widget_create_demo(func))
                        .append(widget_create_executor(func, result))
                        .append(result)
                        .insertAfter(name)
                })
            }
        })
    })
}

$(function() { page_initialize() })

})()
