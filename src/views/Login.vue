<template>
  <div>
    <v-row class="ma-0">
      <v-col class="pa-0" cols="6">
        <div
          class="height-100-vh imgCustom"
          :style="{ backgroundImage: `url(${bglogin})` }"
        ></div>
      </v-col>
      <v-col cols="6" class="pt-25-vh px-6">
        <div class="pa-4 radius-15 boxCustom">
          <img :src="logobat" alt="BAT" class="width-100" />
          <p class="font-24 font-weight-bold mt-6">Sign In</p>

          <v-form class="mt-6" @submit.prevent="login">
            <v-text-field
              v-model="email"
              name="email"
              label="Email"
              :error-messages="emailErrors"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              placeholder="Masukkan Email"
              outlined
            >
            </v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              class="mt-4"
              :error-messages="passwordErrors"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              placeholder="Masukkan password"
              :type="fieldPassword ? 'text' : 'password'"
              :append-icon="fieldPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="fieldPassword = !fieldPassword"
              outlined
            ></v-text-field>

            <div>
              <v-btn
                type="submit"
                rounded
                color="primary"
                :dark="!$v.$invalid"
                :loading="loading"
                :disabled="$v.$invalid"
              >
                Login Now!
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import { required, minLength } from "vuelidate/lib/validators";

import router from "@/router/index";

import { login } from "@/service/auth";

import logobat from "@/assets/img/logobat.png";
import bglogin from "@/assets/img/bglogin.jpg";

export default {
  data() {
    return {
      loading: false,
      email: "",
      password: "",
      fieldPassword: false,
      logobat,
      bglogin,
    };
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      //!this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("Email is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLen && errors.push("Minimum 6 karakter");
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },
  },
  methods: {
    login() {
      this.loading = true;

      const email = this.email;
      const password = this.password;

      this.email = "";
      this.password = "";
      this.$v.$reset();

      const data = {
        email,
        password,
      };

      login(data)
        .then(({ data: { token } }) => {
          VueCookies.set("token", "Bearer " + token, "450MIN");
          router.push("/home")
        })
        .catch((err) => {})
        .finally(() => {
          this.loading = false;
        });
    },
  },
  validations: {
    email: {
      required,
    },
    password: {
      required,
      minLen: minLength(6),
    },
  },
};
</script>
