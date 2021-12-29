
import Login from './login';
import Register from './register';
import Navi from './navi';
  const routes = [{
    path: '/home',
    text: '首页',
    isNav: true,
    // icon: '&#xe61e;',
    component: Navi
  }, {
    path: '/mall',
    text : '商城',
    isNav: true,
    // icon: '&#xe615;',
    component: Login
  }, {
    path: '/mine',
    text: '我的',
    isNav: true,
    // icon: '&#xe625;',
    component: Login
  }, {
    path: '/cart',
    text: '购物车',
    isNav: true,
    // icon: '&#xe617;',
    component: Login
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/mall/detail/:id',
    isNav: false,
    component: Detail
  }, {
    path: '/404',
    isNav: false,
    component: NoPages
  }
  ];
  export default routes