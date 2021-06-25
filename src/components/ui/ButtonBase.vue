<template>
  <button class="main-btn"
          :type="buttonType"
          :class="{'main-btn--disabled': this.isButtonDisabled}"
          :name="buttonName"
          :disabled="isButtonDisabled"
          @click.prevent="clickEvent"
  >
    {{buttonValue}}
  </button>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'

enum ButtonTypes {
  btnSubmit = 'submit',
  btnButton = 'button',
  btnReset = 'reset'
}

export default Vue.extend({
  name: "ButtonBase",
  props: {
    buttonValue: {
      type: String,
      default: ''
    },
    buttonName: {
      type: String,
      default: ''
    },
    buttonWidth: {
      type: String,
      default: ''
    },
    isButtonDisabled: {
      type: Boolean,
      default: false
    },
    buttonType: {
      type: String as PropType<ButtonTypes>,
      default: ButtonTypes.btnButton
    }
  },
  methods: {
    clickEvent(): void {
      this.$emit('onClick');
    }
  },
})
</script>