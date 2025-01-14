import { module, test } from "qunit";

import validateSlug from "@projectcaluma/ember-form-builder/validators/slug";

module("Unit | Validator | slug", function () {
  test("it validates", function (assert) {
    assert.expect(1);

    assert.true(validateSlug()("test", "test-slug-valid-123"));
  });

  test("it validates presence", function (assert) {
    assert.expect(2);

    assert.strictEqual(validateSlug()("test", ""), "Test can't be blank");
    assert.strictEqual(validateSlug()("test", null), "Test can't be blank");
  });

  test("it validates length", function (assert) {
    assert.expect(1);

    assert.strictEqual(
      validateSlug()("test", "x".repeat(128)),
      "Test is too long (maximum is 127 characters)"
    );
  });

  test("it validates format", function (assert) {
    assert.expect(2);

    assert.strictEqual(validateSlug()("test", "AA"), "Test is invalid");
    assert.strictEqual(validateSlug()("test", "#"), "Test is invalid");
  });
});
