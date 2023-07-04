<template>
  <div>
    <div class="ma-6">
      <v-row no-gutters>
        <v-col cols="12">
          <p class="font-24">Users</p>
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <v-row no-gutters class="mt-4">
        <v-col cols="12">
          <div class="flex-container flex-container--start">
            <div class="table-handler-flex mr-4">
              <v-select
                v-model="role"
                :items="itemsRole"
                item-text="name"
                item-value="id"
                label="Role"
                outlined
                @change="refreshPage"
              >
                <!--class="width-auto d-inline-block"-->
              </v-select>
            </div>

            <div class="table-handler-flex width-full mr-4">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Search"
                @change="refreshPage"
                outlined
                clearable
              ></v-text-field>
            </div>

            <div class="table-handler-flex">
              <v-btn
                class="height-56 text-capitalize"
                color="primary"
                @click.stop="openDialog('add')"
              >
                <v-icon dark left>mdi-plus</v-icon> Add
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <!--<v-row no-gutters justify="end">
            <v-col lg="2">
            </v-col>
          </v-row>-->
          <v-row no-gutters>
            <v-col lg="12">
              <v-data-table
                :headers="headers"
                :items="items"
                :options.sync="options"
                :server-items-length="total"
                :loading="loading"
                :footer-props="footerPagination"
                class="elevation-1"
              >
                <!-- FIELD ACTIONS -->
                <template v-slot:[`item.actions`]="{ item }">
                  <!-- EDIT -->
                  <!--{{ item.id }}-->
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        Action
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title class="cursor-pointer" @click="openDialog('edit', item.id)">Edit</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <!-- EDIT -->
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="dialog" width="700" persistent>
      <dialog-action
        v-if="dialog"
        @closeDialog="dialog = false"
        :listRole="propsListRole"
        @refreshPage="refreshPage"
        :type="type"
        :idDialog="idDialog"
      ></dialog-action>
    </v-dialog>
  </div>
</template>

<script>
import { getRole, list } from '@/service/AppManagement/users'

import DialogAction from './DialogAction.vue'

export default {
  components: {
    DialogAction,
  },
  data() {
    return {
      role: '',
      itemsRole: [
        {
          name: 'All',
          id: '',
        },
      ],
      dialog: false,
      search: '',
      headers: [
        {
          text: 'Username',
          align: 'left',
          sortable: true,
          value: 'email',
        },
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'name',
        },
        {
          text: 'Status',
          align: 'left',
          sortable: true,
          value: 'active',
        },
        {
          text: 'Actions',
          align: 'center',
          sortable: false,
          value: 'actions',
        },
      ],
      items: [],
      loading: false,
      footerPagination: {
        itemsPerPageOptions: [5, 10, 25],
      },
      options: {
        itemsPerPage: 5,
      },
      total: 0,
      orderField: '',
      orderDir: '',
      propsListRole: [],
      type: '',
      idDialog: null,
    }
  },

  watch: {
    options: {
      handler() {
        this.getData()
      },
      deep: true,
    },
  },

  created() {
    this.listRole()
  },

  methods: {
    listRole() {
      this.propsListRole = []
      getRole()
        .then(({ data }) => {
          let tempRole = []

          data.forEach((role, index) => {
            tempRole[index] = {
              name: role.name,
              id: role.id,
            }
          })

          this.propsListRole = tempRole
          this.itemsRole = [...this.itemsRole, ...tempRole]
        })
        .catch(() => {})
    },
    //changeRole() {
    //  this.options.page = 1
    //  this.getData()
    //},
    //getSearch() {
    //  this.options.page = 1
    //  this.getData()
    //},
    refreshPage() {
      this.options.page = 1
      this.getData()
    },
    getData() {
      this.loading = true

      this.items = []

      if (this.options.sortBy.length != 0) {
        this.orderField = this.options.sortBy[0]
        if (this.options.sortDesc[0]) {
          this.orderDir = 'desc'
        } else {
          this.orderDir = 'asc'
        }
      } else {
        this.orderField = ''
        this.orderDir = ''
      }

      let params = {
        per_page: this.options.itemsPerPage,
        role_id: this.role,
        page: this.options.page,
        order_field: this.orderField,
        order_dir: this.orderDir,
        search: this.search,
      }

      list(params)
        .then(({ data }) => {
          this.items = data.data
          this.total = data.total
        })
        .catch((err) => {})
        .finally(() => {
          this.loading = false
        })
    },

    openDialog(type, idDialog = null) {
      this.type = type
      this.idDialog = idDialog
      this.dialog = true
    },
  },
}
</script>