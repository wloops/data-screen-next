<script setup lang="ts">
import { Page, Layout } from '@repo/ui'
import { name } from '../package.json'
</script>

<template>
  <Layout />
  <Page :app-name="name" />
</template>
