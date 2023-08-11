import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import { Employees } from './employee'
export const insertEm = new ValidatedMethod({
  name: 'insertEm',
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({
     
      name: {
        type: String,
        optional: false,
      },
      typeId: {
        type: String,
        optional: true,
      },
      positionId: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      telephone: {
        type: String,
        optional: true,
      },
      startDate: {
        type: Date,
        optional: true,
      },
      checkIn: {
        type: Date,
        optional: false,
      },
      checkOut: {
        type: Date,
        optional: false,
      },
      branchId: {
        type: String,
        optional: true,
      },
    }).validator(),
  run(doc) {
    if (!Meteor.isServer) return false

    try {
      // return Customer.insert(doc)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert customer error', error)
    }
  },
})

Meteor.methods({
  findEmployee({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)
    console.log('em',selector)

    const data =  Employees.aggregate([
      {
        $match: selector,
      },
      
      {
        $lookup: {
          from: "app_branches",
          as: "branchDoc",
          localField: "branchId",
          foreignField: "_id",
        },
      },
          {
        $lookup: {
          from: "position",
          as: "posDoc",
          localField: "positionId",
          foreignField: "_id",
        },
      },
         {
        $lookup: {
          from: "employeetype",
          as: "typeDoc",
          localField: "typeId",
          foreignField: "_id",
        },
      },
      { $unwind: { path: "$branchDoc" } },
         { $unwind: { path: "$typeDoc" } },
             { $unwind: { path: "$posDoc" } },
   
       {
        $project: {
          _id:1,
          name: 1,
          status: 1,
          branchId:1,
          positionId:1,
          posName:"$posDoc.position",
          // positioname :"$emtypeDoc.position",
          branchName:"$branchDoc.name",
          telephone:1,
          address:1,
          startDate:1,
          checkIn:1,
          checkOut:1,
          typeId:1,
          typeName:"$typeDoc.name",
          addressss: 1,
          
      
        },
      },
          
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
    const total = Employees.find(selector).count()
    console.log('em data', data)
    return { data, total }
  },
  checkExistt({selector}) {
    return Employees.findOne(selector)
  },
  fetchEmploye(selector){
    return Employees.find(selector).fetch()

  },
  getEmployeeId(id) {
    return Employees.findOne({ _id: id })
  },
  insertEmployee1(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      
      name: {
        type: String,
        optional: false,
      },
      typeId: {
        type: String,
        optional: true,
      },
      positionId: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      telephone: {
        type: String,
        optional: true,
      },
      startDate: {
        type: Date,
        optional: true,
      },
      checkIn: {
        type: Date,
        optional: false,
      },
      checkOut: {
        type: Date,
        optional: false,
      },
      branchId: {
        type: String,
        optional: true,
      },
    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      console.log('doc', doc)
      // Comsert1.insert(doc)
      return Employees.insert(doc)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert Employee error', error)
    }
  },
  updateEmployee(doc) {
    new SimpleSchema({
      _id: String,
      name: {
        type: String,
        optional: false,
      },
      typeId: {
        type: String,
        optional: true,
      },
      positionId: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      telephone: {
        type: String,
        optional: true,
      },
      startDate: {
        type: Date,
        optional: true,
      },
      checkIn: {
        type: Date,
        optional: false,
      },
      checkOut: {
        type: Date,
        optional: false,
      },
      branchId: {
        type: String,
        optional: true,
      },
     
    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      return Employees.update({ _id: doc._id }, { $set: doc })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Update employee error', error)
    }
  },
  removeEmployee({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id })

    if (!Meteor.isServer) return false

    try {
      return Employees.remove({ _id: id })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Remove Employee error', error)
    }
  },
})
