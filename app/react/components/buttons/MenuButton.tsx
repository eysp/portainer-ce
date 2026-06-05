import { PropsWithChildren, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Menu,
  MenuButton as ReachMenuButton,
  MenuLink as ReachMenuLink,
  MenuList,
} from '@reach/menu-button';
import clsx from 'clsx';
import { UISrefProps, useSref } from '@uirouter/react';

import { AutomationTestingProps } from '@/types';

import { Icon } from '@@/Icon';

import { Props as ButtonProps, ButtonWithRef } from './Button';

export interface MenuButtonProps
  extends Omit<ButtonProps, 'onClick'>,
    AutomationTestingProps {
  items: Array<ReactNode>;
  menuClassName?: string;
  dropdownPosition?: 'left' | 'right';
  children: ReactNode;
}

export function MenuButton({
  items,
  children,
  color = 'primary',
  size = 'small',
  disabled = false,
  className,
  title,
  icon,
  menuClassName,
  dropdownPosition = 'right',
  'data-cy': dataCy,
}: PropsWithChildren<MenuButtonProps>) {
  return (
    <Menu>
      <ReachMenuButton
        as={ButtonWithRef}
        color={color}
        size={size}
        disabled={disabled}
        className={clsx('flex items-center gap-1', className)}
        title={title}
        icon={icon}
        data-cy={dataCy}
      >
        {children}
        <Icon icon={ChevronDown} size="xs" className="ml-1" />
      </ReachMenuButton>

      <MenuList
        className={clsx(
          'dropdown-menu relative rounded-lg !p-1',
          'border !border-solid border-gray-6 th-dark:border-gray-warm-8 th-highcontrast:border-gray-2 shadow-[0_6px_12px_rgba(0,0,0,0.18)]',
          {
            'origin-top-right right-0': dropdownPosition === 'right',
            'origin-top-left left-0': dropdownPosition === 'left',
          },
          menuClassName
        )}
      >
        {items}
      </MenuList>
    </Menu>
  );
}

interface MenuLinkProps extends AutomationTestingProps, UISrefProps {
  children: ReactNode;
  label?: string;
}

export function MenuButtonLink({
  to,
  children,
  label,
  params,
  options,
  'data-cy': dataCy,
}: MenuLinkProps) {
  const anchorProps = useSref(to, params, options);
  return (
    <ReachMenuLink
      href={anchorProps.href}
      onClick={anchorProps.onClick}
      className={clsx(
        'rounded-md px-5 py-1 text-sm leading-5 whitespace-nowrap text-[var(--text-dropdown-menu-color)] decoration-none hover:decoration-none hover:bg-[var(--bg-dropdown-hover)] hover:text-[var(--text-dropdown-menu-color)] focus:bg-[var(--bg-dropdown-hover)] focus:text-[var(--text-dropdown-menu-color)] focus-visible:outline-none focus-visible:ring-0 hover:no-underline'
      )}
      aria-label={label}
      data-cy={dataCy}
    >
      {children}
    </ReachMenuLink>
  );
}
