<template>
  <q-dialog
    v-model="visibleDialog"
    no-esc-dismiss
    no-backdrop-dismiss
    @hide="cancel()"
  >
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Leave</div>
      </q-card-section>

      <q-card-section>
        <validate-form
          ref="refForm"
          :validation-schema="rules"
        >
          <q-form @submit.prevent>
            <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
              <div class="col-xs-12 col-md-6 col-lg-6">
                <!-- employee -->
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.employeeId"
                      name="employeeName"
                    >
                      <q-select
                        class="text-uppercase"
                        outlined
                        :model-value="value"
                        dense
                        v-model="form.employeeId"
                        :options="em"
                        option-label="name"
                        option-value="_id"
                        emit-value
                        map-options
                        clearable
                        label="Employee Name *"
                        v-bind="field"
                        :error="!!errorMessage"
                        :error-message="errorMessage"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              No results
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </validate-field>
                  </div>
                  <!-- from Date -->
                
                  <!-- from date -->
                  <div class="col-12">
                    <q-input readonly filled label="From Date" v-model="form.fromDate">
                      <template v-slot:prepend>
                        <q-icon :name="form.type=='Full' ? 'event' : 'access_time'" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale" >
                            <q-date v-if="form.type=='Full'" v-model="form.fromDate" color="orange" text-color="white"
                              bordered>
                            </q-date>

                              <q-time v-else v-model="form.fromDate" :mask="mask" >
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

                  </div>
                </div>
              </div>
           

              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <!-- reason -->
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.reason"
                      name="reason"
                    >
                      <q-input
                        :model-value="value"
                        outlined
                        dense
                        label="Reason *"
                        v-bind="field"
                        :error="!!errorMessage"
                        :error-message="errorMessage"
                      ></q-input>
                    </validate-field>
                  </div>
                  <!-- to date -->

                  <div class="col-12">
                    <q-input readonly filled label="To Date" v-model="form.toDate">
                      <template v-slot:prepend>
                        <q-icon :name="form.type=='Full' ? 'event' : 'access_time'" class="cursor-pointer" >
                          <q-popup-proxy transition-show="scale" transition-hide="scale" >
                            <q-date v-if="form.type=='Full'" v-model="form.toDate" :options="minDate" color="orange" text-color="white"
                              bordered>
                            </q-date>

                              <q-time v-else v-model="form.toDate" :mask="mask" >
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.type"
                      name="type"
                    >
                      <q-select
                        class="text-uppercase"
                        outlined
                        :model-value="value"
                        dense
                        v-model="form.type"
                        :options="options"
                        option-label="name"
                        option-value="_id"
                        emit-value
                        map-options
                        clearable
                        label="Type *"
                        v-bind="field"
                        :error="!!errorMessage"
                        :error-message="errorMessage"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              No results
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </validate-field>
                  </div>
                </div>
              </div>

              <!-- select position
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field }"
                      v-model="form.status"
                      name="status"
                    >
                      <span
                        class="text-grey-9"
                        style="padding-right: 8px"
                      >
                        Status
                      </span>

                      <q-option-group
                        :model-value="value"
                        :options="statusOpts"
                        color="primary"
                        v-bind="field"
                        inline
                        style="display: inline-block"
                      />
                    </validate-field>
                  </div>
                </div>
              </div> -->
            </div>
         
          </q-form>
        </validate-form>
      </q-card-section>

      <q-card-actions
        align="right"
        class="bg-white text-teal"
      >
        <div class="text-right q-gutter-sm">
          <q-btn
            color="primary"
            @click="submit"
          >
            Save
          </q-btn>
          <q-btn
            v-if="showId"
            color="red"
            @click="remove"
          >
            Remove
          </q-btn>
          <q-btn
            outline
            color="primary"
            @click="cancel"
          >
            Cancel
          </q-btn>
          <button @click="createNotification()">noti</button>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
  <script>
export default {
  name: 'ComA',
}
</script>

<script setup>
import Notify from '/imports/ui/lib/notify'
import { ref, watch, reactive, onMounted, computed } from 'vue'
import {  useQuasar } from 'quasar'
import { Form as ValidateForm, Field as ValidateField } from 'vee-validate'
import { object, string, number, array, ref as yupRef } from 'yup'
import { useStore } from '/imports/store'
import moment from 'moment'
const store = useStore()
const $q = useQuasar()
const props = defineProps({
  dialog: {
    type: Boolean,
    default: true,
  },
  showId: {
    type: String,
    default: null,
  },
})
const currentUserId = computed(() => store.getters['app/urrentUserId'])
const currentBranchId = computed(() => store.getters['app/currentBranchId'])

// const currentBranchId=computed(()=>store.getters['app/currentBranchId'])
const emit = defineEmits(['closed'])
const displayDateIcon = ref(true)
const mask = ref('YYYY/MM/DD')
const Notification = ref([])
const display = ref(true)
const displayTime = ref(true)
const branchs = ref([])
const positions = ref([])
const emtype = ref([])
const em = ref([])
const firstShowForm = ref(false)

const options = ref(['Full', 'Morning', 'Afternoon', 'Time'])


const fetchBranch = () => {
  const selector = {
    _id: currentBranchId.value,
  }

  Meteor.call('fetchBranches', selector, (err, res) => {
    if (err) {
      console.log('fetch branches  error', err)
    } else {
      console.log('Success branches  ', res)
      branchs.value = res
    }
  })
}
const fetchEmploye = () => {
  const selector = {
    branchId: currentBranchId.value,
  }
  Meteor.call('fetchEmploye', selector, (err, res) => {
    if (err) {
      console.log('fetch employee  error', err)
    } else {
      console.log('Success employee  ', res)
      em.value = res
    }
  })
}

const NotificationData = ref({
  title: 'title',
  message: 'ask for accept leave',
  icon: 'aaa',
  type: 'Moring',
  createBy: 'createByadmin',
  refId: '1',
  status: 'active',
  branchId: '1',
  employeeId: 'em1',
})



const leave = ref([])
const fetchLeave = () => {
  Meteor.call('fetchLeave', (err, res) => {
    if (err) {
      console.log('fetch leave  error', err)
    } else {
      console.log('Success leave  ', res)
      leave.value = res
    }
  })
}
const initForm = {
  tranDate: new Date(),
  employeeId: '',
  status: 'active',
  reason: '',
  acceptedById: 'u1',
  type: 'Morning',
  fromDate: moment().format('YYYY/MM/DD'),
  toDate: moment().add(1,'d').format('YYYY/MM/DD'),
  branchId: '1',
}

const statusOpts = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Accepted', value: 'accepted' },
]
// data properties
const refForm = ref()
const form = ref({ ...initForm })
const visibleDialog = ref(false)

const rules = object({
  reason: string().required(),
  type: string().required(),
  employeeName: string().required(),
  reason: string()
    .min(2)
    .test('exist', 'Name is required', (value) => {
      if (!value) return true

      let selector = {
        // name: {
        //   // $regex: new RegExp('^' + value.replace(/%/g, '.*') + '$', 'i'),
        //   $regex: new RegExp(value, 'i'),
        // },
        name: value,
      }
      if (props.showId) {
        selector._id = { $ne: props.showId }
      }

      return checkExist(selector)
        .then((res) => {
          return !res
        })
        .catch(() => false)
    }),
})

const checkExist = (selector) => {
  return new Promise((resolve, reject) => {
    Meteor.call('checkExist', { selector }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

const submit = async () => {
  const { valid } = await refForm.value.validate()
  if (valid) {
    form.value.branchId = currentBranchId.value
    if (form.value._id) {
      update()
    } else {
      insert()
      // createNotification()
    }
  }
}
const convertDateTime = (strTime) => {
const curr = moment()
const splitStrTime = strTime.split(':')

 curr.hours(splitStrTime[0])
 curr.minutes(splitStrTime[1])

 return curr.toDate()
}
const dataTable = ref([])
const getDataTable = () => {
  const { call } = useMethod('app.findUsers')
  call({
    selector: { username: { $ne: 'super' } },
    options: { sort: { 'profile.fullName': 1 } },
  })
    .then((result) => {
      dataTable.value = result
      console.log('data table', result)
    })
    .catch((error) => {
      Notify.error({ message: error.reason || error })
      dataTable.value = []
    })
}
const minDate = (date) => {
  const validate=ref();
  const today = moment(form.value.fromDate,).format("YYYY/MM/DD");
  
  if(form.value.type === 'Full'){
    validate.value= date > today
  }else{
    validate.value =date<= today
  }
  return validate.value
}
const insert = () => {
  const doc = { ...form.value }
  doc.tranDate = moment(form.value.tranDate).toDate()
  doc.fromDate = moment(form.value.fromDate).toDate()
  doc.toDate = moment(form.value.toDate).toDate()

  if(form.value.type==='Time'){
    doc.fromDate = convertDateTime(form.value.fromDate)
  doc.toDate = convertDateTime(form.value.toDate)
  }
  Meteor.call('insertLeave1', doc, (error) => {
    if (error) {
      console.error('Error inserting leave', error)
    } else {
      console.log('Leave inserted successfully!')
      cancel()
    }
  })
}

const update = () => {
  const doc = { ...form.value }
  doc.tranDate = moment(form.value.tranDate).toDate()
  doc.fromDate = moment(form.value.fromDate).toDate()
  doc.toDate = moment(form.value.toDate).toDate()
  if(form.value.type==='Time'){
    doc.fromDate = convertDateTime(form.value.fromDate)
  doc.toDate = convertDateTime(form.value.toDate)
  }
 
  Meteor.call('updateLeave', doc, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason || err })
    } else {
      Notify.success({ message: 'Success' })
      cancel()
    }
  })
}
//remove
const remove = () => {
  $q.dialog({
    title: 'Confirm',
    message: `Do you want to remove?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call('removeLeave', { id: props.showId }, (err, res) => {
      if (err) {
        Notify.error({ message: err.reason || err })
      } else {
        Notify.success({ message: 'Success' })
        cancel()
      }
    })
    //
  })
}
const reset = () => {
  delete form.value._id
  form.value = { ...initForm }
}

// cancel
const cancel = () => {
  reset()
  emit('closed', false)
}

watch(
  () => props.dialog,
  (value) => {
    visibleDialog.value = value
  }
)
watch(() => {})

watch(
  () => currentBranchId.value,
  () => {
    fetchEmploye()
  }
)

// edit
watch(
  () => props.showId,
  (value) => {
    if (value) {
      // firstShowForm.value = true
      Meteor.call('getLeaveId', value, (err, res) => {
        form.value ={ ...res}
        form.value.tranDate = moment(res.tranDate, 'YYYY-MM-DD hh:mm').format(
          'YYYY-MM-DD hh:mm'
        )
        form.value.fromDate = moment(res.fromDate, 'YYYY-MM-DD hh:mm').format(
          'YYYY-MM-DD hh:mm'
        )
        form.value.toDate = moment(res.toDate, 'YYYY-MM-DD hh:mm').format(
          'YYYY-MM-DD hh:mm'
        )

        if(res.type=='Time') {
          form.value.toDate = moment(res.toDate,).format("HH:mm");
          form.value.fromDate = moment(res.fromDate,).format("HH:mm");
         
        } 

        console.log('form',form.value,res)

        nextTick(()=>{
          firstShowForm.value = false
        })




      })
    }
  }
)


//watch when select type
watch(() => form.value.type, (val) => {
  mask.value = 'YYYY/MM/DD'
  if(val=='Time') mask.value = 'HH:mm'

  if(firstShowForm.value) return false;
  
  form.value.toDate = moment().format("YYYY/MM/DD");
  form.value.fromDate = moment().format("YYYY/MM/DD");

  if(val== 'Full'){
    
    form.value.fromDate = moment(new Date()).add(1,'d').format("YYYY/MM/DD");
    form.value.fromDate = moment().format("YYYY/MM/DD");
  }else if

  (val=='Time'){
    form.value.fromDate = moment(new Date(),).format("HH:mm");
    form.value.toDate = moment(new Date(),).format("HH:mm");
    
  }
  else{
    mask.value="YYYY/MM/DD HH:mm"
    form.value.fromDate = moment(new Date(),).format("YYYY/MM/DD HH:mm");
    form.value.toDate = moment(new Date(),).format("YYYY/MM/DD HH:mm");
  }

}
)
watch(
  () => visibleDialog.value,
  () => {
    form.value.fromDate = moment(
      form.value.fromDate,
      'YYYY-MM-DD hh:mm'
    ).format('YYYY-MM-DD hh:mm')
    form.value.toDate = moment(form.value.toDate, 'YYYY-MM-DD hh:mm').format(
      'YYYY-MM-DD hh:mm'
    )
  }
)
watch(
  () => form.value.employeeId,
  (value) => {
    if (!value) return false
    const doc = branchs.value.find((it) => (it._id = value))
    console.log(doc)
    form.value.branchId = currentBranchId.value

    // form.value.startDate = moment(doc.startDate, 'HH:mm').format('hh:mm')
  }
)

watch(
  () => visibleDialog.value,
  (value) => {
    if (!value) return false
    const doc = dataTable.value.find((it) => (it._id = value))
    console.log(doc)
    form.value.acceptedById = currentUserId.value
    fetchLeave()

    // console.log('curerentUserId',currentUserId.value)
  }
)
onMounted(() => {
  fetchEmploye()
  fetchBranch()
  fetchLeave()
})
</script>
