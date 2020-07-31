import _ from "lodash";

if (typeof Object.create !== "function") {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

var ruler = Object.create(null);

ruler._get = function (name) {
  return ruler.library._mappings[ruler.name_add_prefix(name)];
};

ruler.name_add_prefix = function (alias) {
  return "ruler.".concat(alias);
};

ruler.library = { _mappings: {} };
ruler.library.register = function (alias, func) {
  ruler.library._mappings[ruler.name_add_prefix(alias)] = func;

  return func;
};

ruler.library.compute = function (arg, context) {
  return _.isFunction(arg) ? arg(context) : arg;
};

ruler.parse = function parse(sequence, _result) {
  let result = _result || [];
  let to_return = null;

  if (sequence.length > 0) {
    if (_.isArray(_.head(sequence))) {
      to_return = parse(
        _.tail(sequence),
        result.concat([parse(_.head(sequence))])
      );
    } else if (
      _.has(ruler.library._mappings, ruler.name_add_prefix(_.head(sequence)))
    ) {
      to_return = parse(
        _.tail(sequence),
        result.concat([
          ruler.library._mappings[ruler.name_add_prefix(_.head(sequence))],
        ])
      );
    } else {
      to_return = parse(_.tail(sequence), result.concat(_.head(sequence)));
    }
  } else {
    if (_.isFunction(_.head(result))) {
      to_return = _.head(result).apply(this, _.tail(result));
    } else {
      to_return = result;
    }
  }

  return to_return;
};

ruler.library.register("array.Length", (arg) => {
  return function (context) {
    return ruler.library.compute(arg, context).length;
  };
});

ruler.library.register("basic.Context", function (context_sub, arg) {
  return function (context) {
    return ruler.library.compute(
      arg,
      ruler.library.compute(context_sub, context)
    );
  };
});

ruler.library.register("basic.Field", function (key) {
  var _arguments = arguments;

  return function (context) {
    return _.tail(_arguments)
      ? context[ruler.library.compute(key, context)] ||
          ruler.library.compute(_.first(_.tail(_arguments)), context)
      : context[ruler.library.compute(key, context)];
  };
});

ruler.library.register("basic.Value", function (value) {
  return function () {
    return value;
  };
});

ruler.library.register("boolean.And", function () {
  var args = arguments;
  return function (context) {
    return _.reduce(
      args,
      function (result, incoming) {
        return result && ruler.library.compute(incoming, context);
      },
      true
    );
  };
});

ruler.library.register("boolean.Contradiction", function () {
  return function () {
    return false;
  };
});

ruler.library.register("boolean.Or", function () {
  var args = arguments;
  return function (context) {
    return _.reduce(
      args,
      function (result, incoming) {
        return result || ruler.library.compute(incoming, context);
      },
      false
    );
  };
});

ruler.library.register("boolean.Not", function (arg) {
  return function (context) {
    return !ruler.library.compute(arg, context);
  };
});

ruler.library.register("boolean.Tautology", function () {
  return function () {
    return true;
  };
});

ruler.library.register("condition.Equal", function (alpha, beta) {
  return function (context) {
    return _.isEqual(
      ruler.library.compute(alpha, context),
      ruler.library.compute(beta, context)
    );
  };
});

ruler.library.register("condition.Greater_Than", function (alpha, beta) {
  return function (context) {
    return (
      ruler.library.compute(alpha, context) >
      ruler.library.compute(beta, context)
    );
  };
});

ruler.library.register("condition.Greater_Than_Equal", function (alpha, beta) {
  return function (context) {
    return (
      ruler.library.compute(alpha, context) >=
      ruler.library.compute(beta, context)
    );
  };
});

ruler.library.register("condition.In", function (alpha, values) {
  return function (context) {
    return _.includes(values, ruler.library.compute(alpha, context));
  };
});

ruler.library.register("condition.Is_Null", function (alpha) {
  return function (context) {
    return _.isNull(ruler.library.compute(alpha, context));
  };
});

ruler.library.register("condition.Is_True", function (alpha) {
  return function (context) {
    return ruler.library.compute(alpha, context) === true;
  };
});

ruler.library.register("condition.Less_Than", function (alpha, beta) {
  return function (context) {
    return (
      ruler.library.compute(alpha, context) <
      ruler.library.compute(beta, context)
    );
  };
});

ruler.library.register("condition.Less_Than_Equal", function (alpha, beta) {
  return function (context) {
    return (
      ruler.library.compute(alpha, context) <=
      ruler.library.compute(beta, context)
    );
  };
});

ruler.library.register("string.Concat", function (link) {
  var values = _.tail(arguments);

  return function (context) {
    return _.map(values, function (value) {
      return ruler.library.compute(value, context);
    }).join(ruler.library.compute(link, context));
  };
});

ruler.library.register("string.Concat_Fields", function (link) {
  var keys = _.tail(arguments);

  return ruler._get("string.Concat").apply(
    this,
    [link].concat(
      _.map(keys, function (key) {
        return ruler._get("basic.Field").call(this, key);
      })
    )
  );
});

ruler.library.register("string.Lower", function (value) {
  return function (context) {
    return ruler.library.compute(value, context).toLowerCase();
  };
});

export default ruler;
