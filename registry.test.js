const t = require('chai').assert;

describe('registry', () => {
  const Registry = require('./registry');
  it('should support singleton on feature', () => {
    const registry = Registry();

    const _sharedcomponents = {
      _sharedcomponents: true
    };

    registry.addCoreConstantValue('sharedcomponents', _sharedcomponents);

    // registry.addCoreConstantValue('sharedcomponents', _sharedcomponents);

    let profileInit = 0;
    registry.addFeature(function Profile(sharedcomponents) {
      profileInit++;
      t.strictEqual(sharedcomponents, _sharedcomponents);

      return {
        profilePanel: true
      };
    });

    t.strictEqual(registry.getFeature('profile'), registry.getFeature('profile'));
    t.strictEqual(profileInit, 1);
  });
});
