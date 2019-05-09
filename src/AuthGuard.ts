export default (to: any, from: any, next: any) => {
  if (!localStorage.getItem("token")) {
    next({
      path: "/login"
    });
  } else {
    next();
  }
};
