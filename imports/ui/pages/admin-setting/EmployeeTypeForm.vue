<template>
    <q-dialog
      v-model="visibleDialog"
      no-esc-dismiss
      no-backdrop-dismiss
      @hide="cancel()"
    >
      <q-card style="width: 70%; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Employee Type</div>
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
                 
                  </div>
                  
                </div>
                <div class="col-xs-12 col-md-6 col-lg-6">
                  <div class="row q-col-gutter-y-sm">
                  
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
  // const currentBranchId=computed(()=>store.getters['/app/currentBranchId'])
  const currentBranchId= computed(()=>store.getters['app/currentBranchId'])

  const emit = defineEmits(["closed"]);
  
  const positions=ref([])
  const emtype=ref([])
  onMounted(() => {
   
    fetchPosition()
    fetchEmploye()
  });

  const fetchEmploye = ()=>{
    Meteor.call("fetchEmploye", (err, res) => {
      if (err) {
        console.log("fetch employee type error", err);
      } else {
        console.log("Success employee type ", res);
        emtype.value = res;
      }
    });
    
  }
  const  fetchPosition=()=>{
    Meteor.call("fetchPosition", (err, res) => {
      if (err) {
        console.log("fetch position error", err);
      } else {
        console.log("Success position ", res);
        positions.value = res;
      }
    });
  }
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
    status: "active",
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
    status: string().required(),
  
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
  
  const insert = () => {
    Meteor.call("insertEmployeeType", form.value, (error) => {
      if (error) {
        console.error("Error inserting employee type:", error);
      } else {
        console.log("Employee type inserted successfully!");
          Notify.success({ message: 'Success' })
     
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
  
  watch(
    () => props.showId,
    (value) => {
      if (value) {
        Meteor.call("getEmployeeTypeById", value, (err, res) => {
  
          form.value = res
        });
       
      }
    }
  );
  </script>
  