<template>
  <div class="popup-layout">
    <div class="popup" :class="popupClass">
      <p class="popup__title">{{ popupTitle }}</p>
      <p class="popup__message">{{ popupMessage }}</p>
      <div class="container__dots" v-if="popupClass === PopupClasses.info">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
        <div class="circle circle-5"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export enum PopupClasses {
  win = 'popup-win',
  fail = 'popup-fail',
  info = 'popup-info',
}

export default Vue.extend({
  name: 'Popup',
  data() {
    return {
      PopupClasses,
    };
  },
  props: {
    popupTitle: {
      type: String,
      default: '',
    },
    popupMessage: {
      type: String,
      default: '',
    },
    popupClass: {
      type: String as PropType<PopupClasses>,
      default: PopupClasses.info,
    },
    btnOk: {
      type: String,
      default: 'ОК',
    },
    btnCancel: {
      type: String,
      default: 'Отмена',
    },
  },
});
</script>
