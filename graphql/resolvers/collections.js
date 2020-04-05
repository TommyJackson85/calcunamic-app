const Collection = require('../../models/collection');
const { transformCollection } = require('./merge');

module.exports = {
    collections: async () => {
    try {
      const collections = await Collection.find();
      return collections.map(collection => {
        return transformCollection(collection);
      });
    } catch (err) {
      throw err;
    }
  },
  createCollection: async args => {
    const collection = new Collection({
      title: args.collectionInput.title,
      description: args.collectionInput.description,
      numbers: +args.collectionInput.numbers,
      date: dateToString(args.collectionInput.date),
      creator: '5e8273a778945f1a8a5f9751'
    });
    let createdCollection;
    try {
      const result = await collection.save();
      createdCollection = transformCollection(result);
      const creator = await User.findById('5e8273a778945f1a8a5f9751');

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