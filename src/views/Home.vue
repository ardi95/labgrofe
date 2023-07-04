<template>
  <div class="py-24">
    <v-container>
      <v-row>
        <v-col v-if="dataFetch && roleAdmin" cols="12" md="6" lg="4">
          <div class="radius-5 pa-4 color-primary--bg">
            <p class="font-24 font-weight-bold white--text">
              {{ dataFetch.count_user }}
            </p>
            <p class="white--text mt-4">Users</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { home } from '@/service/home'

export default {
  data() {
    return {
      roleAdmin: false,
      dataFetch: null,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      home()
        .then(({ data }) => {
          this.dataFetch = data

          data.auth.roles.forEach((dt) => {
            if (dt.id === 1) this.roleAdmin = true
          })
        })
        .catch(({ err }) => {})
    },
  },
}
</script>
