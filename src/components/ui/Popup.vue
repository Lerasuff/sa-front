<template>
  <div class="popup-layout">
    <div class="popup" :class="popupClass">
      <p class="popup__message">{{ popupMessage }}</p>
      <div class="popup__buttons">
        <!--      <button-base :button-value="btnOk"
                   button-class="popup-button&#45;&#45;submit"
                   :button-type="ButtonTypes.btnSubmit"
      />
      <button-base :button-value="btnCancel"
                   button-class="popup-button&#45;&#45;cancel"
                   :button-type="ButtonTypes.btnButton"
      />-->
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
  props: {
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
