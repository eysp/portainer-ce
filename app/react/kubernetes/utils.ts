import { Annotation } from './annotations/types';

export function parseCpu(cpu: string) {
  let res = parseInt(cpu, 10);
  if (cpu.endsWith('m')) {
    res /= 1000;
  } else if (cpu.endsWith('n')) {
    res /= 1000000000;
  }
  return res;
}

export function prepareAnnotations(annotations?: Annotation[]) {
  const result = annotations?.reduce(
    (acc, a) => {
      acc[a.key] = a.value;
      return acc;
    },
    {} as Record<string, string>
  );
  return result;
}

/**
 * Returns the safe value of the given number or string.
 * @param value - The value to get the safe value for.
 * @returns The safe value of the given number or string.
 */
export function getSafeValue(value: number | string) {
  const valueNumber = Number(value);
  if (Number.isNaN(valueNumber)) {
    return 0;
  }
  return valueNumber;
}

/**
 * Returns the percentage of the value over the total.
 * @param value - The value to calculate the percentage for.
 * @param total - The total value to compare the percentage to.
 * @returns The percentage of the value over the total, with the '- ' string prefixed, for example '- 50%'.
 */
export function getPercentageString(value: number, total?: number | string) {
  const totalNumber = Number(total);
  if (
    totalNumber === 0 ||
    total === undefined ||
    total === '' ||
    Number.isNaN(totalNumber)
  ) {
    return '';
  }
  if (value > totalNumber) {
    return '- Exceeded';
  }
  return `- ${Math.round((value / totalNumber) * 100)}%`;
}
