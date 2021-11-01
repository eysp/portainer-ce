import moment from 'moment';
import _ from 'lodash-es';

angular.module('portainer.docker').controller('LogViewerController', [
  'clipboard',
  'Blob',
  'FileSaver',
  function (clipboard, Blob, FileSaver) {
    this.state = {
      availableSinceDatetime: [
        { desc: '最近一天', value: moment().subtract(1, 'days').format() },
        { desc: '最近4小时', value: moment().subtract(4, 'hours').format() },
        { desc: '最近1小时', value: moment().subtract(1, 'hours').format() },
        { desc: '最近10分钟', value: moment().subtract(10, 'minutes').format() },
      ],
      copySupported: clipboard.supported,
      logCollection: true,
      autoScroll: true,
      wrapLines: true,
      search: '',
      filteredLogs: [],
      selectedLines: [],
    };

    this.copy = function () {
      clipboard.copyText(this.state.filteredLogs.map((log) => log.line));
      $('#refreshRateChange').show();
      $('#refreshRateChange').fadeOut(2000);
    };

    this.copySelection = function () {
      clipboard.copyText(this.state.selectedLines);
      $('#refreshRateChange').show();
      $('#refreshRateChange').fadeOut(2000);
    };

    this.clearSelection = function () {
      this.state.selectedLines = [];
    };

    this.selectLine = function (line) {
      var idx = this.state.selectedLines.indexOf(line);
      if (idx === -1) {
        this.state.selectedLines.push(line);
      } else {
        this.state.selectedLines.splice(idx, 1);
      }
    };

    this.downloadLogs = function () {
      const data = new Blob([_.reduce(this.state.filteredLogs, (acc, log) => acc + '\n' + log.line, '')]);
      FileSaver.saveAs(data, this.resourceName + '_logs.txt');
    };
  },
]);
