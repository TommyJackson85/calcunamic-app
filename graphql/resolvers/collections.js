const Collection = require('../../models/collection');
const { transformCollection } = require('./merge');
const User = require('../../models/user');

module.exports = {
    collections: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    try {
      const collections = await Collection.find();
      return collections.map(collection => {
        return transformCollection(collection);
      });
    } catch (err) {
      throw err;
    }
  },
  createCollection: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    const collection = new Collection({
      title: args.collectionInput.title,
      description: args.collectionInput.description,
      numbers: +args.collectionInput.numbers,
      date: dateToString(args.collectionInput.date),
      creator: req.userId
    });
    let createdCollection;
    try {
      const result = await collection.save();
      createdCollection = transformCollection(result);
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdCollections.push(collection);
      await creator.save();

      return createdCollection;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};