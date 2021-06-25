<template>
  <div class="right_panel">
<!--    <Deck
        @updated="$emit('updated')"
    />-->
    <div class="active">
      <button-base button-value="Старт"
                   button-type="button"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ButtonBase from "@/components/ui/ButtonBase.vue";

export default Vue.extend({
  name: "RightPanel",
  components: {ButtonBase}
})
</script>