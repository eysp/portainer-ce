import { ComponentType, ReactNode, useContext } from 'react';
import { UIRouterContextComponent } from '@uirouter/react-hybrid';
import { UIRouterContext, UIRouter } from '@uirouter/react';
import angular from 'angular';

export function getGlobalUIRouter(): UIRouter | undefined {
  if (
    typeof window !== 'undefined' &&
    (window as unknown as { $uiRouter?: UIRouter }).$uiRouter
  ) {
    return (window as unknown as { $uiRouter?: UIRouter }).$uiRouter;
  }

  if (typeof document !== 'undefined') {
    try {
      const rootEl =
        document.querySelector('[ng-app]') ||
        document.getElementById('app') ||
        document.documentElement ||
        document.body;
      const injector = rootEl ? angular.element(rootEl).injector() : undefined;
      const router = injector?.has('$uiRouter')
        ? injector.get<UIRouter>('$uiRouter')
        : undefined;
      if (router) {
        if (typeof window !== 'undefined') {
          (window as unknown as { $uiRouter?: UIRouter }).$uiRouter = router;
        }
        return router;
      }
    } catch {
      // ignore
    }
  }

  return undefined;
}

export function FallbackUIRouterProvider({ children }: { children: ReactNode }) {
  const router = useContext(UIRouterContext);
  if (router) {
    return <>{children}</>;
  }

  const fallbackRouter = getGlobalUIRouter();
  if (fallbackRouter) {
    return (
      <UIRouterContext.Provider value={fallbackRouter}>
        {children}
      </UIRouterContext.Provider>
    );
  }

  return <>{children}</>;
}

export function withUIRouter<T>(
  WrappedComponent: ComponentType<T>
): ComponentType<T> {
  // Try to create a nice displayName for React Dev Tools.
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  function WrapperComponent(props: T & JSX.IntrinsicAttributes) {
    return (
      <UIRouterContextComponent>
        <FallbackUIRouterProvider>
          <WrappedComponent {...props} />
        </FallbackUIRouterProvider>
      </UIRouterContextComponent>
    );
  }

  WrapperComponent.displayName = `withUIRouter(${displayName})`;

  return WrapperComponent;
}
