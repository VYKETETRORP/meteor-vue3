<template>
  <q-dialog
    v-model="visibleDialog"
    no-esc-dismiss
    no-backdrop-dismiss
    @hide="cancel()"
  >
    <q-card style="width: 70%; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Branch</div>
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
                    <validate-field
                      v-slot="{ value, field, errorMessage }"
                      v-model="form.startDate"
                      name="startDate"
                    >
                      <q-input
                        filled
                        v-model="form.startDate"
                        label="Start Date"
                        v-bind="field"
                        :error="!!errorMessage"
                        :error-message="errorMessage"
                        :model-value="value"
                        mask="date"
                        :rules="['date']"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date v-model="form.startDate">
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </validate-field>
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
                          v-model="form.branchId"
                          :options="emtype"
                          option-label="name"
                          option-value="_id"
                          emit-value
                          map-options
                          clearable
                          label="Employee Type *"
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
import { ref, watch, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { Form as ValidateForm, Field as ValidateField } from "vee-validate";
import { object, string, number, array, ref as yupRef } from "yup";

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

const emit = defineEmits(["closed"]);

const branchs = ref([]);
const positions = ref([]);
const emtype = ref([]);
onMounted(() => {
  fetchBranch();
  fetchPosition();
  fetchEmploye();
 
});



const fetchEmploye = () => {
  Meteor.call("fetchEmploye", (err, res) => {
    if (err) {
      console.log("fetch employee type error", err);
    } else {
      console.log("Success employee type ", res);
      emtype.value = res;
    }
  });
};
const fetchPosition = () => {
  Meteor.call("fetchPosition", (err, res) => {
    if (err) {
      console.log("fetch position error", err);
    } else {
      console.log("Success position ", res);
      positions.value = res;
    }
  });
};
const fetchBranch = () => {
  Meteor.call("fetchBranch", (err, res) => {
    if (err) {
      console.log("fetch branch error", err);
    } else {
      console.log("Success fetch branch", res);
      branchs.value = res;
    }
  });
};
const initForm = {
  name: "",
  typeId: "",
  positionId: "",
  address: "",
  telephone: "",
  startDate: "",
  checkIn: "",
  checkOut: "",
  branchId: "",
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
  telephone: string().required(),
  startDate: string().required(),
  employeeType: string().required(),

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
    if (form.value._id) {
      update();
    } else {
      insert();
    }
  }
};

const insert = () => {
  Meteor.call("insertEmployee1", form.value, (error) => {
    if (error) {
      console.error("Error inserting employee type:", error);
    } else {
      console.log("Employee type inserted successfully!");
      cancel();
    }
  });
};
const update = () => {
  Meteor.call("updateEmployeeType", form.value, (err, res) => {
    if (err) {
      Notify.error({ message: err.reason || err });
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
    message: `Do you want to remove [${form.value.name}] ?`,
    cancel: true,
    ok: {
      push: true,
    },
  }).onOk(() => {
    Meteor.call("removeEmployeeType", { id: props.showId }, (err, res) => {
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

watch(
  () => props.dialog,
  (value) => {
    visibleDialog.value = value;
  }
);

watch(()=>
  form.value.typeId,(value)=>{
    if(!value) return false
    const doc =emtype.value.find(it=>it._id==value)
    console.log(doc)
    form.value.branchId=doc.branchId

  }
  
)
watch(
  () => props.showId,
  (value) => {
    if (value) {
      Meteor.call("getEmployeeTypeById", value, (err, res) => {
        form.value = res;
      });
    }
  }
);
</script>
