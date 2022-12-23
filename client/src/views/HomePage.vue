<template>
    <div>
        <div class="container">
            <div class="nav">
                <div @click="homepage">首页</div>
                <div>
                    <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory"
                        :options="categortyOptions" trigger="click">
                        分类
                        <!-- <span>{{ categoryName }}</span> -->
                    </n-popselect>
                </div>
                <div @click="dashboard">后台</div>
            </div>
        </div>
    </div>
    <n-divider></n-divider>
    <n-space class="search">
        <n-input v-model:value="pageInfo.keyword" :style="{ width: '500px' }" placeholder="请输入关键字" />
        <n-button type="primary" ghost @click="loadBlogs(1)"> 搜索 </n-button>
    </n-space>

    <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px;cursor: pointer;">
        <n-card :title="blog.title" @click="toDetail(blog)">
            <!-- {{ blog.content }} -->
            <div v-html="blog.content" class="blog-content"></div>
            <template #footer>
                <n-space align="center">
                    <div>发布时间：{{ blog.create_time }}</div>
                </n-space>
            </template>
        </n-card>
    </div>
    <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />
    <n-divider></n-divider>
    <div class="footer">
        <div>Power by yhs</div>
        <div>LHDYHS备20020515号-1</div>
    </div>
</template>
<script setup>
import { ref, reactive, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const axios = inject("axios");
//在选择分类后将相关分类显示出来
// const categoryName = computed(() => {
//     let selectedOption = categortyOptions.value.find((option) => {
//         return option.value == selectedCategory.value;
//     })
//     return selectedOption ? selectedOption.label : ""
// })
const selectedCategory = ref(0);
const categortyOptions = ref([]);
const blogListInfo = ref([]);
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0,
    keyword: "",
    categoryId: 0,
});
onMounted(() => {
    loadBlogs();
    loadCategorys();
});
const loadCategorys = async () => {
    let res = await axios.get("/category/list");
    categortyOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
}
const loadBlogs = async (page = 1) => {
    pageInfo.page = page;
    let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`);
    let temp_rows = res.data.data.rows;
    //处理获取的文章列表数据
    for (let row of temp_rows) {
        if (row.content.length > 15) {
            row.content += "...";
        }
        let d = new Date(row.create_time);
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count;
    //计算分页大小
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0);
}
const searchByCategory = (categoryId) => {
    pageInfo.categoryId = categoryId;
    loadBlogs();
}
const toDetail = (blog) => {
    router.push({ path: "/detail", query: { id: blog.id } });
}
const homepage = () => {
    router.push("/");
}
const dashboard = () => {
    router.push("/login");
}
</script>
<style lang="scss" scoped>
.search {
    margin-bottom: 15px;
}

.container {
    width: 1200px;
    margin-left: 25px;
}

.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: #64676a;

    div {
        cursor: pointer;
        margin-right: 15px;

        &:hover {
            color: #18a058;
        }
    }
}

.footer {
    text-align: center;
    line-height: 25px;
    color: #64676a
}
</style>
