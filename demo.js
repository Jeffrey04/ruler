import "https://code.jquery.com/jquery-3.6.0.min.js";

import ruler from "./ruler.js";

(function () {
  let evaluator = (rule, context) => {
    let rule_parsed = ruler.parse(rule);

    return rule_parsed(context);
  };

  let demo = {
    array: {
      Length: [
        {
          rule: ["array.Length", ["basic.Field", "list"]],
          context: { list: ["foo", "bar", "baz"] },
        },
      ],
    },
    basic: {
      Context: [
        {
          rule: [
            "basic.Context",
            ["basic.Field", "sub"],
            ["basic.Field", "foo"],
          ],
          context: { sub: { foo: "bar" } },
        },
      ],
      Field: [
        {
          rule: ["basic.Field", "foo"],
          context: { foo: "bar" },
        },
        {
          rule: ["basic.Field", "foo", "meow"],
          context: { baz: "bar" },
        },
      ],
      Value: [
        {
          rule: ["basic.Value", "meow"],
          context: { foo: "bar" },
        },
      ],
    },
    boolean: {
      And: [
        {
          rule: ["boolean.And", ["basic.Value", true], ["basic.Value", false]],
          context: {},
        },
      ],
      Contradiction: [
        {
          rule: ["boolean.Contradiction"],
          context: {},
        },
      ],
      Not: [
        {
          rule: ["boolean.Not", ["basic.Value", false]],
          context: {},
        },
      ],
      Or: [
        {
          rule: ["boolean.Or", ["basic.Value", true], ["basic.Value", false]],
          context: {},
        },
      ],
      Tautology: [
        {
          rule: ["boolean.Tautology"],
          context: {},
        },
      ],
    },
    condition: {
      Equal: [
        {
          rule: ["condition.Equal", ["basic.Field", "foo"], "bar"],
          context: { foo: "bar" },
        },
        {
          rule: ["condition.Equal", "bar", ["basic.Field", "foo"]],
          context: { foo: "bar" },
        },
        {
          rule: ["condition.Equal", "bar", "bar"],
          context: {},
        },
      ],
      Greater_Than: [
        {
          rule: ["condition.Greater_Than", 1, ["basic.Value", 2]],
          context: {},
        },
        {
          rule: ["condition.Greater_Than", ["basic.Value", 2], 1],
          context: {},
        },
      ],
      Greater_Than_Equal: [
        {
          rule: ["condition.Greater_Than_Equal", 1, 1],
          context: {},
        },
      ],
      In: [
        {
          rule: ["condition.In", ["basic.Field", "foo"], ["bar", "baz"]],
          context: { foo: "bar" },
        },
        {
          rule: ["condition.In", "bar", ["bar", "baz"]],
          context: {},
        },
      ],
      Is_Null: [
        {
          rule: ["condition.Is_Null", null],
          context: {},
        },
        {
          rule: ["condition.Is_Null", ["basic.Value", null]],
          context: {},
        },
      ],
      Is_True: [
        {
          rule: ["condition.Is_True", true],
          context: {},
        },
        {
          rule: ["condition.Is_True", ["boolean.Tautology"]],
          context: {},
        },
      ],
      Less_Than: [
        {
          rule: ["condition.Less_Than", 1, ["basic.Value", 2]],
          context: {},
        },
        {
          rule: ["condition.Less_Than", ["basic.Value", 2], 1],
          context: {},
        },
      ],
      Less_Than_Equal: [
        {
          rule: ["condition.Less_Than_Equal", 1, 1],
          context: {},
        },
      ],
    },
    string: {
      Concat: [
        {
          rule: [
            "string.Concat",
            " ",
            ["basic.Field", "foo"],
            ["basic.Field", "bar"],
          ],
          context: { foo: "hello", bar: "world" },
        },
        {
          rule: [
            "string.Concat",
            ["basic.Field", "link"],
            "hello",
            ["basic.Field", "bar"],
          ],
          context: { link: " ", bar: "world" },
        },
        {
          rule: ["string.Concat", " ", "hello", "world"],
          context: {},
        },
      ],
      Concat_Fields: [
        {
          rule: ["string.Concat_Fields", " ", "foo", "bar"],
          context: { foo: "hello", bar: "world" },
        },
        {
          rule: ["string.Concat_Fields", ["basic.Field", "link"], "foo", "bar"],
          context: { link: " ", foo: "hello", bar: "world" },
        },
      ],
      Lower: [
        {
          rule: ["string.Lower", ["basic.Field", "foo"]],
          context: { foo: "HELLO" },
        },
        {
          rule: ["string.Lower", "HELLO"],
          context: {},
        },
      ],
    },
  };

  function widget_create_demo(func) {
    return $(
      $.parseHTML(
        '<pre class="bg-light p-2"><code>' + func.toString() + "</code></pre>"
      )
    );
  }

  function widget_create_data(data) {
    return $(
      $.parseHTML(
        '<pre class="bg-light p-2"><code>' +
          JSON.stringify(data) +
          "</code></pre>"
      )
    );
  }

  function widget_create_result() {
    return $(
      $.parseHTML(
        '<pre class="bg-light p-2"><code>Press the "Evaluate" button to show result</code></pre>'
      )
    );
  }

  function widget_create_executor(example, result) {
    return $(
      $.parseHTML('<button class="btn btn-outline-primary">Evaluate</button')
    ).click(() =>
      $("code", result).text(
        "Result: " + evaluator(example.rule, example.context)
      )
    );
  }

  function page_initialize() {
    $("#evaluator").after(
      $($.parseHTML("<div></div>")).append(widget_create_demo(evaluator))
    );

    $(".namespace").each(function (_, namespace) {
      $(".function", namespace).each(function (_, name) {
        let functions =
          demo?.[$(namespace).data("name")]?.[$(name).data("name")];

        if (functions) {
          let list = $.map(functions, (example) => {
            let result = widget_create_result();

            return $($.parseHTML('<li class="card mb-3"></li>')).append(
              $($.parseHTML('<div class="card-body"></div>'))
                .append($.parseHTML("<h4>Rule</h4>"))
                .append(widget_create_data(example.rule))
                .append($.parseHTML("<h4>Context</h4>"))
                .append(widget_create_data(example.context))
                .append($.parseHTML("<h4>Result</h4>"))
                .append(result)
                .append(widget_create_executor(example, result))
            );
          });

          $(document.createElement("ul"))
            .addClass("p-0")
            .append(list)
            .insertAfter(name);
        }
      });
    });
  }

  $(function () {
    page_initialize();
  });
})();
