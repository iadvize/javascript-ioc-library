# javascript-ioc-library

iAdvize Inversion of Control container (used in desk v3 #OHYEAH).


# npm

```
npm i iadvize-ioc-library -S
```

# create a registry

```js
const registry = Registry();
```

# define core feature

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

# [Changelog](/CHANGELOG.md)
