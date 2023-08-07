import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Branchs = new Mongo.Collection("branchs");
const Schemas = {};

Schemas.Branch = new SimpleSchema({
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
});
Branchs.attachSchema(Schemas.Branch);
