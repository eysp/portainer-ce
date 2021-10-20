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

    service.confirmWebEditorDiscard = confirmWebEditorDiscard;
    function confirmWebEditorDiscard() {
      const options = {
        title: '你确定吗 ？',
        message: '编辑器中当前有未保存的更改。你确定要离开吗？',
        buttons: {
          confirm: {
            label: '是的',
            className: 'btn-danger',
          },
        },
      };
      return new Promise((resolve) => {
        service.confirm({ ...options, callback: (confirmed) => resolve(confirmed) });
      });
    }

    service.confirmAsync = confirmAsync;
    function confirmAsync(options) {
      return new Promise((resolve) => {
        service.confirm({ ...options, callback: (confirmed) => resolve(confirmed) });
      });
    }

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
        message: '更改这个资源的所有权可能会将其管理限制为某些用户',
        buttons: {
          confirm: {
            label: '变更所有权',
            className: 'btn-primary',
          },
        },
        callback: callback,
      });
    };

    service.confirmImageForceRemoval = function (callback) {
      service.confirm({
        title: '你确定吗？',
        message: '强制删除镜像将删除镜像，即使该镜像有多个标记或被停止的容器使用。',
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
        title: '你确定吗？',
        message: '警告：在操作完成之前中断此操作将导致所有标签丢失。你确定要这样做吗？',
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

    service.confirmDeassociate = function (callback) {
      const message =
        '<p>解除此Edge环境的关联将其标记为非关联，并将清除已注册的EdgeID。</p>' +
        '<p>使用与此环境关联的Edge key启动的任何代理都将能够与此环境重新关联。</p>' +
        '<p>可以重复使用用于部署现有Edge代理的Edge ID和Edge密钥，以将新Edge设备与此环境关联。</p>';
      service.confirm({
        title: '关于解除关联',
        message: $sanitize(message),
        buttons: {
          confirm: {
            label: '解除关联',
            className: 'btn-primary',
          },
        },
        callback: callback,
      });
    };

    service.confirmUpdate = function (message, callback) {
      message = $sanitize(message);
      service.confirm({
        title: '你确定吗 ？',
        message: message,
        buttons: {
          confirm: {
            label: '更新',
            className: 'btn-warning',
          },
        },
        callback: callback,
      });
    };

    service.confirmRedeploy = function (message, callback) {
      message = $sanitize(message);
      service.confirm({
        title: '',
        message: message,
        buttons: {
          confirm: {
            label: '重新部署应用程序',
            className: 'btn-primary',
          },
          cancel: {
            label: "我稍后再做",
          },
        },
        callback: callback,
      });
    };

    service.confirmDeletionAsync = function confirmDeletionAsync(message) {
      return new Promise((resolve) => {
        service.confirmDeletion(message, (confirmed) => resolve(confirmed));
      });
    };

    service.confirmContainerDeletion = function (title, callback) {
      title = $sanitize(title);
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
          title: '你确定吗？',
          message:
            "您将要重新创建此容器，任何非持久化数据都将丢失。将删除此容器，并使用相同的配置创建另一个容器。",
          inputType: 'checkbox',
          inputOptions: [
            {
              text: '获取最新镜像<i></i>',
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
        title: '你确定吗？',
        message: '触发手动刷新将轮询每个环境以检索其信息，这可能需要一些时间。',
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
        title: '警告',
        message: '导出可能需要几分钟的时间，在导出过程中请勿离开。',
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
      message = $sanitize(message);
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
