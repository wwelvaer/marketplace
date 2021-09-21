const db = require("../models");
const Listing = db.listing;

// returns all listings
exports.getAllListings = (req, res) => {
    Listing.findAll({
        attributes: ['listingID', 'name', 'availableAssets', 'startDate', 'price', 'picture', 'userID']
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
        attributes: ['listingID', 'name', 'availableAssets', 'startDate', 'price', 'picture', 'userID'],
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
 */
exports.createListing = (req, res) => {
    Listing.create({
        name: req.body.name,
        description: req.body.description,
        availableAssets: req.body.availableAssets,
        startDate: req.body.startDate,
        price: req.body.price,
        picture: req.body.picture,
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
        }
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
            userID: listing.userID
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
        listing.save().then(_ => {
            res.send({ message: "Listing was updatet successfully!" });
        }).catch(err => {
            res.send({ message: "Listing couldn't be updated" , err: err})
        });
    })
};

/** delete listing
 * expected query param:
 * @param id listingID
 */
exports.deleteListing = (req, res) => {
    Listing.findOne({
        where: {
            listingID: req.query.id
        }
    }).then(listing => {
        // catch errors
        if (!listing)
            return res.status(404).send({ message: "Invalid listingID" });
        if (req.userId !== listing.userID)
            return res.status(401).send({ message: "Unauthorized to delete another user's listing"});
        // delete listing
        listing.destroy().then(_ => {
            res.send({ message: "Listing was deleted successfully!" });
        })
    })
}
