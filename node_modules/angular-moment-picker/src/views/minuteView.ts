import * as angular from 'angular';
import { IView, IViewItem, IDirectiveScopeInternal, IModelController } from '../definitions';
import { IProviderOptions } from '../provider';
import { isValidMoment } from '../utility';

export default class MinuteView implements IView {
	public perLine: number = 6;
	public rows: { [index: number]: IViewItem[] } = {};

	constructor(
		private $scope: IDirectiveScopeInternal,
		private $ctrl: IModelController,
		private provider: IProviderOptions) { }

	public render(): string {
		let i = 0,
			second = this.$scope.view.moment.clone().startOf('minute').second(this.provider.secondsStart);

		this.rows = {};
		for (let s = 0; s <= this.provider.secondsEnd - this.provider.secondsStart; s += this.provider.secondsStep) {
			let index = Math.floor(i / this.perLine),
				selectable = this.$scope.limits.isSelectable(second, 'second');

			if (!this.rows[index]) this.rows[index] = [];
			this.rows[index].push(<IViewItem>{
				index: second.second(),
				label: second.format(this.provider.secondsFormat),
				year: second.year(),
				month: second.month(),
				date: second.date(),
				hour: second.hour(),
				minute: second.minute(),
				second: second.second(),
				class: [
					this.$scope.keyboard && second.isSame(this.$scope.view.moment, 'second') ? 'highlighted' : '',
					!selectable ? 'disabled' : isValidMoment(this.$ctrl.$modelValue) && second.isSame(this.$ctrl.$modelValue, 'second') ? 'selected' : ''
				].join(' ').trim(),
				selectable: selectable
			});
			i++;
			second.add(this.provider.secondsStep, 'seconds');
		}
		if (this.$scope.keyboard) this.highlightClosest();
		// return title
		return this.$scope.view.moment.clone().startOf('minute').format('lll');
	}

	public set(second: IViewItem): void {
		if (!second.selectable) return;
		this.$scope.view.moment.year(second.year).month(second.month).date(second.date).hour(second.hour).minute(second.minute).second(second.second);
		this.$scope.view.update();
		this.$scope.view.change();
	}

	public highlightClosest(): void {
		let seconds = <IViewItem[]>[], second;
		angular.forEach(this.rows, (row) => {
			angular.forEach(row, (value) => {
				if (Math.abs(value.second - this.$scope.view.moment.second()) < this.provider.secondsStep) seconds.push(value);
			});
		});
		second = seconds.sort((value1, value2) => {
			return Math.abs(value1.second - this.$scope.view.moment.second()) > Math.abs(value2.second - this.$scope.view.moment.second()) ? 1 : 0;
		})[0];
		if (!second || second.second - this.$scope.view.moment.second() == 0) return;
		this.$scope.view.moment.year(second.year).month(second.month).date(second.date).hour(second.hour).minute(second.minute).second(second.second);
		this.$scope.view.update();
		if (second.selectable) second.class = (second.class + ' highlighted').trim();
	}
}