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

  // kernel.applyMiddleware(function logger(next) {
  //   return (context) => {
  //     let result = next(context);
  //     // console.log("CONTEXT: ", context);
  //     // console.log("RESULT: ", result);
  //     return result;
  //   };
  // });
  //

  /**
   * [_addFeature description]
   * @param {String} name
   * @param {Array} feature
   */
  function _addFeature(name, featureDesc){
    const featureName = name.toLowerCase();

    if (_.has(symbols, featureName)) {
      throw new Error(`Something called "${featureName}" already exists!`);
    }
    symbols[featureName] = featureName;

    if(!_.isArray(featureDesc)){
      throw new Error(`f(name, featureDescription), featureDescription MUST be an array ending with a function`);
    }

    const feature = _.last(featureDesc);

    if(!_.isFunction(feature)){
      throw new Error(`f(name, featureDescription), featureDescription MUST ends with a function`);
    }

    // Setup injectable
    decorate(injectable(), feature);

    const deps = _.initial(featureDesc);

    deps.forEach((dep, i) => {
      if (!_.has(symbols, dep)) {
        throw new Error(`Undeclared feature "${dep}"!`);
      }
      decorate(inject(dep), feature, i);
    });

    kernel.bind(featureName).to(feature).inSingletonScope();
  }

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


    addFeature: _addFeature,
    addCoreFeature: _addFeature,

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
