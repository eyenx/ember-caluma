import { inject as service } from "@ember/service";
import { Ability } from "ember-can";

import config from "@projectcaluma/ember-distribution/config";

export default class InquiryAbility extends Ability {
  @service calumaOptions;

  @config config;

  get canEdit() {
    return (
      !this.config.ui.readonly &&
      this.model?.task.slug === this.config.inquiry.task &&
      this.model?.status === "SUSPENDED" &&
      this.model?.controllingGroups
        .map(String)
        .includes(String(this.calumaOptions.currentGroupId))
    );
  }

  get canSend() {
    return this.config.permissions.sendInquiry?.(this.model) ?? true;
  }

  get canWithdraw() {
    return this.config.permissions.withdrawInquiry?.(this.model) ?? true;
  }

  get canAnswer() {
    return (
      !this.config.ui.readonly &&
      this.model?.task.slug === this.config.inquiry.task &&
      this.model?.status === "READY" &&
      this.model?.addressedGroups
        .map(String)
        .includes(String(this.calumaOptions.currentGroupId))
    );
  }

  get canEditAnswerForm() {
    return (
      !this.config.ui.readonly &&
      this.canAnswer &&
      this.model?.childCase.workItems.edges.some(
        (edge) => edge.node.task.__typename === "CompleteWorkflowFormTask"
      )
    );
  }

  get canCompleteChildWorkItem() {
    return (
      this.config.permissions.completeInquiryChildWorkItem?.(
        this.model,
        this.task
      ) ?? true
    );
  }
}
