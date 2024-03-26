import { createContext, PropsWithChildren, useContext } from 'react';

const Context = createContext<null | boolean>(null);
Context.displayName = 'WidgetContext';

export function useWidgetContext() {
  const context = useContext(Context);

  if (context == null) {
    throw new Error('应该位于 Widget 组件内');
  }
}

export function Widget({ children }: PropsWithChildren<unknown>) {
  return (
    <Context.Provider value>
      <div className="widget">{children}</div>
    </Context.Provider>
  );
}
