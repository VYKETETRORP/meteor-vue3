// import Notifications from "../notifications";
// import  Notification from "../notifications"

// import { Notification } from "../notifications"
// import { Notification } from "../notifications"//
import { Notification } from "../notification"

    Meteor.publish('noti',(selector)=>{
        selector=selector || {}
        return Notification.find(selector)
    })