import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
// import Customer from './customers'
// import Branchs from './branch'
import { Branchs } from './branch'
export const insertBranch = new ValidatedMethod({
  name: 'insertBranch',
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({
     
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
        type: Date,
        optional: false,
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
  findBranch({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)

    const data = Branchs.aggregate([
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
    const total = Branchs.find(selector).count()
    return { data, total }
  },
  checkExist1({selector}) {
    return Branchs.findOne(selector)
  },
  getBranchById(id) {
    return Branchs.findOne({ _id: id })
  },
  insertBranch1(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      
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
        type: Date,
        optional: false,
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
  updateBranch(doc) {
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
      return Branchs.update({ _id: doc._id }, { $set: doc })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Update branch error', error)
    }
  },
  fetchBranch(){
    return Branchs.find({}).fetch()
  },
  removeBranch({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id })

    if (!Meteor.isServer) return false

    try {
      return Branchs.remove({ _id: id })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Remove customer error', error)
    }
  },
})
