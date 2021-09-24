const db = require("../models");
const Listing = db.listing;
const Transaction = db.transaction;
const User = db.user;

// returns all listings
exports.getAllListings = (req, res) => {
    Listing.findAll({
        where: {
            status: 'active'
        },
    }).then(l => {
        return res.status(200).send({listings: l})
    })
};
 
/** get all listings made by given user
 * expected query param:
 * @param id userID 
 */
exports.getUserListings = (req, res) => {
    Listing.findAll({
        where: {
            userID: req.query.id
        }
    }).then(l => {
        return res.status(200).send({listings: l})
    })
};

/** create listing
 * expected params in body (not required):
 * @param name
 * @param description
 * @param availableAssets
 * @param startDate
 * @param price
 * @param picture // image in base64 format
 * @param categories
 */
exports.createListing = (req, res) => {
    Listing.create({
        name: req.body.name,
        description: req.body.description,
        availableAssets: req.body.availableAssets,
        startDate: req.body.startDate,
        price: req.body.price,
        picture: req.body.picture,
        categories: req.body.categories,
        status: 'active',
        userID: req.userId
    }).then(l => {
        res.send({ message: "Listing was created successfully!", listingID: l.listingID });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
}

/** get listingdata
 * expected query param:
 * @param id listingID 
 */
exports.getListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        },
        // include userName extracted from user
        include: {model: User, attributes: ['userName']},
    }).then(listing => {
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        // send listingdata
        res.status(200).send({
            listingID: listing.listingID,
            name: listing.name,
            description: listing.description,
            availableAssets: listing.availableAssets,
            startDate: listing.startDate,
            price: listing.price,
            picture: listing.picture,
            categories: listing.categories,
            status: listing.status,
            userID: listing.userID,
            userName: listing.user.userName
        })
    })
    
};

/** update listingdata
 * expected query param:
 * @param id listingID
 * expected params in body (not required):
 * @param name
 * @param description
 * @param availableAssets
 * @param startDate
 * @param price
 * @param picture // image in base64 format
 * @param categories
 */
exports.postListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (req.userId !== listing.userID)
            return res.status(401).send({ message: "Unauthorized to edit another user's listing"});
        // save data
        listing.name = req.body.name
        listing.description = req.body.description
        listing.availableAssets = req.body.availableAssets
        listing.startDate = req.body.startDate
        listing.price = req.body.price
        listing.picture = req.body.picture
        listing.categories = req.body.categories
        listing.save().then(_ => {
            res.send({ message: "Listing was updatet successfully!" });
        }).catch(err => {
            res.status(500).send({ message: err.message})
        });
    })
};

/** cancel listing
 * expected query param:
 * @param id listingID
 */
exports.cancelListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (req.userId !== listing.userID)
            return res.status(401).send({ message: "Unauthorized to cancel another user's listing"});
        // cancel all transactions
        Transaction.findAll({
            where: {
                listingID: listing.listingID
            }
        }).then(transactions => {
            // cancel all transactions of listing
            transactions.forEach(t => {
                t.status = 'cancelled';
                // TODO: notification
                t.save();
            });
            // cancel listing
            listing.status = 'cancelled'
            listing.save().then(_ => {
                res.send({ message: "Listing was cancelled successfully!" });
            })
        })
        
    })
}
