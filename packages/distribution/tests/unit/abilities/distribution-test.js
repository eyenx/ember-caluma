import { settled } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import DistributionService from "@projectcaluma/ember-distribution/services/distribution";
import {
  createBlueprint,
  createCase,
  createInquiry,
} from "@projectcaluma/ember-testing/scenarios/distribution";

module("Unit | Ability | distribution", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    createBlueprint(this.server);

    this.case = createCase(this.server, { group: { id: "1" } });
    this.owner.lookup("service:caluma-options").currentGroupId = 1;
    this.owner.register(
      "service:distribution",
      class DistributionServiceMock extends DistributionService {
        @tracked caseId;
      }
    );

    const service = this.owner.lookup("service:distribution");
    service.caseId = this.case.id;
    await service.controls;
  });

  test("it computes send inquiries permission", async function (assert) {
    const ability = this.owner.lookup("ability:distribution");

    assert.false(ability.canSendInquiries);

    createInquiry(this.server, this.case, {
      from: { id: "1" },
      to: { id: "2" },
    });

    // remove cached query from the store and trigger refetch
    this.owner.lookup("service:apollo").client.resetStore();
    await settled();

    assert.true(ability.canSendInquiries);
  });

  test("it computes create inquiry permission", async function (assert) {
    const ability = this.owner.lookup("ability:distribution");

    assert.true(ability.canCreateInquiry);

    this.case.workItems
      .filter((w) => w.taskId === "create-inquiry")
      .update("status", "COMPLETED");

    // remove cached query from the store and trigger refetch
    this.owner.lookup("service:apollo").client.resetStore();
    await settled();

    assert.false(ability.canCreateInquiry);
  });

  test("it computes complete permission", async function (assert) {
    const ability = this.owner.lookup("ability:distribution");

    assert.true(ability.canComplete);

    this.case.workItems
      .filter((w) => w.taskId === "complete-distribution")
      .update("status", "COMPLETED");

    // remove cached query from the store and trigger refetch
    this.owner.lookup("service:apollo").client.resetStore();
    await settled();

    assert.false(ability.canComplete);
  });

  test("it respects configured custom permissions", async function (assert) {
    const ability = this.owner.lookup("ability:distribution");

    this.owner.lookup("service:caluma-options").distribution = {
      permissions: {
        completeDistribution: () => false,
        createInquiry: () => false,
        sendInquiry: () => false,
      },
    };

    assert.false(ability.canComplete);
    assert.false(ability.canCreateInquiry);
    assert.false(ability.canSendInquiries);
  });
});
