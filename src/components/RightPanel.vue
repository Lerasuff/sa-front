<template>
  <div class="right_panel">
    <Deck
        @updated="$emit('updated')"
    />
  </div>
</template>

<script>
import Deck from "@/components/Deck";
export default {
name: "RightPanel",
  components: {Deck}
}
</script>