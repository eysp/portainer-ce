import { PropsWithChildren } from 'react';
import { X } from 'lucide-react';

import { Widget, WidgetBody } from './Widget';
import { Button } from './buttons';

interface Props {
  title?: string;
  onDismiss?(): void;
  bodyClassName?: string;
  wrapperStyle?: Record<string, string>;
}

export function InformationPanel({
  title,
  onDismiss,
  wrapperStyle,
  bodyClassName,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="row">
      
    </div>
  );
}
