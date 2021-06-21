import * as angular from 'angular';
import * as moment from 'moment';
import { Value, IDirectiveScopeInternal, IModelController, ViewString } from './definitions';

export const KEYS = { up: 38, down: 40, left: 37, right: 39, escape: 27, enter: 13 };

export const isValidMoment = (value: moment.Moment | Value): boolean => {
	return moment.isMoment(value) && value.isValid();
};

export const toValue = (date: moment.Moment | Value, format: string, locale: string): Value => {
	let momentDate = <moment.Moment>date;
	if (!isValidMoment(date)) momentDate = toMoment(date, format, locale);
	return momentToValue(momentDate, format);
};

export const toMoment = (date: moment.Moment | Value, format: string, locale: string): moment.Moment => {
	let momentDate = moment(date, format, locale);
	if (!isValidMoment(momentDate)) momentDate = undefined;
	return momentDate;
};

export const momentToValue = (momentObject: moment.Moment, format: string): Value => {
	if (!isValidMoment(momentObject)) return undefined;
	return !format ? momentObject.valueOf() : momentObject.format(format);
};

export const valueToMoment = (formattedValue: Value, $scope: IDirectiveScopeInternal): moment.Moment => {
	let momentValue: moment.Moment;
	if (!formattedValue) return momentValue;
	if (!$scope.format) momentValue = moment(formattedValue);
	else momentValue = moment(formattedValue, $scope.format, $scope.locale);
	if ($scope.model) {
		// set value for each view precision (from Decade View to minView)
		const views = $scope.views.all.slice(0, $scope.views.all.indexOf($scope.detectedMinView));
		angular.forEach(views, (view: ViewString) => {
			const precision = $scope.views.precisions[view];
			momentValue[precision]($scope.model[precision]());
		});
	}
	return momentValue;
};

export const setValue = (value: moment.Moment | Value, $scope: IDirectiveScopeInternal, $ctrl: IModelController, $attrs: ng.IAttributes): void => {
	let modelValue = isValidMoment(value) ? (<moment.Moment>value).clone() : valueToMoment(<Value>value, $scope),
		viewValue = momentToValue(modelValue, $scope.format);
	$scope.model = updateMoment($scope.model, modelValue, $scope);
	$ctrl.$modelValue = updateMoment($ctrl.$modelValue, modelValue, $scope);
	if ($attrs['ngModel'] != $attrs['momentPicker']) $scope.value = viewValue;
	if ($attrs['ngModel']) {
		$ctrl.$setViewValue(viewValue);
		$ctrl.$render(); // render input value
	}
};

export const updateMoment = (model: moment.Moment, value: moment.Moment, $scope: IDirectiveScopeInternal): moment.Moment => {
	if (!isValidMoment(model) || !value) model = value;
	else {
		if (!model.isSame(value)) {
			// set value for each view precision (from Decade View to maxView)
			const views = $scope.views.all.slice(0, $scope.views.all.indexOf($scope.detectedMaxView) + 1);
			angular.forEach(views, (view: ViewString) => {
				const precision = $scope.views.precisions[view];
				model[precision](value[precision]());
			});
		}
	}
	return model;
};