export default function filterAsyncRoutes(routesName, asyncRoutes) {
  return asyncRoutes.filter(item => {
    if (routesName.includes(item.name)) {
      if (item.children && item.children.length) {
        item.children = filterAsyncRoutes(routesName, item.children);
      }
      return true;
    }
  });
}
