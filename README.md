# Intro
Documentation for Magento PWA Studio [https://pwastudio.io](https://pwastudio.io).

Production checklist:
- [ ] Webpagetest security
- [ ] Google Lighthouse
- [ ] robots.txt
- [ ] Check build files size

# Conventions
## Folder structure

```sh
pwa-storefront/src
├── components                          # Common reusable components
├── drivers.js                          # Venia drivers for external dependencies
├── index.css                           # Global css, TODO: delete this file
├── index.js                            # Main entrypoint for React to render
├── layouts                             # Layout component: header, footer, sidebar, content...
│   ├── appContainer.js
│   ├── appContent.js
│   ├── app.js
│   ├── Header
│   ├── index.js
│   ├── Routes                          # Define React Router routes
│   ├── SideBar
│   └── useAppContent.js                # Custom React Hook, name ALWAYS start with `use`
├── registerSW.js                       # Use to register progressive web apps
├── RootComponents                      # Override Venia, template for display CMS, category, product...
│   ├── Category
│   └── Product
├── screens                             # Screen or page that displays on Front end
│   ├── CategoryList                    # Category list page, e.g. https://sky-premium-pwa.test/categories
│   ├── Checkout                        # https://sky-premium-pwa.test/checkout
│   ├── Home                            # https://sky-premium-pwa.test/
│   ├── ShoppingCart                    # https://sky-premium-pwa.test/cart
│   └── SignIn                          # https://sky-premium-pwa.test/login
├── ServiceWorker                       # Service Worker logic, caching
│   ├── defaults.js
│   ├── registerMessageHandlers.js
│   ├── registerRoutes.js
│   ├── setupWorkbox.js
│   ├── sw.js
│   └── Utilities
├── store.js                            # Redux stores
└── utils
    └── mapProduct.js                   # Common js functions
```

## Format code
Using [Prettier](https://prettier.io/) to format code. Prettier config is in file `./prettier.config.js`.

Check [install guide](https://prettier.io/docs/en/editors.html) for PHPStorm, Visual Studio Code,...

Or run command before push to pull request:
```sh
git status
git commit -m 'Implement forgot password screen'
docker-compose exec pwa-storefront yarn prettier:fix
git status
git diff
git add file-example
git commit -m 'Format code'
```

## Implement new screen
For example, implement forgot password screen:

1. Make new folder in folder `src/screens/ForgotPassword`, naming in `PascalCase`
2. Create *screen component* file `src/screens/ForgotPassword/forgotPassword.js`, file name is in `camelCase`
    ```js
    import React from 'react';

    const ForgotPassword = () => {
        return <div className="content">This is forgot password screen</div>;
    };

    export default ForgotPassword;
    ```
3. Create file `src/screens/ForgotPassword/index.js` to export
    ```js
    export { default } from './forgotPassword';
    ```
4. Register screen in `src/layouts/Routes/routes.js`
    ```jsx
    const ForgotPasswordPage = lazy(() => import('../../screens/ForgotPassword'));

    // ...

    <Route exact path="/forgot-password">
        <ForgotPasswordPage />
    </Route>
    ```
5. If *screen component* need state or event handler, create custom hook `src/screens/ForgotPassword/useForgotPassword.js`
    ```js
    import { useState } from 'react';

    export const useForgotPassword = () => {
        const [someState, setSomeState] = useState('initial state value');

        const handleSubmit = async () => {
            setSomeState(true);
        };

        return {
            someState,
            handleSubmit
        };
    };
    ```
6. If component can be reused => extract to folder `src/components`
7. When need to use *global state* such as user email, is user signed in,... use Context from `node_modules/@magento/peregrine/lib/context`
    For example: `useUserContext()`:

    ```js
    import { useUserContext } from '@magento/peregrine/lib/context/user';

    const [
        { currentUser, isSignedIn },
        { signOut, getUserDetails }
    ] = useUserContext();
    ```

    First parameter `{ currentUser, isSignedIn }` is context state => see `node_modules/@magento/peregrine/lib/store/reducers/user.js`.

    Second parameter `{ signOut, getUserDetails }` is context action (function) => see `node_modules/@magento/peregrine/lib/store/actions/user`.
8. Screen has form? => Using https://joepuzzo.github.io/informed/. Example: `src/screens/SignIn/signIn.js`

## API
Prefer GraphQL => search API and docs in https://sky-premium-pwa.test/graphiql

If GraphQL API hasn't available => implement new API or search for Rest API => https://magento.redoc.ly/

## TODO:
- [ ] GraphQL guide
- [ ] Redux guide
- [ ] ...
