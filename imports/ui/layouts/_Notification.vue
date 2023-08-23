<template>
  <q-btn
    flat
    round
    dense
    icon="notifications"
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
          v-for="(notiItem, index) in notifi"
          :key="index"
        >
          <q-item
            v-close-popup
            clickable
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
import { onMounted, ref } from 'vue'
import { Notification } from '/imports/api/notifications/notification'
onMounted(()=>{
  fetchNotification()
})
const notifiData=ref([])
const fetchNotification=()=>{
  Meteor.call('fetchNotification',(err,res)=>{
    if(res){
      console.log('fetch success')
      notifiData.value=res

    }

  })
}
// find({}, { sort: { createdAt: 1 } }).fetch();
const notifi = autorun(() => Notification.find({}, { sort: { createAt:-1 },limit:10 }).fetch()).result
Meteor.subscribe('noti')

const notifications = ref([
  {
    title: 'Alert',
    message:
      'Youre receiving this email because of your account on gitlab.com.',
    icon: 'security',
    timestamp: '3h',
    route: { name: 'alert' },
  },
])

const notiNumber = ref(notifi.value.length)
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
