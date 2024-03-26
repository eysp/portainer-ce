import clsx from 'clsx';
import { useState } from 'react';
import { Check } from 'lucide-react';

import { Checkbox } from '@@/form-components/Checkbox';
import { Icon } from '@@/Icon';

import styles from './TableSettingsMenuAutoRefresh.module.css';

interface Props {
  onChange(value: number): void;
  value: number;
}

export function TableSettingsMenuAutoRefresh({ onChange, value }: Props) {
  const [isCheckVisible, setIsCheckVisible] = useState(false);

  const isEnabled = value > 0;

  return (
    <>
      <Checkbox
        id="settings-auto-refresh"
        label="自动刷新"
        checked={isEnabled}
        onChange={(e) => onChange(e.target.checked ? 10 : 0)}
      />

      {isEnabled && (
        <div>
          <label htmlFor="settings_refresh_rate">刷新速率</label>
          <select
            id="settings_refresh_rate"
            className="small-select"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value={10}>10秒</option>
            <option value={30}>30秒</option>
            <option value={60}>1分钟</option>
            <option value={120}>2分钟</option>
            <option value={300}>5分钟</option>
          </select>
          <span
            className={clsx(
              isCheckVisible ? styles.alertVisible : styles.alertHidden,
              styles.check
            )}
            onTransitionEnd={() => setIsCheckVisible(false)}
          >
            <Icon icon={Check} className="!ml-1" mode="success" />
          </span>
        </div>
      )}
    </>
  );

  function handleChange(value: string) {
    onChange(Number(value));
    setIsCheckVisible(true);
  }
}