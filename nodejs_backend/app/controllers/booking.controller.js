const db = require("../models");
const Booking = db.booking;
const Listing = db.listing;

exports.getListingBookings = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        },
    }).then(listing => {
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (listing.listingID !== req.userId)
            return res.status(401).send({ message: "Unauthorized to view another user's bookings on his listings"});
        Booking.findAll({
            where: {
                listingID: listing.listingID
            },
            include: {model: User, attributes: ['userID', 'firstName']},
        }).then(b => {
            return res.status(200).send({bookings: b})
        })
    })
};

exports.getUserBookings = (req, res) => {
    Booking.findAll({
        where: {
            bookerID: req.userId
        },
        include: {model: Listing, attributes: ['listingID', 'name']},
    }).then(b => {
        return res.status(200).send({bookings: b})
    })
};

exports.createBooking = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.body.listingID
        }
    }).then(listing => {
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (listing.availableAssets < req.body.numberOfAssets)
            return res.status(400).send({ message: "Not enough assets available" });
        Booking.create({
            numberOfAssets: req.body.numberOfAssets,
            pricePerAsset: listing.price,
            bookerID: req.userId,
            listingID: listing.listingID
        }).then(b => {
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

exports.deleteBooking = (req, res) => {
    Booking.findOne({
        where: {
            bookingID: req.query.id
        }
    }).then(booking => {
        if (!booking)
            return res.status(404).send({ message: "Invalid bookingID" });
        if (req.userId !== booking.bookerID)
            return res.status(401).send({ message: "Unauthorized to delete another user's booking"});
        Listing.findOne({
            where: {
                listingID: booking.listingID
            }
        }).then(listing => {
            if (!listing)
                return res.status(404).send({ message: "Booking has invalid listingID" });
            listing.availableAssets += booking.numberOfAssets;
            listing.save().then(_ => {
                booking.destroy().then(_ => {
                    res.send({ message: "Booking was deleted successfully!" });
                })
            })
        })
    })
}
