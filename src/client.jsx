// load babel polyfill
import 'babel-polyfill'
// third party imports imports
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-apollo'
import createHistory from 'history/lib/createBrowserHistory'
import {Router, useRouterHistory} from 'react-router'
import useNamedRoutes from 'use-named-routes'
import {syncHistoryWithStore} from 'react-router-redux'

import injectTapEventPlugin from 'react-tap-event-plugin'

// local imports
import routes from 'routes'
import store from 'store'
import DevTools from 'components/misc/DevTools'
import ApolloClient from 'store/reducer/apollo'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda))
}

// the order of history enhancers matters here.
const history = syncHistoryWithStore(
    useNamedRoutes(
        useRouterHistory(createHistory)
    )({ routes }),
    store
)

// render the routed application
ReactDOM.render(
    <Provider store={store} client={ApolloClient}>
        <div>
            <Router
                routes={routes}
                history={history}
                // see https://github.com/rackt/react-router/issues/2144#issuecomment-144462974
                onUpdate={() => window.scrollTo(0, 0)}
            />
            <DevTools/>
        </div>
    </Provider>,
    document.getElementById('app')
)
