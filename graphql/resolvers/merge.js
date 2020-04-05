const Collection = require('../../models/collection');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');


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

const collections = async collectionIds => {
    try {
      const collections = await Collection.find({ _id: { $in: collectionIds } });
      return collections.map(collection => {
        return transformCollection(collection);
      });
    } catch (err) {
      throw err;
    }
};

const singleCollection = async collectionID => {
    try{
      const collection = await Collection.findById(collectionID);
      return transformCollection(collection);
    } catch (err) {
      throw err;
    }
};

const transformCollection = collection => {
    return {
      ...collection._doc,
      _id: collection.id,
      date: dateToString(collection._doc.date),
      creator: user.bind(this, collection.creator)
    };
};


const transformNumber = number => {
    return { 
      ...number._doc, 
      _id: number.id,
      collectionIn: singleCollection.bind(this, number._doc.collectionIn),
      creator: user.bind(this, number._doc.creator),
      createdAt: dateToString(number._doc.createdAt),
      updatedAt: dateToString(number._doc.updatedAt)
    };
}

exports.transformCollection = transformCollection;
exports.transformNumber = transformNumber;

//exports.user = user;
//exports.collections = collections;
//exports.singleCollection = singleCollection;