import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Departments = new Mongo.Collection("departments");
const Schemas = {};

Schemas.Department = new SimpleSchema({
 department: {
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
 
});
Departments.attachSchema(Schemas.Department);
