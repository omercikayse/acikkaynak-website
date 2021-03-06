import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, Router } from 'react-router';

import { createBrowserHistory } from 'history';

import * as Sentry from '@sentry/browser';
import App from './app/app';

class Startup {
    vars: any;

    constructor(startupArgs: any) {
        const isBrowser = (startupArgs.platform === 'browser');

        this.vars = {
            ...startupArgs,
            history: isBrowser ? createBrowserHistory() : null,
        };
    }

    // eslint-disable-next-line class-methods-use-this
    getRoot(): JSX.Element {
        return React.createElement(
            App,
            {},
        );
    }

    clientRender(targetElement: Element, isUpdate: boolean): void {
        Sentry.init({
            dsn: 'https://f08584742c7a464eb8cc1056d6ce1a63@sentry.io/1813830',
        });

        const root = this.getRoot();

        const rootWithRouter = React.createElement(
            Router,
            {
                history: this.vars.history,
            },
            root,
        );

        if (isUpdate) {
            ReactDOM.hydrate(rootWithRouter, targetElement);
        }
        else {
            ReactDOM.render(rootWithRouter, targetElement);
        }
    }

    serverRender(url: string): string {
        const context = {};

        const root = this.getRoot();

        const rootWithRouter = React.createElement(
            StaticRouter,
            {
                location: url,
                context: context,
            },
            root,
        );

        const html = ReactDOMServer.renderToString(rootWithRouter);

        return html;
    }
}

export {
    Startup as default,
};
