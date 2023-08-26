import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Notification = new Mongo.Collection("notifications");
const Schemas = {};

Schemas.Notification = new SimpleSchema({
    title:String,
    message:String,
    icon:String,
    type:String,
    createBy:String,
    refId:String,
    status:String,
    branchId:String,
    employeeId:String,
    createAt:Date,
    toCreateBy:String,
 
});
Notification.attachSchema(Schemas.Notification);
