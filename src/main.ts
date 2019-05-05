import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/assets/styles/main.scss";

import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, Observable, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import VueApollo from "vue-apollo";

Vue.config.productionTip = false;

Vue.use(VueApollo);

const cache = new InMemoryCache({
  dataIdFromObject: object => object.id
});

const request = (operation: any) => {
  const token = localStorage.getItem("token");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle: any;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
  credentials: "include"
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000",
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : null
    }
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  requestLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link,
  cache
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
