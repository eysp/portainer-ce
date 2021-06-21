import bootbox from 'bootbox';

angular.module('portainer.app').factory('ModalService', [
  '$sanitize',
  function ModalServiceFactory($sanitize) {
    'use strict';
    var service = {};

    var applyBoxCSS = function (box) {
      box.css({
        top: '50%',
        'margin-top': function () {
          return -(box.height() / 2);
        },
      });
    };

    var confirmButtons = function (options) {
      var buttons = {
        confirm: {
          label: $sanitize(options.buttons.confirm.label),
          className: $sanitize(options.buttons.confirm.className),
        },
        cancel: {
          label: options.buttons.cancel && options.buttons.cancel.label ? $sanitize(options.buttons.cancel.label) : '取消',
        },
      };
      return buttons;
    };

    service.enlargeImage = function (image) {
      image = $sanitize(image);
      bootbox.dialog({
        message: '<img src="' + image + '" style="width:100%" />',
        className: 'image-zoom-modal',
        onEscape: true,
      });
    };

    service.confirm = function (options) {
      var box = bootbox.confirm({
        title: options.title,
        message: options.message,
        buttons: confirmButtons(options),
        callback: options.callback,
      });
      applyBoxCSS(box);
    };

    function prompt(options) {
      var box = bootbox.prompt({
        title: options.title,
        inputType: options.inputType,
        inputOptions: options.inputOptions,
        buttons: confirmButtons(options),
        callback: options.callback,
      });
      applyBoxCSS(box);
    }

    function customPrompt(options, optionToggled) {
      var box = bootbox.prompt({
        title: options.title,
        inputType: options.inputType,
        inputOptions: options.inputOptions,
        buttons: confirmButtons(options),
        callback: options.callback,
      });
      applyBoxCSS(box);
      box.find('.bootbox-body').prepend('<p>' + options.message + '</p>');
      box.find('.bootbox-input-checkbox').prop('checked', optionToggled);
    }

    service.confirmAccessControlUpdate = function (callback) {
      service.confirm({
        title: '你确定吗 ？',
        message: '更改此资源的所有权可能会将其管理限制为某些用户。',
        buttons: {
          confirm: {
            label: '更改所有权',
            className: 'btn-primary',
          },
        },
        callback: callback,
      });
    };

    service.confirmImageForceRemoval = function (callback) {
      service.confirm({
        title: '你确定吗 ？',
        message: '强制移除镜像将删除该镜像，即使它有多个标签或者被停止的容器使用。',
        buttons: {
          confirm: {
            label: '删除镜像',
            className: 'btn-danger',
          },
        },
        callback: callback,
      });
    };

    service.cancelRegistryRepositoryAction = function (callback) {
      service.confirm({
        title: '你确定吗 ？',
        message: '警告：在此操作完成之前中断此操作将导致所有标签丢失。 你确定要这么做吗？',
        buttons: {
          confirm: {
            label: '停止',
            className: 'btn-danger',
          },
        },
        callback: callback,
      });
    };

    service.confirmDeletion = function (message, callback) {
      message = $sanitize(message);
      service.confirm({
        title: '你确定吗 ？',
        message: message,
        buttons: {
          confirm: {
            label: '删除',
            className: 'btn-danger',
          },
        },
        callback: callback,
      });
    };

    service.confirmContainerDeletion = function (title, callback) {
      prompt({
        title: title,
        inputType: 'checkbox',
        inputOptions: [
          {
            text: '自动删除非持久存储卷<i></i>',
            value: '1',
          },
        ],
        buttons: {
          confirm: {
            label: '删除',
            className: 'btn-danger',
          },
        },
        callback: callback,
      });
    };

    service.confirmContainerRecreation = function (callback) {
      customPrompt(
        {
          title: '你确定吗 ？',
          message:
            "您将要重新创建此容器，任何非持久化数据都将丢失。 这个容器将被删除，另一个将使用相同的配置创建。",
          inputType: 'checkbox',
          inputOptions: [
            {
              text: '拉取最新镜像<i></i>',
              value: '1',
            },
          ],
          buttons: {
            confirm: {
              label: '重新创建',
              className: 'btn-danger',
            },
          },
          callback: callback,
        },
        false
      );
    };

    service.confirmEndpointSnapshot = function (callback) {
      service.confirm({
        title: '你确定吗 ？',
        message: '触发手动刷新将轮询每个端点以检索其信息，这可能需要一些时间。',
        buttons: {
          confirm: {
            label: '继续',
            className: 'btn-primary',
          },
        },
        callback: callback,
      });
    };

    service.confirmImageExport = function (callback) {
      service.confirm({
        title: 'Caution',
        message: '导出可能需要几分钟，在导出过程中不要离开此页面。',
        buttons: {
          confirm: {
            label: '继续',
            className: 'btn-primary',
          },
        },
        callback: callback,
      });
    };

    service.confirmServiceForceUpdate = function (message, callback) {
      customPrompt(
        {
          title: '你确定吗 ？',
          message: message,
          inputType: 'checkbox',
          inputOptions: [
            {
              text: '拉取最新的镜像版本<i></i>',
              value: '1',
            },
          ],
          buttons: {
            confirm: {
              label: '更新',
              className: 'btn-primary',
            },
          },
          callback: callback,
        },
        false
      );
    };

    return service;
  },
]);
