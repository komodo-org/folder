<script setup lang="ts">
const { bucket } = useBucket();
const limit = 10 * 1000 * 1000 * 1000; // 10GB
const used = computed(() => {
  if (bucket.value && bucket.value.size) return bucket.value.size;
  else return 0;
});
const usedPercentage = computed(() => {
  let aux = (used.value / limit);
  aux = 100 * aux  // To Percentage format
  return aux;
});
</script>
<template>
  <UFormField
    label="Storage Usage"
    :help="`${formatBytes(used)} of ${formatBytes(limit)} used`"
    size="sm"
    class="w-full"
  >
    <UProgress :modelValue="usedPercentage" />
  </UFormField>
</template>
