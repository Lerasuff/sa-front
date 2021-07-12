<template>
  <div class="auth-wrapper">
    <div class="auth">
      <div class="auth__title">{{ title }}</div>
      <form class="main-form-wrapper" @keydown.enter="onsubmit">
        <div class="main-form">
          <field-base @value="user.username = $event" input-name="username" input-placeholder="Логин" />
          <field-base @value="user.password = $event" input-name="password" input-placeholder="Пароль" :input-type="InputTypes.password" />
        </div>
      </form>
      <button-base button-value="Войти" :button-type="ButtonTypes.btnSubmit" @onClick="onsubmit" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonBase, { ButtonTypes } from '@/components/ui/ButtonBase.vue';
import FieldBase from '@/components/ui/FieldBase.vue';
import authModule from '@/store/modules/auth.module.ts';
import { InputTypes } from '@/components/ui/FieldBase.vue';

interface Data {
  user: {
    username: string;
    password: string;
  };
  title: string;
  InputTypes;
  ButtonTypes;
}

export default Vue.extend({
  name: 'Login',
  components: { ButtonBase, FieldBase },
  data(): Data {
    return {
      user: {
        username: '',
        password: '',
      },
      title: 'StrangeArmies',
      InputTypes,
      ButtonTypes,
    };
  },
  methods: {
    onsubmit(): void {
      authModule.actions.A_AUTH(this.user).then(() => {
        this.$router.push('/');
      });
    },
  },
});
</script>
