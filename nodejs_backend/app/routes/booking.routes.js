const { authJwt } = require("../middleware");
const controller = require("../controllers/booking.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get(
      "/api/bookings/listing",
      [authJwt.verifyToken],
      controller.getListingBookings
    );
  
    app.get(
      "/api/bookings/user",
      [authJwt.verifyToken],
      controller.getUserBookings
    );
  
    app.post(
      "/api/booking/create",
      [authJwt.verifyToken],
      controller.createBooking
    );

    app.get(
      "/api/booking/cancel",
      [authJwt.verifyToken],
      controller.cancelBooking
    );

    app.get(
      "/api/booking/confirmPayment",
      [authJwt.verifyToken],
      controller.confirmPayment
    );
  };