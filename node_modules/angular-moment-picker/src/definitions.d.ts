import * as angular from 'angular';
import * as moment from 'moment';
import { IProviderOptions } from './provider';

export type ViewString = 'decade' | 'year' | 'month' | 'day' | 'hour' | 'minute';

export type Value = string | number;

export type Position = 'top left' | 'top right' | 'bottom left' | 'bottom right';

export interface IDirectiveScope extends ng.IScope {
	value?: Value;
	model?: moment.Moment;
	locale?: string;
	format?: string;
	minView?: ViewString;
	maxView?: ViewString;
	startView?: ViewString;
	minDate?: Value;
	maxDate?: Value;
	startDate?: Value;
	disabled?: boolean;
	position?: Position;
	inline?: boolean;
	validate?: boolean;
	autoclose?: boolean;
	setOnSelect?: boolean;
	isOpen?: boolean;
	today?: boolean;
	keyboard?: boolean;
	additions?: {
		top?: string;
		bottom?: string
	};
	change?: (context: any) => boolean;
	selectable?: (context: any) => boolean;
}

export interface IUtility {
	isValidMoment: (value: any) => boolean;
	toValue: (date: any) => Value;
	toMoment: (date: any) => moment.Moment;
	momentToValue: (momentObject: moment.Moment) => Value;
	valueToMoment: (formattedValue: Value) => moment.Moment;
	setValue: (value: any) => void;
}

export interface IViewItem {
	index: number;
	label: string;
	year?: number;
	month?: number;
	date?: number;
	hour?: number;
	minute?: number;
	second?: number;
	class: string;
	selectable: boolean;
}

export interface IView {
	perLine: number;
	headers?: string[];
	rows: { [index: number]: IViewItem[] };
	render(): string; // return view title
	set(value: IViewItem): void;
	highlightClosest?(): void;
}

export interface IViewHeaderButton {
	selectable: boolean;
	label: string;
	set: () => void;
}

export interface IDirectiveScopeInternal extends IDirectiveScope, IProviderOptions {
	// utilities
	limits: {
		minDate: moment.Moment;
		maxDate: moment.Moment;
		isAfterOrEqualMin: (value: moment.Moment, precision?: moment.unitOfTime.StartOf) => boolean;
		isBeforeOrEqualMax: (value: moment.Moment, precision?: moment.unitOfTime.StartOf) => boolean;
		isSelectable: (value: moment.Moment, precision?: moment.unitOfTime.StartOf) => boolean;
		checkValue: () => void;
		checkView: () => void;
	};

	// views
	views: {
		all: ViewString[];
		precisions: { [viewString: string]: moment.unitOfTime.StartOf };
		formats: { [viewString: string]: string };
		detectMinMax: () => void;

		// specific view controllers
		decade: IView;
		year: IView;
		month: IView;
		day: IView;
		hour: IView;
		minute: IView;
	};

	// current view
	view: {
		moment: moment.Moment;
		value: Value;
		isOpen: boolean;
		selected: ViewString;
		update: () => void;
		toggle: () => void;
		open: () => void;
		close: () => void;
		position: () => void;
		keydown: (e: JQueryEventObject) => void;

		// utility
		unit: () => number;
		precision: () => moment.unitOfTime.DurationConstructor;

		// header
		title: string;
		previous: IViewHeaderButton;
		next: IViewHeaderButton;
		setParentView: () => void;

		// body
		render: () => void;
		change: (view?: ViewString) => void;
	};

	// limits detection
	detectedMinView: ViewString;
	detectedMaxView: ViewString;

	// elements
	picker: ng.IAugmentedJQuery;
	container: ng.IAugmentedJQuery;
	input: ng.IAugmentedJQuery;
}

export interface IModelValidators extends ng.IModelValidators {
	minDate: (modelValue: moment.Moment, viewValue: string) => boolean;
	maxDate: (modelValue: moment.Moment, viewValue: string) => boolean;
}

export interface IModelController extends ng.INgModelController {
	$validators: IModelValidators;
	$modelValue: moment.Moment;
	$viewValue: string;
}