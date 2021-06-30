<template>
<div class="auth-wrapper">
  <div class="auth">
    <div class="auth__title">{{ title }}</div>
    <form class="main-form-wrapper">
      <div class="main-form">
        <field-base @value="user.username=$event"
                    input-name="username"
                    input-placeholder="Логин"
        />
        <field-base @value="user.password=$event"
                    input-name="password"
                    input-placeholder="Пароль"
        />
      </div>
    </form>
    <button-base button-value="Войти"
                 button-type="submit"
                 @onClick="onsubmit"
    />
  </div>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import ButtonBase from "@/components/ui/ButtonBase.vue";
import FieldBase from "@/components/ui/FieldBase.vue";
import authModule from "@/store/modules/auth.module";

interface Data {
  user: {
    username: string;
    password: string;
  };
  title: string;
}

const {
  A_AUTH
} = authModule.actions;

export default Vue.extend({
  name: "Login",
  components: {ButtonBase, FieldBase},
  data(): Data {
    return {
      user: {
        username: '',
        password: '',
      },
      title: 'StrangeArmies'
    }
  },
  methods: {
    onsubmit(): void {
      A_AUTH(this.user)
          .then(() => {
            this.$router.push('/')
          });
    }
  }
})
</script>
