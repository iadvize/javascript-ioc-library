const {
  Kernel,
  decorate,
  injectable,
  inject
} = require('inversify');
const _ = require('lodash');
require('reflect-metadata');

function Registry() {
  const symbols = {}; // {'lowercasefeature': Symbol}
  const kernel = new Kernel();

  const getArgs = (function() {
    // extracted from angular
    const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    const FN_ARG_SPLIT = /,/;
    const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

    return function annotate(fn) {
      var $inject
      if (!($inject = fn.$inject)) {
        $inject = [];
        const fnText = fn.toString().replace(STRIP_COMMENTS, '');
        const argDecl = fnText.match(FN_ARGS);
        _.forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
          arg.replace(FN_ARG, function(all, underscore, name) {
            $inject.push(name);
          });
        });
      }

      return $inject;
    }
  })();

  // kernel.applyMiddleware(function logger(next) {
  //   return (context) => {
  //     let result = next(context);
  //     // console.log("CONTEXT: ", context);
  //     // console.log("RESULT: ", result);
  //     return result;
  //   };
  // });

  return {
    kernel: kernel,

    addCoreConstantValue(name, instance) {
      const valueName = name.toLowerCase();
      if (_.has(symbols, valueName)) {
        throw new Error(`Something called "${valueName}" already exists!`);
      }
      symbols[valueName] = valueName;

      // console.dir(kernel.bind(symbol).__proto__);
      /*
        to: [Function],
        toConstantValue: [Function],
        toDynamicValue: [Function],
        toConstructor: [Function],
        toFactory: [Function],
        toAutoFactory: [Function],
        toProvider: [Function] }
       */
      kernel.bind(valueName).toConstantValue(instance);
    },

    addCoreFeature(feature) {
      const featureName = feature.name.toLowerCase();

      if (_.has(symbols, featureName)) {
        throw new Error(`Something called "${featureName}" already exists!`);
      }
      symbols[featureName] = featureName;

      // Setup injectable
      decorate(injectable(), feature);

      // declare binding (extract constructor arguments)
      const deps = getArgs(feature);

      deps.forEach((dep, i) => {
        if (!_.has(symbols, dep)) {
          throw new Error(`Undeclared feature "${dep}"!`);
        }
        decorate(inject(dep), feature, i);
      });

      kernel.bind(featureName).to(feature).inSingletonScope();
    },

    addFeature(feature) {
      const featureName = feature.name.toLowerCase();

      if (_.has(symbols, featureName)) {
        throw new Error(`Something called "${featureName}" already exists!`);
      }
      symbols[featureName] = featureName;

      // Setup injectable
      decorate(injectable(), feature);

      // declare binding (extract constructor arguments)
      const deps = getArgs(feature);

      deps.forEach((dep, i) => {
        if (!_.has(symbols, dep)) {
          throw new Error(`Undeclared feature "${dep}"!`);
        }
        decorate(inject(dep), feature, i);
      });

      kernel.bind(featureName).to(feature).inSingletonScope();
    },

    getFeature(name) {
      const featureName = name.toLowerCase();
      if (!_.has(symbols, featureName)) {
        throw new Error(`The feature called "${featureName}" does not exist!`);
      }

      return kernel.get(symbols[featureName]);
    }
  };
}

module.exports = Registry;
