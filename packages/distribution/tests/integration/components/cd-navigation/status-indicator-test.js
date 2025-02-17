import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

module(
  "Integration | Component | cd-navigation/status-indicator",
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.type = "controlling";
      this.inquiry = inquiry();
    });

    test("it renders a status indicator", async function (assert) {
      await render(
        hbs`<CdNavigation::StatusIndicator @inquiry={{this.inquiry}} @type={{this.type}} />`
      );

      assert.dom("[uk-icon]").hasClass("uk-text-success");
      assert.dom("[uk-icon]").hasAttribute("icon", "check");
      assert.dom("[uk-icon]").hasAttribute("title", "Positive");
    });

    test("it renders an indicator if deadline is overdue or in warning period", async function (assert) {
      await this.inquiry.setReady();

      const warningDeadline = DateTime.now().plus({ days: 2 });
      const overdueDeadline = DateTime.now().minus({ days: 2 });

      await render(
        hbs`<CdNavigation::StatusIndicator @inquiry={{this.inquiry}} @type={{this.type}} />`
      );

      assert.dom("[uk-icon][icon=clock]").doesNotExist();

      await this.inquiry.setDeadline(warningDeadline.toISODate());

      const intl = this.owner.lookup("service:intl");

      assert.dom("[uk-icon][icon=clock].uk-text-warning").exists();
      assert
        .dom("[uk-icon][icon=clock]")
        .hasAttribute("title", intl.formatDate(warningDeadline.toJSDate()));

      await this.inquiry.setDeadline(overdueDeadline.toISODate());

      assert.dom("[uk-icon][icon=clock].uk-text-danger").exists();
      assert
        .dom("[uk-icon][icon=clock]")
        .hasAttribute("title", intl.formatDate(overdueDeadline.toJSDate()));
    });
  }
);
