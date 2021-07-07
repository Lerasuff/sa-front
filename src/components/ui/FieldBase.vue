<template>
  <label class="main-form__field-wrapper">
    <input v-model="inputValue" class="main-form__field" :class="{ 'main-form__field--error': !!error }" :placeholder="inputPlaceholder" :name="inputName" :readonly="isInputReadOnly" :type="inputType" @input="error = null" />
    <span class="main-form__error" v-if="!!error">{{ error }}</span>
  </label>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

interface Data {
  inputValue: string;
  error: string | null;
}

export enum InputTypes {
  button = 'button',
  checkbox = 'checkbox',
  color = 'color',
  date = 'date',
  email = 'email',
  file = 'file',
  hidden = 'hidden',
  image = 'image',
  month = 'month',
  number = 'number',
  password = 'password',
  radio = 'radio',
  range = 'range',
  reset = 'reset',
  search = 'search',
  submit = 'submit',
  tel = 'tel',
  text = 'text',
  time = 'time',
  url = 'url',
  week = 'week',
}

export default Vue.extend({
  name: 'FieldBase',
  props: {
    inputPlaceholder: {
      type: String,
      default: '',
    },
    inputName: {
      type: String,
      default: '',
    },
    inputError: {
      type: String,
      default: null,
    },
    isInputReadOnly: {
      type: Boolean,
      default: false,
    },
    inputType: {
      type: String as PropType<InputTypes>,
      default: InputTypes.text,
    },
  },
  data(): Data {
    return {
      inputValue: '',
      error: null,
    };
  },
  watch: {
    inputValue(): void {
      this.$emit('value', this.inputValue);
    },
    inputError(): void {
      this.error = this.inputError;
    },
  },
});
</script>
