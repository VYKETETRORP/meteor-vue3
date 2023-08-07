import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const EmployeeTypes = new Mongo.Collection("employeetype");
const Schemas = {};

Schemas.EmployeeType = new SimpleSchema({
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
  positionId: {
    type: String,
    optional: false,
  },
});
//jab branch id pi position
EmployeeTypes.attachSchema(Schemas.EmployeeType);
