<template>
  <q-btn
    flat
    round
    dense
    icon="notifications"
    @click="isClick"

  >
    <q-badge
      color="red"
      floating
      transparent
    >
      {{ notiNumber }}
    </q-badge>
    <q-menu
      :offset="[0, 13]"
      square
      transition-show="scale"
      transition-hide="scale"
    >
      <!-- Header -->
      <q-list style="max-width: 350px">
        <q-item>
          <q-item-section class="text-body1"> Notifications </q-item-section>
        </q-item>

        <q-separator />

        <template
          v-for="(notiItem, index) in emData"
          :key="index"
        >
          <q-item
            v-close-popup
            clickable

            to="/leave"
          >
            <!-- Icon -->
            <q-item-section
              v-if="notiItem.icon"
              :key="`icon-${index}`"
              avatar
            >
              <q-avatar
                color="primary"
                text-color="white"
              >
                <q-icon :name="notiItem.icon" />
              </q-avatar>
            </q-item-section>
            <!-- Message -->
            <q-item-section :key="`message-${index}`">
              <q-item-label
                caption
                :lines="2"
                class="text-grey-9 message-text"

             >
              {{ notiItem.emName }}
     
                {{ notiItem.message }}
              </q-item-label>
            </q-item-section>

            <q-item-section
              :key="`timestamp-${index}`"
              side
              top

            >
              {{ notiItem.timestamp }}
            </q-item-section>
          </q-item>

          <!-- Separator -->
          <q-separator
            v-if="index + 1 < notiNumber"
            :key="`separator-${index}`"
          />
        </template>

        <q-separator />

        <!-- See all -->
        <q-item dense>
          <q-item-section class="text-center q-py-xs footer-section">
            <q-btn
              v-close-popup
              flat
              size="sm"
              class="view-all"
              label="View All"
              no-caps
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
// import { Tracker } from 'meteor/tracker'
import { subscribe, autorun } from 'vue-meteor-tracker'
import {
  ClosePopup,
  QSeparator,
  QAvatar,
  QIcon,
  QBtn,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBadge,
  QMenu,
} from 'quasar'
import { onMounted, ref,watch} from 'vue'
import { Notification } from '/imports/api/notifications/notification'

// const status=ref('')

const { ready: notiReady } = subscribe(() => [
  'noti',
  {
    // createdBy: Meteor.userId(),
    to:Meteor.userId(),
    status:'active'
  },
])

const {result:noti} = autorun(() => {
  if(notiReady.value) return Notification.find({}).fetch()

  return []
})


const  fetchEmName = () =>{
  const selector = {
    createdBy: Meteor.userId(),
    // to:Meteor.userId()
  }

  Meteor.call('fetchEmployeeName',selector,(err,res)=>{
    if(!err){
      console.log('fetch noti success',res)
      emData.value = res.data || []
    }else{
      console.log('fetch notutt error',err)
    }
  })
}

onMounted(() => {
  fetchEmName()
  // displayEmployeeName()
  updateStatusNoti()
  // updateNotificationStatus()
//  activeLength.value =notiNumber.value
})


const acceptLeave=(id)=>{
  Meteor.call('getNotificationId',id,(err,res)=>{

 console.log('accepte function run',id)
  })

 
}

const emData = ref([])
// const fetchEmName = () => {
//   Meteor.call('fetchEmployeeName', (err, res) => {
//     if (res) {
//       emData.value = res.data || []
//       // notifi.value=res
//       console.log('fetch success', res)
//     }
//   })
// }
const employeeName=ref([])
const displayEmployeeName=(id)=>{
  const select = emData.value.find((item)=>item.id===id)
  employeeName.value=select?select.emName:null
  console.log('emname',employeeName)
}

// find({}, { sort: { createdAt: 1 } }).fetch();
// const notifi = autorun(() =>
// Notification.find({}).fetch()
  // Notification.find({}, { sort: { createAt: -1 }, limit: 10 }).fetch()
// ).result

// const activeLengthData = autorun(()=>
// Notification.find({status:'active'}).fetch
// ).result


// const activeLengthData = autorun(() =>
//   Notification.find({ status: 'active' }).fetch()
// ).result
// Meteor.subscribe('noti')
// Meteor.subscribe('activeData')

const updateStatusNoti = () => {
  Meteor.call('updateNotificationStatus', 'active', 'readed', (err, res) => {
    if (res) {
      console.log('success', res)
    }
  })
}


const isClick=()=>{
  // activeLength.value=0
  updateStatusNoti()
  // displayEmployeeName()
  

}
const notifications = ref([
  {
    title: 'Alert',
    employeeId: 'Name',
    message:
      'Youre receiving this email because of your account on gitlab.com.',
    icon: 'security',
    timestamp: '3h',
    route: { name: 'alert' },
  },])
// const notiNumber = ref(notifi.value.length)
// const notiNumber=notifi.value
// const activeLength = ref(notifi.value.length)

// console.log('notiNum', notiNumber)
// let activeLength = ref(0)
// activeLength=notifi.length
// const activeLength=notifi.value

// watch(activeLengthData,(items)=>{
//   //  console.log('items',items)
  
//    activeLength.value = items.length
//   //  fetchEmName()
   
// })
const notiNumber = ref(0)
// const notiNum = ref(notifi.value.length)




watch(noti,(items)=>{
  //  console.log('items',items)
  
   notiNumber.value = items.length
   fetchEmName()
   updateStatusNoti()
   
})
// console.log('active length', activeLength)

</script>

<style lang="scss" scoped>
.message-text {
  font-size: 13px;
}
.footer-section {
  .view-all {
    width: 70px;
    margin: 0 auto;
    padding: 0;
    color: #1565c0;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
