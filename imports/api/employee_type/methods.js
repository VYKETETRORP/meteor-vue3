import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import { EmployeeTypes } from "./employee_type";
export const insertEmployee = new ValidatedMethod({
  name: "insertEmployee",
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({
      name: {
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
      throw new Meteor.Error("Insert employee error", error);
    }
  },
});

Meteor.methods({
  findEmployeeType({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false;
    selector = selector || {};
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage;
    const skip = rowsPerPage * (page - 1);

    const data = EmployeeTypes.aggregate([
      
        
      {
        $lookup: {
          from: "branchs",
          as: "emtypeDoc",
          localField: "branchId",
          foreignField: "_id",
        },
      },
      { $unwind: { path: "$emtypeDoc" } },
     
   
       {
        $project: {
          _id:1,
          name: 1,
          status: 1,
          // positioname :"$emtypeDoc.position",
          brachname:"$emtypeDoc.branchId"
      
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
    const total = EmployeeTypes.find(selector).count();
    return { data, total };
  },
  checkExist3({ selector }) {
    return  EmployeeTypes.findOne(selector);
  },
  getEmployeeTypeById(id) {
    return  EmployeeTypes.findOne({ _id: id });
  },
  insertEmployeeType(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      name: {
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
      return EmployeeTypes.insert(doc);
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Insert Employee type error", error);
    }
  },

  
  fetchEmploye(){
    return EmployeeTypes.find({}).fetch()

  },

updateEmployeeType(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      _id: String,

      name: {
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
      return EmployeeTypes.update({ _id: doc._id }, { $set: doc });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Update Department error", error);
    }
  },
  removeEmployeeType({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id });

    if (!Meteor.isServer) return false;

    try {
      return EmployeeTypes.remove({ _id: id });
    } catch (error) {
      console.log("error", error);
      throw new Meteor.Error("Remove employee type error", error);
    }
  },

});
