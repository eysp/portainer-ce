# UI-Router Core &nbsp;[![Build Status](https://travis-ci.org/ui-router/core.svg?branch=master)](https://travis-ci.org/ui-router/core)

UI-Router core provides client-side [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application) 
routing for JavaScript.
This core is framework agnostic.
It is used to build
[UI-Router for Angular 1](//ui-router.github.io/ng1),
[UI-Router for Angular 2](//ui-router.github.io/ng2), and 
[UI-Router React](//ui-router.github.io/react).

## SPA Routing

Routing frameworks for SPAs update the browser's URL as the user navigates through the app.  Conversely, this allows 
changes to the browser's URL to drive navigation through the app, thus allowing the user to create a bookmark to a 
location deep within the SPA.

UI-Router applications are modeled as a hierarchical tree of states. UI-Router provides a 
[*state machine*](https://en.wikipedia.org/wiki/Finite-state_machine) to manage the transitions between those 
application states in a transaction-like manner. 

## Features

UI-Router Core provides the following features:

- State-machine based routing
  - Hierarchical states
  - Enter/Exit hooks
- Name based hierarchical state addressing
  - Absolute, e.g., `admin.users`
  - Relative, e.g., `.users`
- Flexible Views
  - Nested Views
  - Multiple Named Views
- Flexible URLs and parameters
  - Path, Query, and non-URL parameters
  - Typed parameters 
    - Built in: `int`, `string`, `date`, `json`
    - Custom: define your own encoding/decoding
  - Optional or required parameters
  - Default parameter values (optionally squashed from URL)
- Transaction-like state transitions
  - Transition Lifecycle Hooks
  - First class async support

## Get Started

Get started using one of the existing UI-Router projects:

- [UI-Router for Angular 1](https://ui-router.github.io/ng1)
- [UI-Router for Angular 2](https://ui-router.github.io/ng2)
- [UI-Router for React](https://ui-router.github.io/react)

## Build your own

UI-Router core can be used implement a router for any web-based component framework.
There are four basic things to build for a specific component framework:

### UIView

A UIView is a component which acts as a viewport for another component, defined by a state.
When the state is activated, the UIView should render the state's component.

### UISref (optional, but useful)

A `UISref` is a link (absolute, or relative) which activates a specific state and/or parameters.
When the `UISref` is clicked, it should initiate a transition to the linked state.

### UISrefActive (optional)

When combined with a `UISref`, a `UISrefActive` toggles a CSS class on/off when its `UISref` is active/inactive.

### Bootstrap mechanism (optional)

Implement framework specific bootstrap requirements, if any.
For example, UI-Router for Angular 1 and Angular 2 integrates with the ng1/ng2 Dependency Injection lifecycles.
On the other hand, UI-Router for React uses a simple JavaScript based bootstrap, i.e., `new UIRouterReact().start();`.

## Getting help

[Create an issue](https://github.com/ui-router/core/issues) or contact us on [Gitter](https://gitter.im/angular-ui/ui-router).
