const path = require("path");
const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

module.exports = withModuleFederationPlugin({
  name: "leave-management-system",

  exposes: {
    "./Routes": "./src/app/app.routes.ts",
  },

  shared: {
    ...shareAll({
      singleton: false, // Match RRF/Shell default
      strictVersion: false,
      requiredVersion: false,
    }),
    "@clarium/ezui-blocks": {
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    },
    "@clarium/ezui-services": {
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    },
    "@clarium/ngce-charts": {
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    },
    "@clarium/ngce-components": {
      singleton: false, // Match Shell config
      strictVersion: false,
      requiredVersion: false,
    },
  },
});
