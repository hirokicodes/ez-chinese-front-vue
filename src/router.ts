import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import AuthGuard from "./AuthGuard";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue")
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./views/Signup.vue")
    },
    {
      path: "/flashcards",
      name: "flashcards",
      component: () => import("./views/Flashcards.vue"),
      beforeEnter: AuthGuard
    },
    {
      path: "/decks",
      name: "decks",
      component: () => import("./views/Decks.vue"),
      beforeEnter: AuthGuard
    },
    {
      path: "/deck/:id",
      name: "deck",
      component: () => import("./views/Deck.vue")
    }
  ]
});
