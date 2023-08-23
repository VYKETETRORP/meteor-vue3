import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
// import { Employees } from './employee'
// import Leave from './leave'
import { Leave } from './leave'
import { Notification } from '../notifications/notification'
export const insertLeave = new ValidatedMethod({
  name: 'insertLeave',
  mixins: [],
  validate:
    // Customer.schema.validator(),
    new SimpleSchema({

      tranDate: {
        type: Date,
        optional: false
      },
      employeeId: {
        type: String,
        optional: false
      },
      status: {
        type: String,
        optional: false,
      },
      reason: {
        type: String,
        optional: false,

      },
      acceptedById: {
        type: String,
        optional: true
      },
      type: {
        type: String,
        optional: true
      },
      fromDate: {
        type: Date,
        optional: true,
      },
      toDate: {
        type: Date,
        optional: true,
      },
      branchId: {
        type: String,
        optional: true
      }
    }).validator(),
  run(doc) {
    if (!Meteor.isServer) return false

    try {
      // return Customer.insert(doc)
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert leave error', error)
    }
  },
})

Meteor.methods({
  findLeave({ selector, page, rowsPerPage }) {
    if (!Meteor.isServer) return false
    selector = selector || {}
    const limit = rowsPerPage === 0 ? Number.MAX_SAFE_INTEGER : rowsPerPage
    const skip = rowsPerPage * (page - 1)
    console.log('em', selector)

    const data = Leave.aggregate([
      {
        $match: selector,
      },
      {
        $lookup: {
          from: "users",
          as: "uDoc",
          localField: "acceptedById",
          foreignField: "_id",
        },
      },
      { $unwind: { path: "$uDoc" , preserveNullAndEmptyArrays: true } },
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
          type: 1,
          status: 1,
          reason: 1,
          tranDate: 1,
          fromDate: 1,
          toDate: 1,
          acceptedById: 1,
          uName: "$uDoc.username",
          emName: "$emDoc.name",
          employeeId:1,
          // branName:"$emDoc.name"
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
    const total = Leave.find(selector).count()
    console.log('em data', data)
    return { data, total }
  },
  checkExistLeave({ selector }) {
    return Leave.findOne(selector)
  },
  fetchLeave() {
    return Leave.find({}).fetch()
 

  },
  updateStatus(id, status, acceptedById) {
    // acceptedById=this.userId
    return Leave.update({ _id: id }, { $set: { status, acceptedById: acceptedById } })

  },
  getLeaveId(id) {
    return Leave.findOne({ _id: id })
  },

// insertNotifica(doc){
//   const IN=  Notification.insert(doc)
//   return IN
//   },
 
  insertLeave1(doc) {
    // validate method
    new SimpleSchema({
      tranDate: {
        type: Date,
        optional: false
      },
      employeeId: {
        type: String,
        optional: false
      },
      status: {
        type: String,
        optional: false,
      },
      reason: {
        type: String,
        optional: false,

      },
      acceptedById: {
        type: String,
        optional: true
      },
      type: {
        type: String,
        optional: true
      },
      fromDate: {
        type: Date,
        optional: true,
      },
      toDate: {
        type: Date,
        optional: true,
      },
      branchId: {
        type: String,
        optional: true
      },
     
    }).validate(doc)
  

  

   const n= Notification.insert({ title: 'Alert',message:'Someone ask permission for leave',icon:'check',type:"type",createBy:"createBy",refId:"ref",employeeId:id,status:"active",branchId:"branchId",createAt:new Date() });
    if (!Meteor.isServer) return false

    try {
      console.log('doc', doc)
      // const n=Notification.insert(doc)
      const l =Leave.insert(doc)
      return n,l
     

     
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Insert Employee error', error)
    }
  },
  updateLeave(doc) {
    new SimpleSchema({
      _id: String,

      tranDate: {
        type: Date,
        optional: false
      },
      employeeId: {
        type: String,
        optional: false
      },
      status: {
        type: String,
        optional: false,
      },
      reason: {
        type: String,
        optional: false,

      },
      acceptedById: {
        type: String,
        optional: true
      },
      type: {
        type: String,
        optional: true
      },
      fromDate: {
        type: Date,
        optional: true,
      },
      toDate: {
        type: Date,
        optional: true,
      },
      branchId: {
        type: String,
        optional: true
      },

    }).validate(doc)

    if (!Meteor.isServer) return false

    try {
      return Leave.update({ _id: doc._id }, { $set: doc })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Update leave error', error)
    }
  },
  removeLeave({ id }) {
    // validate method
    // Customer.schema.validate(doc)
    new SimpleSchema({
      id: String,
    }).validate({ id })

    if (!Meteor.isServer) return false

    try {
      return Leave.remove({ _id: id })
    } catch (error) {
      console.log('error', error)
      throw new Meteor.Error('Remove leave error', error)
    }
  },


})
