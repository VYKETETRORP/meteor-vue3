<template>
  <q-table
    v-model:pagination="pagination"
    bordered
    flat
    :rows="data"
    :columns="columns"
    :filter="filter"
    :loading="loading"
    row-key="_id"
    @request="onChangePagination"
  >
    <template #top>
      <div class="q-gutter-x-md">
        <q-btn color="primary" no-caps icon="add" @click.prevent="addNew">
          Add
        </q-btn>
      </div>

      <q-space />

      <q-input
        v-model="filter"
        outlined
        dense
        debounce="300"
        placeholder="Search"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template #body-cell-name="props">
      <q-td :props="props">
        <span @click="edit(props.row)" class="ra-text-link">
          {{ props.row.emName}}
        </span>
      </q-td>
    </template>
    <template #body-cell-type="props">
      <q-td :props="props">
        <span  >
          {{ props.row.type}}
        </span>
      </q-td>
    </template>
    <template #body-cell-date="props">
      <q-td :props="props">
        <span  >
          {{ formatTime(props.row.tranDate)}}
        </span>
      </q-td>
    </template>
    <template #body-cell-reason="props">
      <q-td :props="props">
        <span  >
          {{ props.row.reason}}
        </span>
      </q-td>
    </template>
 
  </q-table>

  <AttendancesForm
    :dialog="visibleDialog"
    :show-id="showId"
    @closed="handleClosedDialog"
  />
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Notify from '/imports/ui/lib/notify'
// import EmployeeTypeForm from './EmployeeTypeForm.vue';
import AttendancesForm from './AttendancesForm.vue'
import {useStore} from '/imports/store'
import moment  from 'moment'

const store = useStore()
const columns = [
  {
    name: 'name',
    label: 'Emoloyee Name',
    align: 'left',
    field: 'name',
  },
 
  { name: 'type', label: 'Employee Type', field: 'type' },
  { name: 'date', label: 'Tran Date', field: 'date' },
  { name: 'reason', label: 'Reason', field: 'reason' },
]
const currentBranchId=computed(()=>store.getters['app/currentBranchId'])
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
const formatTime = (date) => {
  return moment(date).format('lll')
}
// method
const fetchData = () => {
  loading.value = true
  const { page, rowsPerPage } = pagination.value
  let exp = new RegExp(filter.value)
  const query = {
    branchId:currentBranchId.value
  }
  if (filter.value) {
    query['$or'] = [
      { department: { $regex: exp, $options: 'i' } },
      { status: { $regex: exp, $options: 'i' } },
    ]
  }
  const match = {
    page,
    rowsPerPage,
    selector: query,
  }
  Meteor.call('findAttendance', { ...match }, (err, res) => {
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
watch(()=>currentBranchId.value,()=>{
  fetchData()
})
// life cycle
onMounted(() => {
  fetchData()
})
</script>