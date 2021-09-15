const db = require("../models");
const Listing = db.listing;

exports.getAllListings = (req, res) => {
    Listing.findAll({
        attributes: ['name', 'availableAssets', 'startDate', 'price', 'picture']
    }).then(l => {
        return res.status(200).send({listings: l})
    })
};

exports.getUserListings = (req, res) => {
    Listing.findAll({
        attributes: ['name', 'availableAssets', 'startDate', 'price', 'picture'],
        where: {
            userID: req.query.id
        }
    }).then(l => {
        return res.status(200).send({listings: l})
    })
};

exports.createListing = (req, res) => {
    Listing.create({
        name: req.body.name,
        description: req.body.description,
        availableAssets: req.body.availableAssets,
        startDate: req.body.startDate,
        price: req.body.price,
        picture: req.body.picture,
        userID: req.userId
    }).then(_ => {
        res.send({ message: "Listing was createt successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

exports.getListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        res.status(200).send({
            name: listing.name,
            description: listing.description,
            availableAssets: listing.availableAssets,
            startDate: listing.startDate,
            price: listing.price,
            picture: listing.picture,
            userID: listing.userID
        })
    })
    
};

exports.postListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        listing.name = req.body.name
        listing.description = req.body.description
        listing.availableAssets = req.body.availableAssets
        listing.startDate = req.body.startDate
        listing.price = req.body.price
        listing.picture = req.body.picture
        user.save().then(_ => {
            res.send({ message: "Listing was updatet successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
};
