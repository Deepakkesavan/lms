const {
  shareAll,
  withModuleFederationPlugin,
} = require("@angular-architects/module-federation/webpack");

// CRITICAL: We need to modify the webpack config AFTER the plugin processes it
const config = withModuleFederationPlugin({
  name: "leave_management_system",
  
  filename: "remoteEntry.js",

  exposes: {
    "./App": "./src/bootstrap.ts",
    "./Routes": "./src/app/app.routes.ts",
  },

  shared: {
    ...shareAll({
      singleton: false,
      strictVersion: false,
      requiredVersion: false,
    }),
    
    "@angular/core": { 
      singleton: true, 
      strictVersion: false,
      requiredVersion: false,
    },
    "@angular/common": { 
      singleton: true, 
      strictVersion: false,
      requiredVersion: false,
    },
    "@angular/router": { 
      singleton: true, 
      strictVersion: false,
      requiredVersion: false,
    },
    "@angular/platform-browser": { 
      singleton: true, 
      strictVersion: false,
      requiredVersion: false,
    },
    "@angular/platform-browser-dynamic": { 
      singleton: true, 
      strictVersion: false,
      requiredVersion: false,
    },
    "@clarium/ezui-blocks": {
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
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    },
    "@clarium/ngce-icon": {
      singleton: true,
      strictVersion: false,
      requiredVersion: false,
    },
  },
});

// CRITICAL: Override output configuration to prevent import.meta
config.output = config.output || {};
config.output.scriptType = 'text/javascript';
config.output.environment = {
  ...config.output.environment,
  module: false, // Disable ES module output
};

// CRITICAL: Disable runtime chunk to prevent import.meta
config.optimization = config.optimization || {};
config.optimization.runtimeChunk = false;

// CRITICAL: Ensure library is set correctly
config.plugins = config.plugins || [];
config.plugins.forEach(plugin => {
  if (plugin.constructor.name === 'ModuleFederationPlugin') {
    plugin._options = plugin._options || {};
    plugin._options.library = {
      type: 'var',
      name: 'leave_management_system'
    };
  }
});

module.exports = config;