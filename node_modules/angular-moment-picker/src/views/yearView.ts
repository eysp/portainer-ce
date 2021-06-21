import * as moment from 'moment';
import { IView, IViewItem, IDirectiveScopeInternal, IModelController } from '../definitions';
import { IProviderOptions } from '../provider';
import { isValidMoment } from '../utility';

class YearView implements IView {
	public perLine: number = 4;
	public rows: { [index: number]: IViewItem[] } = {};

	constructor(
		private $scope: IDirectiveScopeInternal,
		private $ctrl: IModelController,
		private provider: IProviderOptions) { }

	public render(): string {
		let month = this.$scope.view.moment.clone().startOf('year'),
			months = moment.monthsShort();

		this.rows = {};
		months.forEach((label, i) => {
			let index = Math.floor(i / this.perLine),
				selectable = this.$scope.limits.isSelectable(month, 'month');

			if (!this.rows[index]) this.rows[index] = [];
			this.rows[index].push(<IViewItem>{
				index: month.month(),
				label: month.format(this.provider.monthsFormat),
				year: month.year(),
				month: month.month(),
				class: [
					this.$scope.keyboard && month.isSame(this.$scope.view.moment, 'month') ? 'highlighted' : '',
					!selectable ? 'disabled' : isValidMoment(this.$ctrl.$modelValue) && month.isSame(this.$ctrl.$modelValue, 'month') ? 'selected' : ''
				].join(' ').trim(),
				selectable: selectable
			});
			month.add(1, 'months');
		});
		// return title
		return this.$scope.view.moment.format('YYYY');
	}

	public set(month: IViewItem): void {
		if (!month.selectable) return;
		this.$scope.view.moment.year(month.year).month(month.month);
		this.$scope.view.update();
		this.$scope.view.change('month');
	}
}

export default YearView;