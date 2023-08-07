import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Employees = new Mongo.Collection("employees");
const Schemas = {};

Schemas.Employee = new SimpleSchema({
  name: {
    type: String,
    optional: false,
  },
  typeId: {
    type: String,
    optional: false,
  },
  positionId: {
    type: String,
    optional: false,
  },
  address: {
    type: String,
    optional: true,
  },
  telephone: {
    type: String,
    optional: false,
  },
  startDate: {
    type: Date,
    optional: false,
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
    optional: false,
  },
  token: {
    type: String,
    optional: true,
  },
});
Employees.attachSchema(Schemas.Employee);
