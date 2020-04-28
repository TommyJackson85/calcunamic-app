const Collection = require('../../models/collection');
const { transformCollection } = require('./merge');
const { dateToString } = require('../../helpers/date');
const User = require('../../models/user');
const Number = require('../../models/number');

module.exports = {
  collections: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    try {
      const collections = await Collection.find({_id: {$in: args.collectionsList}});
      console.log(collections);
      return collections.map(collection => {
        return transformCollection(collection);
      });
    } catch (err) {
      throw err;
    }
  },
  usersCollections: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    try {
      const user = await User.findById(args.userId).populate('createdCollections').populate('numbers');
      console.log(user);
      console.log(user.createCollections);
      return user.createdCollections.map(collection => {
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