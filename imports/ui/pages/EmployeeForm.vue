<template>
  <q-dialog
    v-model="visibleDialog"
    no-esc-dismiss
    no-backdrop-dismiss
    @hide="cancel()"
  >
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Employee</div>
      </q-card-section>

      <q-card-section>
        <validate-form
          ref="refForm"
          :validation-schema="rules"
        >
          <q-form @submit.prevent>
            <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.name"
                      name="name"
                    >
                      <q-input
                        :model-value="value"
                        outlined
                        dense
                        label="Name *"
                        v-bind="field"
                        :error="!!errorMessage"
                        :error-message="errorMessage"
                      ></q-input>
                    </validate-field>
                  </div>
                  <div class="col-12">
                    <div class="col-xs-6 col-md-6 col-lg-6">
                      <q-input
                        readonly
                        filled
                        label="Start Date"
                        v-model="form.startDate"
                        mask="date"
                      >
                        <template v-slot:append>
                          <q-icon
                            name="event"
                            class="cursor-pointer"
                          >
                            <q-popup-proxy
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date v-model="form.startDate"></q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.address"
                      name="address"
                    >
                      <q-input
                        :model-value="value"
                        outlined
                        dense
                        label="Addres"
                        v-bind="field"
                        :error="!!errorMessage"
                        :error-message="errorMessage"
                      ></q-input>
                    </validate-field>
                  </div>
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.telephone"
                      name="telephone"
                    >
                      <q-input
                        :model-value="value"
                        outlined
                        dense
                        label="Telephone *"
                        v-bind="field"
                        :error="!!errorMessage"
                        :error-message="errorMessage"
                      />
                    </validate-field>
                  </div>
                </div>
              </div>

              <!-- checkin checkout -->
              <div class="row w-full q-col-gutter-x-sm">
                <!-- Check In -->
                <div class="col-xs-6 col-md-6 col-lg-6">
                  <q-input
                    filled
                    class="w-full"
                    readonly
                    v-model="form.checkIn"
                    label="Check In"
                  >
                    <!-- :rules="['time']" -->
                    <!-- mask="time" -->
                    <template v-slot:append>
                      <q-icon
                        name="access_time"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="form.checkIn"
                            mask="HH:mm"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-6 col-md-6 col-lg-6">
                  <q-input
                    filled
                    class="w-full"
                    v-model="form.checkOut"
                    readonly
                    label="Check Out"
                  >
                    <!-- :rules="['time']" -->
                    <!-- mask="time" -->
                    <template v-slot:append>
                      <q-icon
                        name="access_time"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-time
                            v-model="form.checkOut"
                            mask="HH:mm"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <!-- <q-input type="date" v-model="form.startDate" label="date">

</q-input> -->
              <!-- select emtype -->
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.typeId"
                      name="employeeType"
                    >
                      <q-select
                        class="text-uppercase"
                        outlined
                        :model-value="value"
                        dense
                        v-model="form.typeId"
                        :options="emtype"
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

              <!-- select position -->
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.positionId"
                      name="Position"
                    >
                      <q-select
                        class="text-uppercase"
                        outlined
                        :model-value="value"
                        dense
                        v-model="form.positionId"
                        :options="positions"
                        option-label="position"
                        option-value="_id"
                        emit-value
                        map-options
                        clearable
                        label="Position *"
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
import { date, useQuasar } from 'quasar'
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
const currentBranchId = computed(() => store.getters['app/currentBranchId'])

// const currentBranchId=computed(()=>store.getters['app/currentBranchId'])
const emit = defineEmits(['closed'])

const branchs = ref([])
const positions = ref([])
const emtype = ref([])
const em = ref([])
onMounted(() => {
  fetchPosition()
  fetchEmployeType()
  fetchEmploye()
  fetchBranch()
})

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

const fetchEmployeType = () => {
  const selector = {
    branchId: currentBranchId.value,
  }

  Meteor.call('fetchEmployeType', selector, (err, res) => {
    if (err) {
      console.log('fetch employee type error', err)
    } else {
      console.log('Success employee type ', res)
      emtype.value = res
    }
  })
}
const fetchPosition = () => {
  const selector = {
    branchId: currentBranchId.value,
  }

  Meteor.call('fetchPosition', selector, (err, res) => {
    if (err) {
      console.log('fetch position error', err)
    } else {
      console.log('Success position ', res)
      positions.value = res
    }
  })
}

const initForm = {
  name: '',
  typeId: '',
  positionId: '',
  address: '',
  telephone: '',
  startDate: null,
  checkIn: '7:00',
  checkOut: '8:00',
  branchId: '',
}

const statusOpts = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]
// data properties
const refForm = ref()
const form = ref({ ...initForm })
const visibleDialog = ref(false)

const rules = object({
  telephone: string().required(),
  // startDate: Date().required(),
  employeeType: string().required(), // checkIn: string().required(),
  // checkOut: string().required(),
  Position: string().required(),

  name: string()
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
const convertTime = (strTime) => {
  const selectedDateTime = moment()
  const strSplite = strTime.split(':') // 08:36 => ['08',' 36']
  selectedDateTime.hour(strSplite[0])
  selectedDateTime.minutes(strSplite[1])

  return selectedDateTime.toDate()
}

const submit = async () => {
  const { valid } = await refForm.value.validate()
  if (valid) {
    form.value.branchId = currentBranchId.value
    if (form.value._id) {
      update()
    } else {
      insert()
    }
  }
}

const insert = () => {
  const doc = { ...form.value }

  doc.checkIn = convertTime(form.value.checkIn)
  doc.checkOut = convertTime(form.value.checkOut)
  doc.startDate = moment(form.value.startDate).toDate()

  Meteor.call('insertEmployee1', doc, (error) => {
    if (error) {
      console.error('Error inserting employee type:', error)
    } else {
      console.log('Employee inserted successfully!')
      cancel()
    }
  })
}

const update = () => {
  const doc = { ...form.value }

doc.checkIn = convertTime(form.value.checkIn)
doc.checkOut = convertTime(form.value.checkOut)
doc.startDate = moment(form.value.startDate).toDate()
  Meteor.call('updateEmployee', doc, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason || err })
    } else {
      Notify.success({ message: 'Success' })
      doc.checkIn = convertTime(form.value.checkIn)
      doc.checkOut = convertTime(form.value.checkOut)
      doc.startDate = moment(form.value.startDate).toDate()
      cancel()
    }
  })
}
//remove
const remove = () => {
  $q.dialog({
    title: 'Confirm',
    message: `Do you want to remove [${form.value.name}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call('removeEmployee', { id: props.showId }, (err, res) => {
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
  // refForm.value.resetValidation()
  // refForm.value.reset()
  // console.log(refForm.value)
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

watch(
  () => currentBranchId.value,
  () => {
    fetchEmployeType()
    fetchBranch()
    fetchPosition()
  }
)

watch(
  () => props.showId,
  (value) => {
    if (value) {
      Meteor.call('getEmployeeId', value, (err, res) => {
        form.value = res

        form.value.checkIn = moment(res.checkIn, 'HH:mm').format('hh:mm')
        form.value.checkOut = moment(res.checkOut, 'HH:mm').format('hh:mm')
        // form.value.startDate = res.startDate.toDate()

        // form.value.startDate = moment(res.startDate,'YYYY-MM-DD').format('MM/DD/YYYY hh:mm')
        // startDate.toDate()
        form.value.startDate = moment(res.startDate, 'YYYY/MM/DD').format('YYYY/MM/DD hh:mm')
      })
    }
  }
)
watch(
  () => visibleDialog.value,
  (value) => {
    if (!value) return false
    const doc = branchs.value.find((it) => (it._id = value))
    console.log(doc)
    form.value.branchId = currentBranchId.value
    form.value.checkIn = moment(doc.checkIn, 'HH:mm').format('hh:mm')
    form.value.checkOut = moment(doc.checkOut, 'HH:mm').format('hh:mm')
    // form.value.startDate = moment(doc.startDate, 'HH:mm').format('hh:mm')
  }
)
</script>
