const db = require("../models");
const Category = db.category;

// returns all categories
exports.getCategories = (req, res) => {
    Category.findAll().then(l => {
        res.status(200).send({categories: l})
    })
};

/** create category
 * expected param in body
 * @param name
 */
exports.createCategory = (req, res) => {
    Category.create({
        name: req.body.name
    }).then(c => {
        res.send({message: "Category created successfully"})
    })
};

/** delete category
 * expected param in body
 * @param name
 */
 exports.deleteCategory = (req, res) => {
    Category.findOne({
        where: {
            name: req.body.name
        }
    }).then(c => {
        if (!c)
            return res.status(404).send({ message: "Invalid Category name" });
        c.destroy().then(_ => res.send({message: "Category deleted successfully"}))
    })
};