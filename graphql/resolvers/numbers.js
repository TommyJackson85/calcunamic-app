const Collection = require('../../models/collection');
const Number = require('../../models/number');
const { dateToString } = require('../../helpers/date');
const User = require('../../models/user');
const {transformNumber, transformCollection } = require('./merge');


module.exports = {
  numbers: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
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
  createCollectionWithNumbers: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    let createdCollection;
    try {
      const collection = new Collection({
        title: args.collectionNumbersInput.collectionInput.title,
        description: args.collectionNumbersInput.collectionInput.description,
        date: dateToString(args.collectionNumbersInput.collectionInput.date),
        creator: req.userId
      });

      const numbers = [];
      
      for (i=0; i< args.collectionNumbersInput.numberInputs.length; i++ ) {
        let newNumber = new Number({
          value: args.collectionNumbersInput.numberInputs[i].value,
          link: args.collectionNumbersInput.numberInputs[i].link,
          description: args.collectionNumbersInput.numberInputs[i].description,
          dataType: args.collectionNumbersInput.numberInputs[i].dataType,
          collectionsIn: [ { _id: collection.id } ],
          creator: req.userId
        });
        let numResult = await newNumber.save();
        transformNumber(numResult);
        numbers.push(numResult);
        collection.numbers.push({_id: numResult.id});        
      };

      const collectionResult = await collection.save();
      createdCollection = transformCollection(collectionResult);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdCollections.push(collectionResult);
      await creator.save();
      return createdCollection;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createNumber: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    const collectionsIn = await Collection.find({ _id :{ $in: args.numberInput.collectionIDs} }).populate("numbers");

    console.log("collectionsIn");
    console.log(collectionsIn);
    const number = new Number({
      value: args.numberInput.value,
      link: args.numberInput.link,
      description: args.numberInput.description,
      dataType: args.numberInput.dataType,
      collectionsIn: collectionsIn,
      creator: req.userId,  
    });
    
    for (i = 0; i<=collectionsIn.length-1; i++ ){
      collectionsIn[i].numbers.push( {  _id: number._id  } );
      collectionsIn[i].save()
      transformCollection(collectionsIn[i]);
    }
    console.log(collectionsIn);
    const result = await number.save();
    return transformNumber(result);
  },
  deleteNumber: async (args, req) => {
    if (!req.isAuth){
      throw new Error('Unauthorized!');
    }
    try {
      const number = await Number.findById(args.numberId).populate('collectionIn');
      const collectionIn = transformCollection(number.collectionIn);
      await Number.deleteOne({ _id: args.numberId });
      return collectionIn;
    } catch (err) {
      throw err;
    }
  }
};