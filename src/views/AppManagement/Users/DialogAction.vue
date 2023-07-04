<template>
  <div class="pa-6 color-white--bg customP">
    <v-form @submit.prevent="submitForm">
      <v-row align="start" no-gutters>
        <v-col cols="6">
          <p class="font-24 font-weight-bold">Add User</p>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn
            type="button"
            class="font-weight-bold text-capitalize mr-4"
            @click="$emit('closeDialog')"
          >
            Cancel
          </v-btn>

          <v-btn
            type="submit"
            class="font-weight-bold text-capitalize"
            color="primary"
            :dark="!$v.$invalid"
            :loading="loading"
            :disabled="$v.$invalid"
          >
            Save
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="mt-6" no-gutters>
        <v-col cols="12" lg="9">
          <v-text-field
            v-model="form.name"
            name="name"
            label="Name"
            :error-messages="nameErrors"
            @input="$v.form.name.$touch()"
            @blur="$v.form.name.$touch()"
            outlined
            clearable
          ></v-text-field>

          <v-text-field
            v-model="form.email"
            name="email"
            label="Username"
            :error-messages="emailErrors"
            @input="$v.form.email.$touch()"
            @blur="$v.form.email.$touch()"
            outlined
            clearable
          ></v-text-field>

          <v-text-field
            v-model="form.password"
            label="Password"
            placeholder="Masukkan password"
            :type="fieldPassword ? 'text' : 'password'"
            :append-icon="fieldPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :error-messages="passwordErrors"
            @input="$v.form.password.$touch()"
            @blur="$v.form.password.$touch()"
            @click:append="fieldPassword = !fieldPassword"
            outlined
            clearable
          ></v-text-field>

          <div class="d-flex align-start">
            <input
              ref="image"
              type="file"
              accept="image/png"
              style="display: none"
              @change="onFilePicked"
            />
            <div class="d-inline-block uploadCustom mr-4">
              <div
                @click="pickFile"
                class="exImg radius-8"
                :style="{ backgroundImage: `url(${form.imageUrl})` }"
              >
                <div class="overlay radius-8">
                  <v-icon dark class="exIcon">mdi-pencil</v-icon>
                </div>
              </div>
            </div>

            <div class="d-inline-block">
              <p class="font-18 font-weight-bold">Image</p>
              <p>Image extension .png</p>
              <p>Max 5MB</p>
              <p>Recommend size: 128px x 128px</p>
              <v-btn
                @click="deleteImage"
                v-if="form.imageUrl !== '/static/img/userdefault2.png'"
                color="error"
              >
                Delete image
              </v-btn>
            </div>
          </div>

          <v-select
            v-if="listRole.length"
            class="mt-4"
            v-model="form.role"
            :items="listRole"
            item-text="name"
            item-value="id"
            label="Roles"
            return-object
            multiple
            outlined
            chips
          ></v-select>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

import { add, edit } from '@/service/AppManagement/users'
import { formEdit } from '../../../service/AppManagement/users'

//import userdefault2 from '@/assets/img/userdefault2.png'
export default {
  props: {
    listRole: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      default: ''
    },
    idDialog: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        email: '',
        password: '',
        imageData: '',
        imageUrl: '/static/img/userdefault2.png',
        role: [],
      },
      fieldPassword: false,
    }
  },

  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      //!this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.form.name.required && errors.push('Name is required')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.form.email.$dirty) return errors
      //!this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.form.email.required && errors.push('Email is required')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.minLen && errors.push('Minimum 6 karakter')
      !this.$v.form.password.required && errors.push('Password is required')
      return errors
    },
  },

  created() {
    if (this.type === 'edit') {
      this.getFormEdit(this.idDialog)
    }
  },

  methods: {
    getFormEdit(id) {
      this.loading = true

      formEdit(id)
        .then(({ data }) => {
          //this.form = {

          //}
        })
        .catch(() => {})
        .finally(() => this.loading = false)
    },
    submitForm() {
      this.loading = true

      const { name, email, password, role, imageData } = this.form

      let formData = new FormData();
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)

      if (role.length > 0) {
        role.forEach((dt, indexKey) => {
          formData.append(`role[${indexKey}]`, dt.id);
        })
      }

      formData.append('photo', imageData)

      add(formData)
        .then(({ data }) => {
          this.$swal('Success', data.message, 'success');
          this.$emit('refreshPage')
          this.$emit('closeDialog')
        })
        .catch((err) => {})
        .finally(() => {
          this.loading = false;
        });
    },
    pickFile() {
      this.$refs.image.click()
    },
    onFilePicked() {
      const files = this.$refs.image.files[0]
      console.log(files)
      if (files !== undefined) {
        const fr = new FileReader()
        fr.readAsDataURL(files)
        fr.addEventListener('load', () => {
          this.form.imageUrl = fr.result
          this.form.imageData = files
        })
      }
    },
    deleteImage() {
      this.form.imageData = ''
      this.form.imageUrl = '/static/img/userdefault2.png'
    },
  },

  validations: {
    form: {
      name: {
        required,
      },
      email: {
        required,
      },
      password: {
        required,
        minLen: minLength(6),
      },
    },
  },
}
</script>