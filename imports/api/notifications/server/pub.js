// import Notifications from "../notifications";
import { Notification } from "../notification"

    Meteor.publish('notifi',(selector)=>{
        selector=selector || {}
        return Notification.find(selector)
    })