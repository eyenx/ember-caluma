import Application from "@ember/application";
import loadInitializers from "ember-load-initializers";
import Resolver from "ember-resolver";

import config from "ember-caluma/config/environment";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;

  engines = {
    "@projectcaluma/ember-analytics": {
      dependencies: {
        services: ["apollo", "notification", "intl"],
      },
    },
    "@projectcaluma/ember-form-builder": {
      dependencies: {
        services: ["apollo", "notification", "intl", "caluma-options"],
      },
    },
    "@projectcaluma/ember-distribution": {
      dependencies: {
        services: ["apollo", "notification", "intl", "caluma-options", "store"],
      },
    },
  };
}

loadInitializers(App, config.modulePrefix);
