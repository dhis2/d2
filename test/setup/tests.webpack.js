const context = require.context('../e2e', true, /_spec\.js$/);
context.keys().forEach(context);
