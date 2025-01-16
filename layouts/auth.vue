<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
      <!-- Logo -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Paradisias Hotel</h1>
        <p class="mt-2 text-sm text-gray-600">Bienvenue dans notre système de gestion</p>
      </div>
      
      <!-- Contenu des pages -->
      <slot />
    </div>
  </div>
</template>
