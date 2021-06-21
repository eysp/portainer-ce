Package.describe({
  name: 'angularutils:pagination',
  summary: 'Magical automatic pagination for anything in AngularJS',
  version: '0.11.1',
  git: 'https://github.com/michaelbromley/angularUtils-pagination'
});

Package.onUse(function(api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);

  api.use('angular:angular@1.4.0', 'client');

  api.addFiles('dirPagination.js', 'client');
});