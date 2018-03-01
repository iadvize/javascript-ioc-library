javascript-ioc-library [![CircleCI](https://circleci.com/gh/iadvize/javascript-ioc-library/tree/master.svg?style=svg)](https://circleci.com/gh/iadvize/javascript-ioc-library/tree/master)
======================

iAdvize Inversion of Control container.

## Examples

```js
registry.addCoreFeature('MyCoreFeature', [function() {

  // return public API
  return {
    method: function(){
      return Math.random() > 0.5;
    }
  };
}]);

registry.addCoreFeature('MyCoreFeature2', ['MyCoreFeature', function(MyCoreFeature2) {

  // return public API
  return {
    method: function(){
      return MyCoreFeature2.method();
    }
  };
}]);
```

## Install

```bash
npm install iadvize-ioc-library -S
```

## Documentation

### Creating a registry

To declare a new registry do :

```js
const registry = Registry();
```

## Contribute

Look at contribution guidelines here : [CONTRIBUTING.md](CONTRIBUTING.md)
