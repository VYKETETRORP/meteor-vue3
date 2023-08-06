import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Branches = new Mongo.Collection('app_branches')

Branches.schema = new SimpleSchema({
  name: {
    type: String,
    max: 200,
  },
  address: {
    type: String,
  },
  checkIn: {
    type: Date,
    optional: true,
  },
  checkOut: {
    type: Date,
    optional: true,
  },
})

Branches.attachSchema(Branches.schema)

export default Branches
