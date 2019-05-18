import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import { AUTH_TOKEN } from './constants'


import { ApolloProvider } from 'react-apollo'
import { split } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'



// Here you create the httpLink that will connect your ApolloClient instance 
// with the GraphQL API, your GraphQL server will be running on http://localhost:4000.

const httpLink = createHttpLink({
    uri: 'http://localhost:4000'
})


// You’re instantiating a WebSocketLink that knows the subscriptions endpoint. 
// The subscriptions endpoint in this case is similar to the HTTP endpoint, 
// except that it uses the ws instead of http protocol. 
// Notice that you’re also authenticating the websocket connection 
// with the user’s token that you retrieve from localStorage.

const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem(AUTH_TOKEN)
        }
    }
})


// This middleware will be invoked every time ApolloClient sends a request to the server. 
// Apollo Links allow you to create middlewares that let you modify requests 
// before they are sent to the server.

// Let’s see how it works in our code: 
// first, we get the authentication token from localStorage if it exists; 
// after that, we return the headers to the context so httpLink can read them.

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})



// split is used to “route” a request to a specific middleware link. 
// It takes three arguments, the first one is a test function which returns a boolean. 
// The remaining two arguments are again of type ApolloLink. 
// If test returns true, the request will be forwarded to the link passed as the second argument. 
// If false, to the third one.


// In your case, the test function is checking whether the requested operation is a subscription. 
// If this is the case, it will be forwarded to the wsLink, 
// otherwise (if it’s a query or mutation), the authLink.concat(httpLink) will take care of it:

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
)

// Now you instantiate ApolloClient by passing in the httpLink 
// and a new instance of an InMemoryCache.
// Now you also need to make sure ApolloClient gets instantiated 
// with the correct link - update the constructor call as follows:

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})


// Finally you render the root component of your React app. 
// The App is wrapped with the higher-order component ApolloProvider 
// that gets passed the client as a prop.

ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
