<template>
  <div class="right_panel">
    <Deck
        @updated="$emit('updated')"
    />
    <div class="active">
      <button-base button-value="Старт"
                   button-type="button"
      />
      <button-base button-value="Выход"
                   button-type="button"
                   @onClick="onExit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Deck from "@/components/Deck.vue";
import ButtonBase from "@/components/ui/ButtonBase.vue";
import authModule from "@/store/modules/auth.module";

export default Vue.extend({
  name: "RightPanel",
  components: {Deck, ButtonBase},
  methods: {
    onExit(): void {
      authModule.actions.A_LOGOUT();
    }
  }
})
</script>