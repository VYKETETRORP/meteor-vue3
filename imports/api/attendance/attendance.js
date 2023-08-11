import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Attendances = new Mongo.Collection("attendance");
const Schemas = {};

Schemas.Attendance = new SimpleSchema({
 typeId: {
    type: String,
    optional: false,
  },
  tranDate: {
    type: Date,
    optional: false,
  },
  reason: {
    type: String,
    optional: true,
  },
  employeeId: {
    type: String,
    optional: false,
  },
  branchId: {
    type: String,
    optional: false,
  },
 
});
Attendances.attachSchema(Schemas.Attendance);
