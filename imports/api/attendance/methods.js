import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import { Attendances } from './attendance'

export const insertAttendance = new ValidatedMethod({
  name: 'insertAttendance',
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({
      name: String,
      telephone: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      status: String,
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
  findAttendance({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)

    const data = Customer.aggregate([
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
    const total = Customer.find(selector).count()
    return { data, total }
  },
  checkExistAt({selector}) {
    return Customer.findOne(selector)
  },
  getAttendanceById(id) {
    return Customer.findOne({ _id: id })
  },
  insertAtt(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      name: String,
      telephone: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      status: String,
    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      console.log('doc', doc)
      // Comsert1.insert(doc)
      return Customer.insert(doc)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert customer error', error)
    }
  },
  updateAttendance(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      _id: String,
      name: String,
      telephone: {
        type: String,
        optional: true,
      },
      address: {
        type: String,
        optional: true,
      },
      status: String,
    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      return Customer.update({ _id: doc._id }, { $set: doc })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Update customer error', error)
    }
  },
  removeAttendance({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id })

    if (!Meteor.isServer) return false

    try {
      return Customer.remove({ _id: id })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Remove customer error', error)
    }
  },
})
