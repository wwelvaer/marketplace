const db = require("../models");
const Booking = db.booking;
const Listing = db.listing;
const User = db.user;

/** get all bookings on a given listingid
 * expected Query param:
 * @param id listingID 
 */
exports.getListingBookings = (req, res) => {
    // find listing
    Listing.findOne({
        where: {
            listingID: req.query.id
        },
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (listing.userID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to view another user's bookings on his listings"});
        // find all bookings
        Booking.findAll({
            where: {
                listingID: listing.listingID
            },
            // include userdata (when user has no firstName and lastName use email as name)
            include: {model: User, attributes: ['userID', [db.sequelize.literal("CASE WHEN firstName = '' AND lastName = '' THEN email ELSE CONCAT(firstName, ' ', lastName) END"), 'name']]},
        }).then(b => {
            // send data
            return res.status(200).send({bookings: b})
        })
    })
};

// get all bookings made by given user
exports.getUserBookings = (req, res) => {
    Booking.findAll({
        where: {
            bookerID: req.userId // get user from webtoken
        },
        // include listingdata
        include: {model: Listing, attributes: ['listingID', 'name', 'availableAssets', 'startDate', 'price', 'picture', 'userID']},
    }).then(b => {
        // send data
        return res.status(200).send({bookings: b})
    })
};

/** creates booking
 * expected params in body:
 * @param listingID
 * @param numberOfAssets
 */
exports.createBooking = (req, res) => {
    // find listing
    Listing.findOne({
        where: {
            listingID: req.body.listingID
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (!req.body.numberOfAssets)
            return res.status(400).send({ message: "Number of assets not given"});
        if (listing.availableAssets < req.body.numberOfAssets)
            return res.status(400).send({ message: "Not enough assets available" });
        // create booking
        Booking.create({
            numberOfAssets: req.body.numberOfAssets,
            pricePerAsset: listing.price,
            bookerID: req.userId, // get user from webtoken
            status: 'reserved',
            listingID: listing.listingID
        }).then(b => {
            // update listing's available assets
            listing.availableAssets -= b.numberOfAssets;
            listing.save().then(l => {
                res.send({ message: "Booking was created successfully!", bookingID: b.bookingID });
            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
}

/** cancels booking (doesn't delete)
 * expected query param:
 * @param id bookingID 
 */
exports.cancelBooking = (req, res) => {
    // find booking
    Booking.findOne({
        where: {
            bookingID: req.query.id
        },
        // include userID extracted from listing
        include: {model: Listing, attributes: ['userID']},
    }).then(booking => {
        // catch errors
        if (!booking)
            return res.status(404).send({ message: "Invalid bookingID" });
        // compare user from webtoken with data
        if (req.userId !== booking.bookerID && req.userId !== booking.listing.userID) 
            return res.status(401).send({ message: "Unauthorized to cancel booking"});
        // find listing
        Listing.findOne({
            where: {
                listingID: booking.listingID
            }
        }).then(listing => {
            // catch error
            if (!listing)
                return res.status(404).send({ message: "Booking has invalid listingID" });
            // update listing's available assets
            listing.availableAssets += booking.numberOfAssets;
            listing.save().then(_ => {
                // update booking's status
                booking.status = 'cancelled';
                booking.save().then(_ => {
                    res.send({ message: "Booking was cancelled successfully!" });
                })
            })
        })
    })
}

/** confirm payment of booking
 * expected query param:
 * @param id bookingID 
 */
exports.confirmPayment = (req, res) => {
    // find booking
    Booking.findOne({
        where: {
            bookingID: req.query.id
        },
        // include userID extracted from listing
        include: {model: Listing, attributes: ['userID']},
    }).then(booking => {
        // catch errors
        if (!booking)
            return res.status(404).send({ message: "Invalid bookingID" });
        // compare user from webtoken with data 
        if (req.userId !== booking.listing.userID)
            return res.status(401).send({ message: "Unauthorized to confirm payment"});
        // update booking's status
        booking.status = 'payed';
        booking.save().then(_ => {
            res.send({ message: "Payment was confirmed successfully!" });
        }) 
    })
}
