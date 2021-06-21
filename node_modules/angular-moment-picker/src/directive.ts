import * as angular from 'angular';
import * as moment from 'moment';
import { getOffset } from './helpers';
import { IProviderOptions } from './provider';
import { ViewString, IView, IViewItem, IDirectiveScopeInternal, IModelController } from './definitions';
import { DecadeView, YearView, MonthView, DayView, HourView, MinuteView } from './views';
import { isValidMoment, toValue, toMoment, momentToValue, valueToMoment, setValue, updateMoment, KEYS } from './utility';

const templateHtml = require('./template.tpl.html');

export default class Directive implements ng.IDirective {
	public restrict   = 'A';
	public require    = '?ngModel';
	public transclude = true;
	public template   = templateHtml;
	public scope      = {
		value:       '=?momentPicker',
		model:       '=?ngModel',
		locale:      '@?',
		format:      '@?',
		minView:     '@?',
		maxView:     '@?',
		startView:   '@?',
		minDate:     '=?',
		maxDate:     '=?',
		startDate:   '=?',
		disabled:    '=?disable',
		position:    '@?',
		inline:      '@?',
		validate:    '=?',
		autoclose:   '=?',
		setOnSelect: '=?',
		isOpen:      '=?',
		today:       '=?',
		keyboard:    '=?',
		showHeader:  '=?',
		additions:   '=?',
		change:      '&?',
		selectable:  '&?'
	};

	constructor(
		private $timeout: ng.ITimeoutService,
		private $sce: ng.ISCEService,
		private $log: ng.ILogService,
		private $window: ng.IWindowService,
		private provider: IProviderOptions,
		private $compile: ng.ICompileService,
		private $templateCache: ng.ITemplateCacheService) { }

	public link = ($scope: IDirectiveScopeInternal, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes, $ctrl: IModelController, $transclude: ng.ITranscludeFunction) => {
		$transclude(($transElement: ng.IAugmentedJQuery) => {
			// one-way binding attributes
			angular.forEach([
				'locale', 'format', 'minView', 'maxView', 'startView', 'position', 'inline', 'validate', 'autoclose', 'setOnSelect', 'today',
				'keyboard', 'showHeader', 'leftArrow', 'rightArrow', 'additions'
			], (attr: string) => {
				if (!angular.isDefined($scope[attr])) $scope[attr] = this.provider[attr];
				if (!angular.isDefined($attrs[attr])) $attrs[attr] = $scope[attr];
			});

			// check if ngModel has been set
			if (!$attrs['ngModel']) $ctrl = <IModelController>{};

			// limits
			$scope.limits = {
				minDate: toMoment($scope.minDate, $scope.format, $scope.locale),
				maxDate: toMoment($scope.maxDate, $scope.format, $scope.locale),
				isAfterOrEqualMin: (value: moment.Moment, precision?: moment.unitOfTime.StartOf) => {
					return !angular.isDefined($scope.limits.minDate) || value.isAfter($scope.limits.minDate, precision) || value.isSame($scope.limits.minDate, precision);
				},
				isBeforeOrEqualMax: (value: moment.Moment, precision?: moment.unitOfTime.StartOf) => {
					return !angular.isDefined($scope.limits.maxDate) || value.isBefore($scope.limits.maxDate, precision) || value.isSame($scope.limits.maxDate, precision);
				},
				isSelectable: (value: moment.Moment, precision?: moment.unitOfTime.StartOf) => {
					let selectable: boolean = true;
					try {
						if (angular.isFunction($scope.selectable) && $attrs['selectable']) selectable = $scope.selectable({ date: value, type: precision });
					} catch (e) {
						this.$log.error(e);
					}
					return $scope.limits.isAfterOrEqualMin(value, precision) && $scope.limits.isBeforeOrEqualMax(value, precision) && selectable;
				},
				checkValue: () => {
					if (!isValidMoment($ctrl.$modelValue) || !$scope.validate) return;
					if (!$scope.limits.isAfterOrEqualMin($ctrl.$modelValue)) setValue($scope.limits.minDate, $scope, $ctrl, $attrs);
					if (!$scope.limits.isBeforeOrEqualMax($ctrl.$modelValue)) setValue($scope.limits.maxDate, $scope, $ctrl, $attrs);
				},
				checkView: () => {
					if (!angular.isDefined($scope.view.moment)) $scope.view.moment = moment().locale($scope.locale);
					if (!$scope.limits.isAfterOrEqualMin($scope.view.moment)) $scope.view.moment = $scope.limits.minDate.clone();
					if (!$scope.limits.isBeforeOrEqualMax($scope.view.moment)) $scope.view.moment = $scope.limits.maxDate.clone();
					$scope.view.update();
					$scope.view.render();
				}
			};

			$scope.views = {
				all: ['decade', 'year', 'month', 'day', 'hour', 'minute'],
				precisions: { decade: 'year', year: 'month', month: 'date', day: 'hour', hour: 'minute', minute: 'second' },
				// for each view, `$scope.views.formats` object contains the available moment formats
				// formats present in more views are used to perform min/max view detection (i.e. 'LTS', 'LT', ...)
				formats: {
					decade:	'Y{1,2}(?!Y)|YYYY|[Ll]{1,4}(?!T)',
							/* formats: Y,YY,YYYY,L,LL,LLL,LLLL,l,ll,lll,llll */
					year:	'M{1,4}(?![Mo])|Mo|Q',
							/* formats: M,MM,MMM,MMM,Mo,Q */
					month:	'[Dd]{1,4}(?![Ddo])|DDDo|[Dd]o|[Ww]{1,2}(?![Wwo])|[Ww]o|[Ee]|L{1,2}(?!T)|l{1,2}',
							/* formats: D,DD,DDD,DDDD,d,dd,ddd,dddd,DDDo,Do,do,W,WW,w,ww,Wo,wo,E,e,L,LL,l,ll */
					day:	'[Hh]{1,2}|LTS?',
							/* formats: H,HH,h,hh,LT,LTS */
					hour:	'm{1,2}|[Ll]{3,4}|LT(?!S)',
							/* formats: m,mm,LLL,LLLL,lll,llll,LT */
					minute:	's{1,2}|S{1,}|X|LTS'
							/* formats: s,ss,S,SS,SSS..,X,LTS */
				},
				detectMinMax: () => {
					$scope.detectedMinView = $scope.detectedMaxView = undefined;
					if (!$scope.format) return;

					let minView, maxView;
					angular.forEach($scope.views.formats, (formats, view) => {
						let regexp = new RegExp('(' + formats + ')(?![^\[]*\])', 'g');
						if (!$scope.format.match(regexp)) return;
						if (!angular.isDefined(minView)) minView = view;
						maxView = view;
					});

					if (!angular.isDefined(minView)) minView = 0;
					else minView = Math.max(0, $scope.views.all.indexOf(minView));
					if (!angular.isDefined(maxView)) maxView = $scope.views.all.length - 1;
					else maxView = Math.min($scope.views.all.length - 1, $scope.views.all.indexOf(maxView));

					if (minView > $scope.views.all.indexOf($scope.minView)) $scope.minView = $scope.views.all[minView];
					if (maxView < $scope.views.all.indexOf($scope.maxView)) $scope.maxView = $scope.views.all[maxView];

					// save detected min/max view to use them to update the model value properly
					$scope.detectedMinView = $scope.views.all[minView];
					$scope.detectedMaxView = $scope.views.all[maxView];
				},
				// specific views
				decade:	new DecadeView	($scope, $ctrl, this.provider),
				year:	new YearView	($scope, $ctrl, this.provider),
				month:	new MonthView	($scope, $ctrl, this.provider),
				day:	new DayView		($scope, $ctrl, this.provider),
				hour:	new HourView	($scope, $ctrl, this.provider),
				minute:	new MinuteView	($scope, $ctrl, this.provider),
			};
			$scope.view = {
				moment: undefined,
				value: undefined,
				isOpen: false,
				selected: $scope.startView,
				update: () => { $scope.view.value = momentToValue($scope.view.moment, $scope.format); },
				toggle: () => { $scope.view.isOpen ? $scope.view.close() : $scope.view.open(); },
				open: () => {
					if ($scope.disabled || $scope.view.isOpen || $scope.inline) return;

					$scope.isOpen = true;
					$scope.view.isOpen = true;
					document.body.appendChild($scope.picker[0]);
					$scope.view.position();
				},
				close: () => {
					if (!$scope.view.isOpen || $scope.inline) return;

					$scope.isOpen = false;
					$scope.view.isOpen = false;
					$scope.view.selected = $scope.startView;
					$scope.picker[0].parentNode.removeChild($scope.picker[0]);
				},
				position: () => {
					if (!$scope.view.isOpen || $scope.position || $scope.inline) return;

					let element = $element[0],
						picker = $scope.picker.children()[0],
						hasClassTop = $scope.picker.hasClass('top'),
						hasClassRight = $scope.picker.hasClass('right'),
						offset = getOffset($element[0]),
						top = offset.top - this.$window.pageYOffset,
						left = offset.left - this.$window.pageXOffset,
						winWidth = this.$window.innerWidth,
						winHeight = this.$window.innerHeight,
						shouldHaveClassTop = top + this.$window.pageYOffset - picker.offsetHeight > 0 && top > winHeight / 2,
						shouldHaveClassRight = left + picker.offsetWidth > winWidth,
						pickerTop = offset.top + (shouldHaveClassTop ? 0 : element.offsetHeight) + 'px',
						pickerLeft = offset.left + 'px',
						pickerWidth = element.offsetWidth + 'px';

					if (!hasClassTop && shouldHaveClassTop) $scope.picker.addClass('top');
					if (hasClassTop && !shouldHaveClassTop) $scope.picker.removeClass('top');
					if (!hasClassRight && shouldHaveClassRight) $scope.picker.addClass('right');
					if (hasClassRight && !shouldHaveClassRight) $scope.picker.removeClass('right');
					if ($scope.picker.css('top') !== pickerTop) $scope.picker.css('top', pickerTop);
					if ($scope.picker.css('left') !== pickerLeft) $scope.picker.css('left', pickerLeft);
					if ($scope.picker.css('width') !== pickerWidth) $scope.picker.css('width', pickerWidth);
				},
				keydown: (e) => {
					let view: IView = $scope.views[$scope.view.selected],
						precision   = $scope.views.precisions[$scope.view.selected].replace('date', 'day'),
						singleUnit  = this.provider[precision + 'sStep'] || 1,
						operation   = [KEYS.up, KEYS.left].indexOf(e.keyCode) >= 0 ? 'subtract' : 'add',
						highlight   = (vertical?: boolean) => {
							let unitMultiplier = vertical ? view.perLine : 1,
								nextDate = $scope.view.moment.clone()[operation](singleUnit * unitMultiplier, precision);
							if ($scope.limits.isSelectable(nextDate, <moment.unitOfTime.StartOf>precision)) {
								$scope.view.moment = nextDate;
								$scope.view.update();
								$scope.view.render();
							}
						};

					switch (e.keyCode) {
						case KEYS.up:
						case KEYS.down:
							e.preventDefault();
							if (!$scope.view.isOpen) $scope.view.open();
							else highlight(true);
							break;
						case KEYS.left:
						case KEYS.right:
							if (!$scope.view.isOpen) break;
							e.preventDefault();
							highlight();
							break;
						case KEYS.enter:
							if (!$scope.view.isOpen) break;
							$scope.view.change(<ViewString>precision);
							e.preventDefault();
							break;
						case KEYS.escape:
							$scope.view.toggle();
							break;
					}

					$scope.$evalAsync();
				},
				// utility
				unit: () => $scope.view.selected == 'decade' ? 10 : 1,
				precision: () => <moment.unitOfTime.DurationConstructor>$scope.view.selected.replace('decade', 'year'),
				// header
				title: '',
				previous: {
					label: this.$sce.trustAsHtml($scope.leftArrow),
					selectable: true,
					set: () => {
						if ($scope.view.previous.selectable) {
							$scope.view.moment.subtract($scope.view.unit(), $scope.view.precision());
							$scope.view.update();
							$scope.view.render();
						}
					}
				},
				next: {
					selectable: true,
					label: this.$sce.trustAsHtml($scope.rightArrow),
					set: () => {
						if ($scope.view.next.selectable) {
							$scope.view.moment.add($scope.view.unit(), $scope.view.precision());
							$scope.view.update();
							$scope.view.render();
						}
					}
				},
				setParentView: () => { $scope.view.change($scope.views.all[Math.max(0, $scope.views.all.indexOf($scope.view.selected) - 1)]); },
				// body
				render: () => {
					let momentPrevious = $scope.view.moment.clone().startOf($scope.view.precision()).subtract($scope.view.unit(), $scope.view.precision()),
						momentNext = $scope.view.moment.clone().endOf($scope.view.precision()).add($scope.view.unit(), $scope.view.precision());

					$scope.view.previous.selectable = $scope.limits.isAfterOrEqualMin(momentPrevious, $scope.view.precision());
					$scope.view.previous.label = this.$sce.trustAsHtml($scope.view.previous.selectable ? $scope.leftArrow : '&nbsp;');
					$scope.view.next.selectable = $scope.limits.isBeforeOrEqualMax(momentNext, $scope.view.precision());
					$scope.view.next.label = this.$sce.trustAsHtml($scope.view.next.selectable ? $scope.rightArrow : '&nbsp;');
					$scope.view.title = $scope.views[$scope.view.selected].render();
				},
				change: (view) => {
					let nextView = $scope.views.all.indexOf(view),
						minView  = $scope.views.all.indexOf($scope.minView),
						maxView  = $scope.views.all.indexOf($scope.maxView);
					
					const update = () => {
						setValue($scope.view.moment, $scope, $ctrl, $attrs);
						$scope.view.update();
						if ($attrs['ngModel']) $ctrl.$commitViewValue();
					};

					if ($scope.setOnSelect) update();
					if (nextView < 0 || nextView > maxView) {
						if (!$scope.setOnSelect) update();
						if ($scope.autoclose) this.$timeout($scope.view.close);
					} else if (nextView >= minView) $scope.view.selected = view;
				}
			};

			// creation
			$element.prepend($transElement);
			$scope.picker = angular.element($element[0].querySelectorAll('.moment-picker'));
			$scope.container = angular.element($scope.picker[0].querySelectorAll('.moment-picker-container'));
			$scope.input = $element[0].tagName.toLowerCase() != 'input' && $element[0].querySelectorAll('input').length > 0
				? angular.element($element[0].querySelectorAll('input'))
				: angular.element($element[0]);
			$scope.input.addClass('moment-picker-input').attr('tabindex', 0);
			($scope.position || '').split(' ').forEach((className: string) => $scope.picker.addClass(className));
			if (!$scope.inline) $scope.picker[0].parentNode.removeChild($scope.picker[0]);
			else {
				$element.after($scope.picker);
				$scope.picker.addClass('inline');
			}

			// transclude scope to template additions
			this.$timeout(() => {
				angular.forEach($scope.additions || {}, (tempalteUrl: string, key: 'top' | 'bottom') => {
					let placeholder = angular.element($scope.container[0].querySelector('.moment-picker-addition.' + key));
					let template = this.$templateCache.get<string>(tempalteUrl);
					let compiled = this.$compile(template)($scope.$parent);
					placeholder.append(compiled);
				});
			});

			// initialization
			$scope.views.detectMinMax();
			$scope.limits.checkView();
			// model controller is initialized after linking function
			this.$timeout(() => {
				if ($attrs['ngModel']) {
					if (!$ctrl.$modelValue && $scope.value) $ctrl.$setViewValue($scope.value);
					$ctrl.$commitViewValue();
					$ctrl.$render();
				} else {
					if ($scope.value) $ctrl.$modelValue = valueToMoment($scope.value, $scope);
				}
				// view initialization
				if ($scope.startDate) $scope.view.moment = toMoment($scope.startDate, $scope.format, $scope.locale);
				else if (isValidMoment($ctrl.$modelValue)) $scope.view.moment = $ctrl.$modelValue.clone();
				$scope.view.update();
				$scope.view.render();
			});

			// model <-> view conversion
			if ($attrs['ngModel']) {
				$ctrl.$parsers.push((viewValue) => updateMoment($ctrl.$modelValue, valueToMoment(viewValue, $scope), $scope) || true);
				$ctrl.$formatters.push((modelValue) => momentToValue(modelValue, $scope.format) || '');
				$ctrl.$viewChangeListeners.push(() => { if ($attrs['ngModel'] != $attrs['momentPicker']) $scope.value = $ctrl.$viewValue; });
				$ctrl.$validators.minDate = (value) => $scope.validate || !isValidMoment(value) || $scope.limits.isAfterOrEqualMin(value);
				$ctrl.$validators.maxDate = (value) => $scope.validate || !isValidMoment(value) || $scope.limits.isBeforeOrEqualMax(value);
			}

			// properties listeners
			if ($attrs['ngModel'] != $attrs['momentPicker'])
				$scope.$watch('value', (newValue: string, oldValue: string) => {
					if (newValue !== oldValue) setValue(newValue, $scope, $ctrl, $attrs);
				});
			$scope.$watch(() => momentToValue($ctrl.$modelValue, $scope.format), (newViewValue, oldViewValue) => {
				if (newViewValue == oldViewValue) return;

				let newModelValue = valueToMoment(newViewValue, $scope);
				setValue(newModelValue, $scope, $ctrl, $attrs);
				$scope.limits.checkValue();
				$scope.view.moment = (newModelValue || moment().locale($scope.locale)).clone();
				$scope.view.update();
				$scope.view.render();
				if (angular.isFunction($scope.change) && $attrs['change']) {
					let oldModelValue = valueToMoment(oldViewValue, $scope);
					$scope.$evalAsync(() => $scope.change({ newValue: newModelValue, oldValue: oldModelValue }));
				}
			});
			$scope.$watch(() => $ctrl.$modelValue && $ctrl.$modelValue.valueOf(), () => {
				let viewMoment = (isValidMoment($ctrl.$modelValue) ? $ctrl.$modelValue : moment().locale($scope.locale)).clone();
				if (!viewMoment.isSame($scope.view.moment)) {
					$scope.view.moment = viewMoment;
					$scope.view.update();
					$scope.view.render();
				}
			});
			$scope.$watch('view.selected', () => $scope.view.render());
			$scope.$watchGroup(['minView', 'maxView'], () => {
				// auto-detect minView/maxView
				$scope.views.detectMinMax();
				// limit startView
				$scope.startView = $scope.views.all[
					Math.max(
						Math.min(
							$scope.views.all.indexOf($scope.startView),
							$scope.views.all.indexOf($scope.maxView)
						),
						$scope.views.all.indexOf($scope.minView)
					)
				];
				$scope.view.selected = $scope.startView;
			});
			$scope.$watchGroup([
				() => toValue($scope.minDate, $scope.format, $scope.locale),
				() => toValue($scope.maxDate, $scope.format, $scope.locale)
			], () => {
				angular.forEach(['minDate', 'maxDate'], (field: string) => {
					$scope.limits[field] = toMoment($scope[field], $scope.format, $scope.locale);
				});
				$scope.limits.checkValue();
				$scope.limits.checkView();
				$scope.view.render();
			});
			$scope.$watch(() => toValue($scope.startDate, $scope.format, $scope.locale), (newViewValue, oldViewValue) => {
				if (newViewValue == oldViewValue) return;

				$scope.view.moment = valueToMoment(newViewValue, $scope);
				$scope.view.update();
				$scope.view.render();
			});
			$attrs.$observe('locale', (locale: string) => $scope.locale = locale);
			$scope.$watch('locale', (locale: string, previous: string) => {
				if (!angular.isDefined(previous) || locale == previous) return;
				if (isValidMoment($ctrl.$modelValue)) setValue($ctrl.$modelValue.locale(locale), $scope, $ctrl, $attrs);
				if (isValidMoment($scope.view.moment)) $scope.view.moment = $scope.view.moment.locale(locale);
				if (isValidMoment($scope.limits.minDate)) $scope.limits.minDate = $scope.limits.minDate.locale(locale);
				if (isValidMoment($scope.limits.maxDate)) $scope.limits.maxDate = $scope.limits.maxDate.locale(locale);
				$scope.view.render();
			});
			$scope.$watch('validate', $scope.limits.checkValue);
			$scope.$watch('isOpen', (isOpen: boolean) => {
				if ($scope.inline) $scope.view.isOpen = true;
				else if (angular.isDefined(isOpen) && isOpen != $scope.view.isOpen) $scope.view.toggle();
			});

			// event listeners
			const focusInput = (e?: JQueryEventObject) => {
				if (e) e.preventDefault();
				$scope.input[0].focus();
			};
			// use `touchstart` for iOS Safari, where click events aren't propogated under most circumstances.
			$scope.input
				.on('focus click touchstart', () => $scope.$evalAsync($scope.view.open))
				.on('blur',        			  () => $scope.$evalAsync($scope.view.close))
				.on('keydown',     			  (e) => { if ($scope.keyboard) $scope.view.keydown(e); });
			$element.on('click touchstart', () => focusInput());
			$scope.container.on('mousedown', (e: JQueryEventObject) => focusInput(e));
			angular.element(this.$window).on('resize scroll', $scope.view.position);

			// unbind events on destroy
			$scope.$on('$destroy', () => {
				$scope.input.off('focus click touchstart blur keydown');
				$element.off('click touchstart');
				$scope.container.off('mousedown');
				$scope.picker.remove();
				angular.element(this.$window).off('resize scroll', $scope.view.position);
			});
		});
	}
}
