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
            {{ props.row.name }}
          </span>
        </q-td>
      </template>
      <template #body-cell-position="props">
        <q-td :props="props">
          <span  >
            {{ props.row.posName }}
          </span>
        </q-td>
      </template>
      <template #body-cell-checkin="props">
        <q-td :props="props">
          <span  >
            {{ props.row.checkIn.toLocaleTimeString() }}
          </span>
        </q-td>
      </template>
      <template #body-cell-checkout="props">
        <q-td :props="props">
          <span >
            {{ props.row.checkOut.toLocaleTimeString() }}
          </span>
        </q-td>
      </template>
      <template #body-cell-telephone="props">
        <q-td :props="props">
          <span >
            {{ props.row.telephone }}
          </span>
        </q-td>
      </template>
      <template #body-cell-type="props">
        <q-td :props="props">
          <span >
            {{ props.row.typeName }}
          </span>
        </q-td>
      </template>

      <template #body-cell-startDate="props">
        <q-td :props="props">
          <span  >
            {{ props.row.startDate.toLocaleDateString() }}
          </span>
        </q-td>
      </template>
      <template #body-cell-address="props">
        <q-td :props="props">
          <span >
            {{ props.row.address }}
          </span>
        </q-td>
      </template>
    </q-table>
  
    <EmployeeForm 
      :dialog="visibleDialog"
      :show-id="showId"
      @closed="handleClosedDialog"
    />
  </template>
  <script setup>
  import { computed, onMounted, ref,watch } from 'vue'
  import Notify from '/imports/ui/lib/notify'
  import EmployeeForm from './EmployeeForm.vue';
  import {useStore} from '/imports/store'

  const store = useStore()
  
  const currentBranchId=computed(()=>store.getters['app/currentBranchId'])
  const columns = [
    {
      name: 'name',
      label: 'Name',
      align: 'left',
      field: 'name',
    },
    { name: 'type', label: 'Type', field: 'type' },
    { name: 'position', label: 'Position', field: 'position' },

    { name: 'address', label: 'Address', field: 'address' },
    { name: 'telephone', label: 'Telephone', field: 'telephone' },
    { name: 'startDate', label: 'Sart Date', field: 'startDate' },

    { name: 'checkin', label: 'Check In', field: 'checkin' },
    { name: 'checkout', label: 'Check Out', field: 'checkout' },
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
    Meteor.call('findEmployee', { ...match }, (err, res) => {
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
  
  // life cycle
  onMounted(() => {
    fetchData()
  })
  watch(()=>currentBranchId.value,()=>{
    fetchData()
  })

  
  </script>