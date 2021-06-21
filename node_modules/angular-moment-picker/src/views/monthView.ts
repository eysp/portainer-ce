import * as angular from 'angular';
import * as moment from 'moment';
import { IView, IViewItem, IDirectiveScopeInternal, IModelController } from '../definitions';
import { IProviderOptions } from '../provider';
import { isValidMoment } from '../utility';

export default class MonthView implements IView {
	public perLine: number = moment.weekdays().length;
	public rows: { [index: number]: IViewItem[] } = [];
	public headers: string[];

	constructor(
		private $scope: IDirectiveScopeInternal,
		private $ctrl: IModelController,
		private provider: IProviderOptions) { }

	public render(): string {
		let month: number                         = this.$scope.view.moment.month(),
			day: moment.Moment                    = this.$scope.view.moment.clone().startOf('month').startOf('week').hour(12),
			rows: { [week: number]: IViewItem[] } = {},
			firstWeek: number                     = day.week(),
			lastWeek: number                      = firstWeek + 5;

		this.rows = [];
		for (let week = firstWeek; week <= lastWeek; week++)
			rows[week] = Array.apply(null, Array(this.perLine)).map(() => {
				let selectable = this.$scope.limits.isSelectable(day, 'day');
				let date = <IViewItem>{
					index: day.date(),
					label: day.format(this.provider.daysFormat),
					year: day.year(),
					month: day.month(),
					date: day.date(),
					class: [
						this.$scope.keyboard && day.isSame(this.$scope.view.moment, 'day') ? 'highlighted' : '',
						!!this.$scope.today && day.isSame(new Date(), 'day') ? 'today' : '',
						!selectable || day.month() != month ? 'disabled' : isValidMoment(this.$ctrl.$modelValue) && day.isSame(this.$ctrl.$modelValue, 'day') ? 'selected' : ''
					].join(' ').trim(),
					selectable: selectable
				};
				day.add(1, 'days');
				return date;
			});
		// object to array - see https://github.com/indrimuska/angular-moment-picker/issues/9
		angular.forEach(rows, (row: IViewItem[]) => (<IViewItem[][]>this.rows).push(row));
		// render headers
		this.headers = moment.weekdays().map((d: string, i: number) => moment().locale(this.$scope.locale).startOf('week').add(i, 'day').format('dd'));
		// return title
		return this.$scope.view.moment.format('MMMM YYYY');
	}
	
	public set(day: IViewItem): void {
		if (!day.selectable) return;
		this.$scope.view.moment.year(day.year).month(day.month).date(day.date);
		this.$scope.view.update();
		this.$scope.view.change('day');
	}
}