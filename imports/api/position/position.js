import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Positions = new Mongo.Collection("position");
const Schemas = {};

Schemas.Position = new SimpleSchema({
 position: {
    type: String,
    optional: false,
  },
  branchId: {
    type: String,
    optional: false,
  },
  departmentId: {
    type: String,
    optional: false,
  },
  status: {
    type: String,
    optional: false,
  },
 
});
Positions.attachSchema(Schemas.Position);
