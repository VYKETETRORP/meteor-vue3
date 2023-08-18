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
              <!-- select employee -->
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.employeeId"
                      name="Position"
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
                        label="Employee *"
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
                  <div>
            
            </div>
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

                </div>
              </div>

              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.type"
                      name="employeeType"
                    >
                      <q-select
                        class="text-uppercase"
                        outlined
                        :model-value="value"
                        dense
                        v-model="form.type"
                        :options="type"
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
            @click="insert"
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
          <q-btn
            outline
            color="primary"
            @click="update"
          >
            Update
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
const type = ref(['Check In', 'Check Out'])
const em = ref([])

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

// fetchEmploye

const employees = ref([])

const initForm = {
  type: '',
  tranDate: null,
  branchId: '',
  reason: 'ot saby jit',
  employeeId: '',
}

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
    // form.value.branchId = currentBranchId.value
    if (form.value._id) {
      update()
    } else {
      insert()
    }
  }
}

const insert = () => {
  const doc = { ...form.value }

  // doc.tranDate = moment(form.value.tranDate).toDate()
    doc.tranDate = new Date()



  Meteor.call('insertAttendance', doc, (error) => {
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

  doc.tranDate = moment(form.value.tranDate).toDate()
  Meteor.call('updateAttendance', doc, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason || err })
    } else {
      Notify.success({ message: 'Success' })

      doc.tranDate = moment(form.value.tranDate).toDate()
      cancel()
    }
  })
}
//remove
const remove = () => {
  $q.dialog({
    title: 'Confirm',
    message: `Do you want to remove [${form.value.employeeId}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call('removeAttendance', { id: props.showId }, (err, res) => {
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
    fetchEmploye()
    // fetchEmployeType()
  }
)
watch(
  () => props.showId,
  (value) => {
    if (value) {
      Meteor.call('getAttendanceId', value, (err, res) => {
        form.value = res
        form.value.tranDate = moment(res.tranDate, 'YYYY/MM/DD').format(
          'YYYY/MM/DD hh:mm'
        )
      })
    }
  }
)
watch(
  () => form.value.type,
  (value) => {
    if (!value) return false
    const doc = em.value.find((it) => (it._id = value))
    console.log(doc)
    form.value.branchId = currentBranchId.value
    // form.value.typeId = doc.name

    // form.value.startDate = moment(doc.startDate, 'HH:mm').format('hh:mm')
  }
)

onMounted(() => {
  fetchEmploye()
  // fetchEmployeType()
})
</script>
