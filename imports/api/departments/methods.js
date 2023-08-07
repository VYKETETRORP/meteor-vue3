import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import { Departments } from "./departments";
export const insertDepartment = new ValidatedMethod({
  name: "insertDepartment",
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({
      department: {
        type: String,
        optional: false,
      },
      branchId: {
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
  findDepartment({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false;
    selector = selector || {};
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage;
    const skip = rowsPerPage * (page - 1);

    const data = Departments.aggregate([
      
      {
        $lookup: {
          from: "branchs",
          as: "departmentDoc",
          localField: "branchId",
          foreignField: "_id",
        },
      },
      { $unwind: { path: "$departmentDoc" } },
     
   
       {
        $project: {
          _id:1,
          department: 1,
          status: 1,
          name: "$departmentDoc.name",
      
        },
      },
      {
        $match: selector,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
     
    ]);
    const total = Departments.find(selector).count();
    return { data, total };
  },
  checkExist2({ selector }) {
    return Departments.findOne(selector);
  },
  getDepartmentById(id) {
    return Departments.findOne({ _id: id });
  },
  insert(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      department: {
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
    }).validate(doc);

    if (!Meteor.isServer) return false;

    try {
      console.log("doc", doc);
      // Comsert1.insert(doc)
      return Departments.insert(doc);
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Insert Department error", error);
    }
  },
  fetchdepartment(){
    return Departments.find({}).fetch()

  },
  

  updateDepartment(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      _id: String,

      department: {
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
    
    }).validate(doc);

    if (!Meteor.isServer) return false;

    try {
      return Departments.update({ _id: doc._id }, { $set: doc });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Update Department error", error);
    }
  },
  removeDepartment({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id });

    if (!Meteor.isServer) return false;

    try {
      return Departments.remove({ _id: id });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Remove customer error", error);
    }
  },

});
