<template>
  <button class="main-btn" :type="buttonType" :class="[{ 'main-btn--disabled': this.isButtonDisabled }, buttonType === ButtonTypes.btnSubmit ? 'main-btn--submit' : '', buttonClass]" :name="buttonName" :disabled="isButtonDisabled" @click.prevent="clickEvent">
    {{ buttonValue }}
  </button>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export enum ButtonTypes {
  btnSubmit = 'submit',
  btnButton = 'button',
  btnReset = 'reset',
}

interface Data {
  ButtonTypes;
}

export default Vue.extend({
  name: 'ButtonBase',
  data(): Data {
    return {
      ButtonTypes,
    };
  },
  props: {
    buttonValue: {
      type: String,
      default: '',
    },
    buttonName: {
      type: String,
      default: '',
    },
    buttonWidth: {
      type: String,
      default: '',
    },
    isButtonDisabled: {
      type: Boolean,
      default: false,
    },
    buttonType: {
      type: String as PropType<ButtonTypes>,
      default: ButtonTypes.btnButton,
    },
    buttonClass: {
      type: String,
      default: '',
    },
  },
  methods: {
    clickEvent(): void {
      this.$emit('onClick');
    },
  },
});
</script>
