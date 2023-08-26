import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
// import { Position } from "postcss";
import { Positions } from "./position";
export const insertPosition = new ValidatedMethod({
  name: "insertPosition",
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({
      position: {
        type: String,
        optional: false,
      },
      branchId: {
        type: String,
        optional: false,
      },
      departmentId: {
        type: String,
        optional: false,
      },
      status: {
        type: String,
        optional: false,
      },
    }).validator(),
  run(doc) {
    if (!Meteor.isServer) return false;

    try {
      // return Customer.insert(doc)
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Insert department error", error);
    }
  },
});

Meteor.methods({
  findPosition({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false;
    selector = selector || {};
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage;
    const skip = rowsPerPage * (page - 1);
    console.log('selector',selector)
    const data = Positions.aggregate([
      {
        $match: selector,
      },
      {
        $lookup: {
          from: "departments",
          as: "deDoc",
          localField: "departmentId",
          foreignField: "_id",
        },
      },
      { $unwind: { path: "$deDoc" } },
       {
        $project: {
          _id:1,
          position: 1,
          status: 1,
         branchId:1,
          departmentId:1,
          department: "$deDoc.department",
          branchName:"$deDoc.name",
      
        }},
      
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
     
    ]);
    const total = Positions.find(selector).count();
    console.log('data',data)
    return { data, total };
  },
  checkExistp({ selector }) {
    return Positions.findOne(selector);
  },
  getPositionById(id) {
    return Positions.findOne({ _id: id });
  },

  insert1(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      position: {
        type: String,
        optional: false,
      },
      status: {
        type: String,
        optional: false,
      },
      branchId: {
        type: String,
        optional: false,
      },
      departmentId: {
        type: String,
        optional: false,
      },
    }).validate(doc);

    if (!Meteor.isServer) return false;

    try {
      console.log("doc", doc);
      // Comsert1.insert(doc)
      return Positions.insert(doc);
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Insert Position error", error);
    }
  },
  updatePosition(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      _id: String,

      position: {
        type: String,
        optional: false,
      },
      status: {
        type: String,
        optional: true,
      },
      branchId: {
        type: String,
        optional: false,
      },
      departmentId: {
        type: String,
        optional: false,
      },
    
    }).validate(doc);

    if (!Meteor.isServer) return false;

    try {
      return Positions.update({ _id: doc._id }, { $set: doc });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Update Department error", error);
    }
  },
  fetchPosition(selector){
    return Positions.find(selector).fetch()

  },
  removePosition({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id });

    if (!Meteor.isServer) return false;

    try {
      return Positions.remove({ _id: id });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Remove customer error", error);
    }
  },

});
