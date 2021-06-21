import { IView, IViewItem, IDirectiveScopeInternal, IModelController } from '../definitions';
import { IProviderOptions } from '../provider';
import { isValidMoment } from '../utility';

export default class DayView implements IView {
	public perLine: number = 4;
	public rows: { [index: number]: IViewItem[] } = {};

	constructor(
		private $scope: IDirectiveScopeInternal,
		private $ctrl: IModelController,
		private provider: IProviderOptions) { }

	public render(): string {
		let hour = this.$scope.view.moment.clone().startOf('day').hour(this.provider.hoursStart);

		this.rows = {};
		for (let h = 0; h <= this.provider.hoursEnd - this.provider.hoursStart; h++) {
			let index = Math.floor(h / this.perLine),
				selectable = this.$scope.limits.isSelectable(hour, 'hour');

			if (!this.rows[index]) this.rows[index] = [];
			this.rows[index].push({
				index: h, // this is to prevent DST conflicts
				label: hour.format(this.provider.hoursFormat),
				year: hour.year(),
				month: hour.month(),
				date: hour.date(),
				hour: hour.hour(),
				class: [
					this.$scope.keyboard && hour.isSame(this.$scope.view.moment, 'hour') ? 'highlighted' : '',
					!selectable ? 'disabled' : isValidMoment(this.$ctrl.$modelValue) && hour.isSame(this.$ctrl.$modelValue, 'hour') ? 'selected' : ''
				].join(' ').trim(),
				selectable: selectable
			});
			hour.add(1, 'hours');
		}
		// return title
		return this.$scope.view.moment.format('LL');
	}

	public set(hour: IViewItem): void {
		if (!hour.selectable) return;
		this.$scope.view.moment.year(hour.year).month(hour.month).date(hour.date).hour(hour.hour);
		this.$scope.view.update();
		this.$scope.view.change('hour');
	}
}