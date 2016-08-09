const t = require('chai').assert;
const sinon = require('sinon');

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

  it('should throw an error if a dependency is declarared but not set as a parameter', () => {
    const registry = Registry();
    const handler = sinon.spy();
    registry.addCoreFeature('Dep', [handler]);
    t.throws(() => {
      registry.addFeature('Profile', ['Dep', function Profile() {}]);
    });
  });
});
