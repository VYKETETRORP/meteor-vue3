<template>
  <q-dialog
    v-model="visibleDialog"
    no-esc-dismiss
    no-backdrop-dismiss
    @hide="cancel()"
  >
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Position</div>
      </q-card-section>

      <q-card-section>
        <validate-form ref="refForm" :validation-schema="rules">
          <q-form @submit.prevent>
            <div class="row q-col-gutter-x-xl q-col-gutter-y-md">
              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.position"
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
                    <validate-field
                      v-slot="{ value, field }"
                      v-model="form.status"
                      name="status"
                    >
                      <span class="text-grey-9" style="padding-right: 8px">
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
              </div>

              <div class="col-xs-12 col-md-6 col-lg-6">
                <div class="row q-col-gutter-y-sm">
                  <div class="col-12">
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.departmentId"
                      name="department"
                    >
                      <q-select
                        class="text-uppercase"
                        outlined
                        :model-value="value"
                        dense
                        v-model="form.departmentId"
                        :options="department"
                        option-label="department"
                        option-value="_id"
                        emit-value
                        map-options
                        clearable
                        label="Department *"
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
      <q-card-actions align="right" class="bg-white text-teal">
        <div class="text-right q-gutter-sm">
          <q-btn color="primary" @click="submit"> Save </q-btn>
          <q-btn v-if="showId" color="red" @click="remove"> Remove </q-btn>
          <q-btn outline color="primary" @click="cancel"> Cancel </q-btn>
          <!-- <button @click="findSelect()">Select</button> -->
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: "ComA",
};
</script>

<script setup>
import Notify from "/imports/ui/lib/notify";
import { ref, watch, reactive, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { Form as ValidateForm, Field as ValidateField } from "vee-validate";
import { object, string, number, array, ref as yupRef } from "yup";
import {useStore} from '/imports/store'


const store = useStore()
const $q = useQuasar();
const props = defineProps({
  dialog: {
    type: Boolean,
    default: true,
  },
  showId: {
    type: String,
    default: null,
  },
});


const currentBranchId=computed(()=>store.getters['app/currentBranchId'])
const emit = defineEmits(["closed"]);

const department = ref([]);


const initForm = {
  position: "",
  status: "active",
  branchId: "",
  departmentId: "",
};

const statusOpts = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];
// data properties
const refForm = ref();
const form = ref({ ...initForm });
const visibleDialog = ref(false);

const rules = object({
  status: string().required(),
  department: string().required(),

  name: string()
    .min(2)
    .test("exist", "Name is required", (value) => {
      if (!value) return true;

      let selector = {
        // name: {
        //   // $regex: new RegExp('^' + value.replace(/%/g, '.*') + '$', 'i'),
        //   $regex: new RegExp(value, 'i'),
        // },
        name: value,
      };
      if (props.showId) {
        selector._id = { $ne: props.showId };
      }

      return checkExist(selector)
        .then((res) => {
          return !res;
        })
        .catch(() => false);
    }),
});

const checkExist = (selector) => {
  return new Promise((resolve, reject) => {
    Meteor.call("checkExist", { selector }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

//save
const submit = async () => {
  const { valid } = await refForm.value.validate();

  if (valid) {
    form.value.branchId=currentBranchId.value
    if (form.value._id) {
      update();
    } else {
      insert();
    }
  }
};

const  fetchdepartment=()=>{
  const selector={
    branchId:currentBranchId.value
  }
    Meteor.call("fetchdepartment",selector, (err, res) => {
      if (err) {
        console.log("fetch  fetchdepartment error", err);
      } else {
        console.log("Success  fetchdepartment ", res);
        department.value = res;
      }
    });
  }

const insert = () => {
  Meteor.call("insert1", form.value, (error) => {
    if (error) {
      console.error("Error inserting position:", error);
    } else {
      console.log("Position inserted successfully!");
      cancel()
    }
  });
};
const update = () => {
  Meteor.call("updatePosition", form.value, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason  || err });
    } else {
      Notify.success({ message: "Success" });
      cancel();
    }
  });
};
//remove
const remove = () => {
  $q.dialog({
    title: "Confirm",
    message: `Do you want to remove [${form.value.position}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call("removePosition", { id: props.showId }, (err, res) => {
      if (err) {
        Notify.error({ message: err.reason || err });
      } else {
        Notify.success({ message: "Success" });
        cancel();
      }
    });
    //
  });
};
const reset = () => {
  // refForm.value.resetValidation()
  // refForm.value.reset()
  // console.log(refForm.value)
  delete form.value._id;
  form.value = { ...initForm };
};

// cancel
const cancel = () => {
  reset();
  emit("closed", false);
};

// watch(()=>
//   form.value.departmentId,(value)=>{
//     if(!value) return false
//     const doc =department.value.find(it=>it._id==value)
//     console.log(doc)
//     form.value.branchId=doc.branchId

//   }
  
// )


// watch(form.value., (newId, oldId) => {
//   // Perform actions based on the new ID data
//   console.log('branch Id :',newId)
// })

watch(
  () => props.dialog,
  (value) => {
    visibleDialog.value = value;
  }
);
watch(()=>currentBranchId.value,()=>{
  fetchdepartment()
  })
watch(
  () => props.showId,
  (value) => {
    if (value) {
      Meteor.call("getPositionById", value, (err, res) => {
        form.value = res;
      });
    }
  }
);

onMounted(()=>{
  fetchdepartment()
})
</script>
