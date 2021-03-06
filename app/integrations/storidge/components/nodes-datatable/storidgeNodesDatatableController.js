angular.module('portainer.integrations.storidge').controller('StoridgeNodesDatatableController', [
  '$scope',
  '$controller',
  'clipboard',
  'Notifications',
  'StoridgeNodeService',
  'DatatableService',
  function ($scope, $controller, clipboard, Notifications, StoridgeNodeService, DatatableService) {
    angular.extend(this, $controller('GenericDatatableController', { $scope: $scope }));

    var ctrl = this;

    this.addNodeAction = function () {
      StoridgeNodeService.add()
        .then(function sucess(data) {
          ctrl.addInfo = data.content;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索“添加节点”命令');
        });
    };

    this.copyAddNodeCommand = function () {
      clipboard.copyText(ctrl.addInfo);
      $('#copyNotification').show();
      $('#copyNotification').fadeOut(2000);
    };

    this.$onInit = function () {
      this.setDefaults();
      this.prepareTableFromDataset();

      this.state.orderBy = this.orderBy;
      var storedOrder = DatatableService.getDataTableOrder(this.tableKey);
      if (storedOrder !== null) {
        this.state.reverseOrder = storedOrder.reverse;
        this.state.orderBy = storedOrder.orderBy;
      }

      var textFilter = DatatableService.getDataTableTextFilters(this.tableKey);
      if (textFilter !== null) {
        this.state.textFilter = textFilter;
        this.onTextFilterChange();
      }

      var storedFilters = DatatableService.getDataTableFilters(this.tableKey);
      if (storedFilters !== null) {
        this.filters = storedFilters;
      }
      if (this.filters && this.filters.state) {
        this.filters.state.open = false;
      }

      var storedSettings = DatatableService.getDataTableSettings(this.tableKey);
      if (storedSettings !== null) {
        this.settings = storedSettings;
        this.settings.open = false;
      }
      this.onSettingsRepeaterChange();
    };
  },
]);
