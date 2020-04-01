const bcrypt = require('bcryptjs');

const Collection = require('../../models/collection');
const User = require('../../models/user');

const collections = async collectionIds => {
  try {
    const collections = await Collection.find({ _id: { $in: collectionIds } });
    collections.map(collection => {
      return {
        ...collection._doc,
        _id: collection.id,
        date: new Date(collection._doc.date).toISOString(),
        creator: user.bind(this, collection.creator)
      };
    });
    return collections;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdCollections: collections.bind(this, user._doc.createdCollections)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
    collections: async () => {
    try {
      const collections = await Collection.find();
      return collections.map(collection => {
        return {
          ...collection._doc,
          _id: collection.id,
          date: new Date(collection._doc.date).toISOString(),
          creator: user.bind(this, collection._doc.creator)
        };
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
      date: new Date(args.collectionInput.date),
      creator: '5e8273a778945f1a8a5f9751'
    });
    let createdCollection;
    try {
      const result = await collection.save();
      createdCollection = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(collection._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
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
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  }
}