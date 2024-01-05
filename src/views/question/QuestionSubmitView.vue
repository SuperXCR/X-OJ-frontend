<template>
  <div id="questionsView">
    <h2>浏览题目提交</h2>
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入题目Id" />
      </a-form-item>
      <a-form-item field="title" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-mm-DD") }}
      </template>
      <!--      <template #optional="{ record }">-->
      <!--        <a-space>-->
      <!--          <a-button status="undefined" @click="toQuestionPage(record)"-->
      <!--            >查看代码-->
      <!--          </a-button>-->
      <!--        </a-space>-->
      <!--      </template>-->
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();
const dataList = ref([]);
const total = ref(0);

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败. " + res.message);
  }
};

// 监听 函数变量， 如有改变，重新触发
watchEffect(() => {
  loadData();
});

/**
 * 页面初始化加载数据
 */
onMounted(() => {
  loadData();
});

// {id: "1", title: "新的标题", content: "新的内容", tags: "["二叉树"]", answer: "新的题目", submitNum: 0,…}
// userId language judgeInfo.message

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  // {
  //   title: "创建时间",
  //   dataIndex: "createTime",
  // },
  // {
  //   title: "消耗内存",
  //   slotName: "judgeInfo",
  // },
  // {
  //   title: "消耗时间",
  //   slotName: "judgeInfo",
  // },
  // {
  //   title: "执行时间",
  //   slotName: "judgeInfo",
  // },
  // {
  //   title: "执行状态",
  //   slotName: "judgeInfo",
  // },
  // {
  //   title: "题目",
  //   slotName: "judgeInfo",
  // },
  // {
  //   title: "提交者",
  //   slotName: "judgeInfo",
  // },
  // {
  //   title: "提交时间",
  //   slotName: "judgeInfo",
  // },
  {
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */

const doSubmit = () => {
  // 重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
