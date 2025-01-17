<template>
  <div 
    :class="[
      'animate-pulse bg-gray-200 rounded',
      className
    ]"
  />
</template>

<script setup lang="ts">
defineProps<{
  className?: string
}>()</script>
