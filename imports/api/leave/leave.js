import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Leave = new Mongo.Collection("leave");
const Schemas = {};

Schemas.Leave = new SimpleSchema({
    tranDate:{
        type:Date,
        optional:false
    },
    employeeId:{
        type:String,
        optional:false
    },
    status:{
        type:String,
        optional:false,
    },
    reason:{
        type:String,
        optional:false,

    },
    acceptedById:{
        type:String,
        optional:true
    },
    type:{
        type:String,
        optional:true
    },
    fromDate:{
        type:Date,
        optional:true,
    },
    toDate:{
        type:Date,
        optional:true,
    },
    branchId:{
        type:String,
        optional:true
    }
 
});
Leave.attachSchema(Schemas.Leave);
