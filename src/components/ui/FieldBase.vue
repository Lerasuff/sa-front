<template>
  <label class="main-form__field-wrapper">
    <input v-model="inputValue"
           class="main-form__field"
           :class="{'main-form__field--error': !!error}"
           :placeholder="inputPlaceholder"
           :name="inputName"
           :readonly="isInputReadOnly"
           @input="error=null"
    />
    <span class="main-form__error" v-if="!!error">{{error}}</span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';

interface Data {
  inputValue: string;
  error: string | null;
}

export default Vue.extend({
  name: "FieldBase",
  props: {
    inputPlaceholder: {
      type: String,
      default: ''
    },
    inputName: {
      type: String,
      default: ''
    },
    inputError: {
      type: String,
      default: null
    },
    isInputReadOnly: {
      type: Boolean,
      default: false
    }
  },
  data(): Data {
    return {
      inputValue: '',
      error: null
    }
  },
  watch: {
    inputValue(): void {
      this.$emit('value',this.inputValue);
    },
    inputError(): void {
      this.error = this.inputError;
    }
  }
})
</script>