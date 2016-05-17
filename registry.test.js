const t = require('chai').assert;

describe('registry', () => {
  const Registry = require('./registry');
  it('should support singleton on feature', () => {
    const registry = Registry();

    const sharedcomponents = {
      sharedcomponents: true
    };

    registry.addCoreConstantValue('Sharedcomponents', sharedcomponents);

    let profileInit = 0;
    registry.addFeature('Profile', ['Sharedcomponents', function Profile(a) {
      profileInit++;
      t.strictEqual(a, sharedcomponents);
      return {
        profilePanel: true
      };
    }]);

    t.strictEqual(registry.getFeature('profile'), registry.getFeature('profile'));
    t.strictEqual(profileInit, 1);
  });
});
