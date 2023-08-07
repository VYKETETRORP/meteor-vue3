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
        type: String,
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

    const data =  Employees.aggregate([
      {
        $match: selector,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
    const total = Employees.find(selector).count()
    return { data, total }
  },
  checkExistt({selector}) {
    return Employees.findOne(selector)
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
        type: String,
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
      return Branchs.insert(doc)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert Branch error', error)
    }
  },
  updateEmployee(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      _id: String,
    
      name: {
        type: String,
        optional: false,
      },
      address: {
        type: String,
        optional: true,
      },
      checkIn: {
        type: Date,
        optional: false,
      },
      checkOut: {
        type: String,
        optional: false,
      },
     
    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      return Employees.update({ _id: doc._id }, { $set: doc })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Update branch error', error)
    }
  },
//   fetchBranch(){
//     return Branchs.find({}).fetch()
//   },
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
      throw new Meteor.Error('Remove customer error', error)
    }
  },
})
