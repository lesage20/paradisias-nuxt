<template>
  <div class="min-h-screen bg-gray-50">
    <!-- En-tête -->
    <header class="bg-white shadow">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex flex-shrink-0 items-center">
              <NuxtLink to="/" class="text-xl font-bold text-indigo-600">Paradisias Hotel</NuxtLink>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/login"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Connexion
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-600 hover:bg-indigo-50"
            >
              Inscription
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Contenu principal -->
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
