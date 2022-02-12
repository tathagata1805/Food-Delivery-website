// imports from routes
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController')
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');

// Imports from middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');

function initRoutes(app) {
  // Rendering the home route from controller
  app.get("/", homeController().index);

  // Rendering the login route from controller
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);

  // Rendering the register route from controller
  app.get("/register", guest, authController().register);
  app.post('/register', authController().postRegister);

  // Logout route
  app.post('/logout', authController().logout);

  // Rendering the cart route from controller
  app.get("/cart", cartController().index);

  app.post("/update-cart", cartController().update);

  // Placing Order route
  app.post('/orders', auth, orderController().store);

  // Customer Orders route
  app.get('/customers/orders', auth, orderController().index)
  app.get('/customers/orders/:id', auth, orderController().show)

  // Admin routes
  app.get('/admin/orders', admin, adminOrderController().index)

  // Order status route
  app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoutes;
