import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import { Attendances } from './attendance'
export const insertAtten = new ValidatedMethod({
  name: 'insertAtten',
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({
      type: { type: String, optional: true, },
      tranDate: { type: Date, optional: true, },
      reason: { type: String, optional: false, },
      branchId: { type: String, optional: true, },
      employeeId: { type: String, optional: true, },



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
    console.log('em', selector)

    const data = Attendances.aggregate([
      {
        $match: selector,
      },

      {
        $lookup: {
          from: "employees",
          as: "emDoc",
          localField: "employeeId",
          foreignField: "_id",
        },
      },
      { $unwind: { path: "$emDoc" } },
      {
        $project: {
          _id: 1,
          emName: "$emDoc.name",
          type: 1,
          reason: 1,
          tranDate: 1

        }
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
    const total = Attendances.find(selector).count()
    console.log('em data', data)
    return { data, total }
  },
  checkExistAtten({ selector }) {
    return Attendances.findOne(selector)
  },
  fetchAttendance(selector) {
    return Attendances.find(selector).fetch()

  },
  getAttendanceId(id) {
    return Attendances.findOne({ _id: id })
  },
  insertAttendance(doc) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({

      type: { type: String, optional: true, },
      tranDate: { type: Date, optional: true, },
      reason: { type: String, optional: false, },
      branchId: { type: String, optional: true, },
      employeeId: { type: String, optional: true, },

    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      console.log('doc', doc)
      // Comsert1.insert(doc)
      return Attendances.insert(doc)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert Employee error', error)
    }
  },
  updateAttendance(doc) {
    new SimpleSchema({
      _id: String,
      type: { type: String, optional: true, },
      tranDate: { type: Date, optional: true, },
      reason: { type: String, optional: false, },
      branchId: { type: String, optional: true, },
      employeeId: { type: String, optional: true, },


    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      return Attendances.update({ _id: doc._id }, { $set: doc })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Update employee error', error)
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
      return Attendances.remove({ _id: id })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Remove Employee error', error)
    }
  },
})
