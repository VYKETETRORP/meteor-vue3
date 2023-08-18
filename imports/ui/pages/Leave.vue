<template>
  <q-table v-model:pagination="pagination" bordered flat :rows="data" :columns="columns" :filter="filter"
    :loading="loading" row-key="_id" @request="onChangePagination">
    <template #top>
      <div class="q-gutter-x-md">
        <q-btn color="primary" no-caps icon="add" @click.prevent="addNew">
          Add
        </q-btn>
      </div>

      <q-space />

      <q-input v-model="filter" outlined dense debounce="300" placeholder="Search">
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template #body-cell-name="props">
      <q-td :props="props">
        <span  @click="edit(props.row)" v-if="props.row.status=='active'"  class="ra-text-link">
          {{ props.row.emName }}
        </span>
      </q-td>
    </template>
    <template #body-cell-reason="props">
      <q-td :props="props">
        <span>
          {{ props.row.reason }}
        </span>
      </q-td>
    </template>
    <template #body-cell-type="props">
      <q-td :props="props">
        <span>
          {{ props.row.type }}
        </span>
      </q-td>
    </template>
    <template #body-cell-tranDate="props">
      <q-td :props="props">
        <span>
          {{ formatTime(props.row.tranDate) }}
        </span>
      </q-td>
    </template>
    <template #body-cell-fromDate="props">
      <q-td :props="props">
        <span>
          {{ formatTime(props.row.fromDate) }}
        </span>
      </q-td>
    </template>
    <template #body-cell-toDate="props">
      <q-td :props="props">
        <span>
          {{ formatTime(props.row.toDate) }}
        </span>
      </q-td>
    </template>
    <template #body-cell-acceptedBy="props">
      <q-td :props="props">
        <span>
          {{ (props.row.uName) }}
        </span>
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
       
        <q-btn class="q-mr-sm" v-if="props.row.status=='active'"  icon="done" color="primary" @click="updateStatus(props.row._id,'accepted',acceptedById=currentUserId)">Accept</q-btn>
        <q-btn icon="close" color="red" @click="updateStatus(props.row._id,'cancel',acceptedById=currentUserId)" v-if="props.row.status=='active'">Cancel</q-btn>
        
        <q-btn :label="props.row.status" v-if="props.row.status!='active'" :icon="props.row.status" flat outline color="secondary" />

        <!-- <q-btn label="Cancel" v-if="props.row.status=='active'" icon="close" flat outline color="secondary" /> -->

      </q-td>


    </template>
  </q-table>

  <LeaveForm :dialog="visibleDialog" :show-id="showId" @closed="handleClosedDialog" />
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Notify from '/imports/ui/lib/notify'
import LeaveForm from './LeaveForm.vue'
import { useStore } from '/imports/store'
import moment from 'moment'
import { Meteor } from 'meteor/meteor'
import useMethod from '../composables/useMethod'
const isClicked = ref(false)
const store = useStore()

const formatTime = (date) => {
  return moment(date).format('lll')
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
      console.log('data table',result)
    })
    .catch((error) => {
      Notify.error({ message: error.reason || error })
      dataTable.value = []

    })
}

const updateStatus=(id,status,acceptedById)=>{
  console.log('id',id)
  console.log('status',status)
  console.log('accepted by id',acceptedById)

  Meteor.call('updateStatus',id,status,acceptedById,(err,res)=>{
    if(res){
      fetchData()
      
    }
    else{
      console.log('Err',err)
    }
  })


}
const currentUserId =computed(()=>store.getters['app/currentUserId'])
const currentBranchId = computed(() => store.getters['app/currentBranchId'])
const columns = [
  {
    name: 'name',
    label: 'Employee Name',
    align: 'left',
    field: 'name',
  },
  { name: 'reason', label: 'Reason', field: 'reason' },
  { name: 'type', label: 'Type', field: 'type' },
  { name: 'tranDate', label: 'Tran Date', field: 'tranDate' },
  { name: 'fromDate', label: 'From Date', field: 'fromDate' },
  { name: 'toDate', label: 'To Date', field: 'toDate' },
  { name: 'acceptedBy', label: 'accepted by user', field: 'acceptedBy' },
  { name: 'status', label: 'Status', field: 'status' },
]
const visibleDialog = ref(false)
const loading = ref(false)
// pagination
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})
const filter = ref('')
const data = ref([])
const showId = ref('')

const addNew = () => {
  visibleDialog.value = true
}

const leave=ref([])
const fetchLeave= () => {
 
 Meteor.call('fetchLeave', (err, res) => {
   if (err) {
     console.log('fetch leave  error', err)
   } else {
     console.log('Success leave  ', res)
     leave.value = res
   }
 })
}
// method
const fetchData = () => {
  loading.value = true
  const { page, rowsPerPage } = pagination.value
  let exp = new RegExp(filter.value)
  const query = {
    branchId: currentBranchId.value,
  }
  if (filter.value) {
    query['$or'] = [
      { name: { $regex: exp, $options: 'i' } },
      { telephone: { $regex: exp, $options: 'i' } },
      { address: { $regex: exp, $options: 'i' } },
    ]
  }
  const match = {
    page,
    rowsPerPage,
    selector: query,
  }
  Meteor.call('findLeave', { ...match }, (err, res) => {
    if (err) {
      console.log('error', err)
      Notify.error({ message: err.reason || err })
    } else {
      // this.list = res
      data.value = res.data || []
      pagination.value.rowsNumber = res.total || 0
    }

    loading.value = false
  })
}
const onChangePagination = (val) => {
  pagination.value = val.pagination
  fetchData()
  fetchLeave()
}

const edit = (row) => {
 
  visibleDialog.value = true
  showId.value = row._id

}

const handleClosedDialog = (value) => {
  visibleDialog.value = value
  showId.value = ''
  fetchData()
}

// life cycle
onMounted(() => {
  fetchData()
  getDataTable()
  fetchLeave()
})
watch(
  () => currentBranchId.value,
  () => {
    fetchData()
    fetchLeave()
    
  }
)
// watch(()=>currentUserId.value,()=>{
//   getDataTable()

// })



</script>