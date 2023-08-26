import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";
import {Notification} from "./notification"
import { subscribe ,autorun } from "vue-meteor-tracker";
import { Meteor } from "meteor/meteor";

Meteor.methods({
  fetchEmployeeName(  {selector} ){
    selector = selector || {}
        const data = Notification.aggregate([
          {
            $match: selector,
          },
            {
                $lookup: {
                  from: "employees",
                  as: "emDoc",
                  localField: "employeeId",
                  foreignField: "_id",
                },
              },
              { $unwind: { path: "$emDoc" } },
              {
                $project: {
                  _id:1,
                  emName: "$emDoc.name",
                  message:1,
                  title:1,
                  icon:1,
                  createAt:1,
                  createBy:1,
                  status:1,
                //   employeeId:1,
                  // _id:'$employeeId'
                
                },
              },  
            //   { $match: { _id: emName } }, 
            { $sort: { createAt: -1 } }, // Sort by descending order of _id
            { $limit: 10 },
          ]);
          const total = Notification.find({selector}).count();
          console.log('data',data)
          return  {data,total} ;
        
    
  },
    getNotificationId(id) {
      return Notification.findOne({ _id: id });
    },
    createNotification(notification){
        return  Notification.insert(notification)
    },
    fetchNotification(){
        return Notification.find({status:'active'}).fetch()
    },
    updateNotificationStatus(oldStatus,newStatus){
        return Notification.update({ status: oldStatus }, { $set: { status: newStatus } }, { multi: true });
        // return Notification.update({$set:{status}})
        // return Notification.update({ $set: { status:'readed' } });
    }
})
if(Meteor.isServer){
    Meteor.publish('noti',()=>{
       return Notification.find({}); 
    })
}

// if(Meteor.isServer){
//     Meteor.publish('activeData',()=>{
//         return Notification.find({status:'active'})
//     })
// }