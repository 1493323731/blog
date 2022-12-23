<template>
    <div class="container">
        <n-button @click="back">返回</n-button>
        <!-- 标题 -->
        <n-h1>{{ blogInfo.title }}</n-h1>
        <!-- 文章内容 -->
        <div>
            <!-- {{ blogInfo.content }} -->
            <div v-html="blogInfo.content" class="blog-content"></div>
            <!-- 解析html结构后显示相关内容 -->
        </div>
    </div>
</template>
<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const axios = inject("axios");
const blogInfo = ref({});
onMounted(() => {
    loadBlog();
})
const loadBlog = async () => {
    let res = await axios.get("/blog/detail?id=" + route.query.id);
    blogInfo.value = res.data.rows[0];
}
const back = () => {
    router.push("/");
}
</script>
<style>
.blog-content img {
    max-width: 100% !important;
}
</style>
<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
</style>
