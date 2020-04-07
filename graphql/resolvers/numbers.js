const Collection = require('../../models/collection');
const Number = require('../../models/number');
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
  createNumber: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized!');
    }
    const collectionIn = await Collection.findById(args.numberInput.collectionID);
    //for collectionIn, we might store id only if it helps the site speed
    //collectionIn example: "5e84a36b0b9f7507fc5c8cb6"
    const number = new Number({
      value: args.numberInput.value,
      link: args.numberInput.link,
      description: args.numberInput.description,
      dataType: args.numberInput.dataType,
      collectionIn: collectionIn,
      creator: req.userId,       
    });
    
    //collectionIn: "5e84a36b0b9f7507fc5c8cb6"
    const result = await number.save();
    return transformNumber(result);
  },
  deleteNumber: async (args, req) => {
    if(!req.isAuth){
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