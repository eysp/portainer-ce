import {
  ComponentType,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UIRouterContextComponent } from '@uirouter/react-hybrid';
import { UIRouterContext, UIViewContext, UIRouter } from '@uirouter/react';
import { StateDeclaration } from '@uirouter/core';
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

export function getCurrentState(
  router?: UIRouter
): StateDeclaration | undefined {
  if (!router) {
    return undefined;
  }

  const transitionTo = router.globals?.transition?.to();
  if (transitionTo?.name) {
    return transitionTo;
  }

  if (router.globals?.current?.name) {
    return router.globals.current;
  }

  if (router.stateService?.current?.name) {
    return router.stateService.current;
  }

  if (typeof window !== 'undefined') {
    const ngState = (
      window as unknown as { $state?: { current?: { name?: string } } }
    ).$state;
    if (ngState?.current?.name) {
      return router.stateRegistry.get(ngState.current.name) || undefined;
    }
  }

  return undefined;
}

export function FallbackUIRouterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const routerFromContext = useContext(UIRouterContext);
  const router = routerFromContext || getGlobalUIRouter();
  const parentViewContext = useContext(UIViewContext);

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!router) {
      return;
    }
    return router.transitionService?.onSuccess({}, () => {
      setTick((t) => t + 1);
    });
  }, [router]);

  const fallbackViewContext = useMemo(() => {
    if (parentViewContext?.context?.name) {
      return parentViewContext;
    }

    const state = getCurrentState(router);
    if (state && state.name) {
      return {
        fqn: parentViewContext?.fqn || '',
        context: state,
      };
    }

    return parentViewContext;
  }, [parentViewContext, router]);

  let content = children;

  if (
    fallbackViewContext &&
    (!parentViewContext || !parentViewContext.context?.name)
  ) {
    content = (
      <UIViewContext.Provider value={fallbackViewContext}>
        {content}
      </UIViewContext.Provider>
    );
  }

  if (router && !routerFromContext) {
    content = (
      <UIRouterContext.Provider value={router}>
        {content}
      </UIRouterContext.Provider>
    );
  }

  return <>{content}</>;
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
