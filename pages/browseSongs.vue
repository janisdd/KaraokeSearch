<script setup lang="ts">
import type { SongInfo } from "~~/types/song";

defineOptions({
  name: "SongsPage",
});

const { data: songs, pending, error } = await useFetch<SongInfo[]>("/api/songs");

const totalCount = computed(() => songs.value?.length ?? 0);
const subtitle = computed(() => `Found ${totalCount.value} song(s).`);
</script>

<template>
  <SongListView
    title="Browse Songs"
    :subtitle="subtitle"
    :total-count="totalCount"
    :songs="songs"
    state-key-prefix="songs"
    audio-storage-key="songs"
    :is-loading="pending"
    :has-error="Boolean(error)"
    empty-message="No songs found."
  />
</template>
