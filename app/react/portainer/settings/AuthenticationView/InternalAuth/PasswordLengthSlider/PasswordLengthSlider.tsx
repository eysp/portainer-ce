import { useCallback } from 'react';
import RcSlider from 'rc-slider';
import clsx from 'clsx';
import { Lock, XCircle, CheckCircle } from 'lucide-react';

import { SliderTooltip } from '@@/Tip/SliderTooltip';

import 'rc-slider/assets/index.css';

import { Badge } from '../Badge';

import styles from './PasswordLengthSlider.module.css';

export interface Props {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange(value: number | number[]): void;
}

type Strength = 'weak' | 'good' | 'strong' | 'veryStrong';

const sliderProperties: Record<
  Strength,
  { strength: string; color: string; text: string }
> = {
  weak: {
    strength: '弱',
    color: '#F04438',
    text: '弱密码',
  },
  good: {
    strength: '好',
    color: '#F79009',
    text: '良好密码',
  },
  strong: {
    strength: '强',
    color: '#12B76A',
    text: '强密码',
  },
  veryStrong: {
    strength: '非常强',
    color: '#0BA5EC',
    text: '非常强密码',
  },
};

export function PasswordLengthSlider({
  min,
  max,
  step,
  value,
  onChange,
}: Props) {
  const sliderProps = getSliderProps(value);

  function getSliderProps(value: number) {
    if (value < 10) {
      return sliderProperties.weak;
    }

    if (value < 12) {
      return sliderProperties.good;
    }

    if (value < 14) {
      return sliderProperties.strong;
    }

    return sliderProperties.veryStrong;
  }

  function getBadgeIcon(strength: string) {
    switch (strength) {
      case 'weak':
        return <XCircle size="13" className="space-right" strokeWidth="3px" />;
      case 'good':
      case 'strong':
        return (
          <CheckCircle size="13" className="space-right" strokeWidth="3px" />
        );
      default:
        return <Lock size="13" className="space-right" strokeWidth="3px" />;
    }
  }

  function handleChange(sliderValue: number | number[]) {
    onChange(sliderValue);
  }

  const sliderTooltip = useCallback(
    (node, handleProps) => (
      <SliderTooltip
        value={`${handleProps.value} 个字符`}
        child={node}
        delay={800}
      />
    ),
    []
  );

  return (
    <div className={clsx(styles.root, styles[sliderProps.strength])}>
      <div className="col-sm-4">
        <RcSlider
          handleRender={sliderTooltip}
          min={min}
          max={max}
          step={step}
          defaultValue={12}
          value={value}
          onChange={handleChange}
        />
      </div>

      <div className={clsx('col-sm-2', styles.sliderBadge)}>
        <Badge
          icon={getBadgeIcon(sliderProps.strength)}
          value={sliderProps.text}
          color={sliderProps.color}
        />
      </div>
    </div>
  );
}
