  
const authResolver = require('./auth');
const collectionsResolver = require('./collections');
const numbersResolver = require('./numbers');

const rootResolver = {
  ...authResolver,
  ...collectionsResolver,
  ...numbersResolver
}

module.exports = rootResolver;

/*
const bcrypt = require('bcryptjs');

const User = require('../../models/user');

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

const singleCollection = async collectionID => {
  try{
    const collection = await Collection.findById(collectionID);
    return transformCollection(collection);
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
        return transformCollection(collection);
      });
    } catch (err) {
      throw err;
    }
  },
  numbers: async () => {
    try {
       const numbers = await Number.find();
       return numbers.map(number => {
          console.log(transformNumber(number));
          return transformNumber(number);
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
  },
  createNumber: async args => {
    const collectionIn = await Collection.findById(args.numberInput.collectionID);
    //for collectionIn, we might store id only if it helps the site speed
    //collectionIn example: "5e84a36b0b9f7507fc5c8cb6"
    const number = new Number({
      value: args.numberInput.value,
      link: args.numberInput.link,
      description: args.numberInput.description,
      dataType: args.numberInput.dataType,
      collectionIn: collectionIn,
      creator: '5e8273a778945f1a8a5f9751',       
    });
    
    //collectionIn: "5e84a36b0b9f7507fc5c8cb6"
    const result = await number.save();
    return transformNumber(result);
  },
  deleteNumber: async args => {
    try {
      const number = await Number.findById(args.numberId).populate('collectionIn');
      const collectionIn = transformCollection(number.collectionIn);
      await Number.deleteOne({ _id: args.numberId });
      return collectionIn;
    } catch (err) {
      throw err;
    }
  }
};*/