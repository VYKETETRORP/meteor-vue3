import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {Notification} from "./notification"
import { subscribe ,autorun } from "vue-meteor-tracker";
import { Meteor } from "meteor/meteor";

Meteor.methods({
    createNotification(notification){
        return  Notification.insert(notification)
    },
    fetchNotification(){
        return Notification.find({}).fetch()
    }


})


if(Meteor.isServer){
    Meteor.publish('noti',()=>{
        return Notification.find({})
    })
}