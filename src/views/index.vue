<template>
  <div class="wrapper">
    <div class="routeList" v-for="item in routes">
      <div class="routeItem" @click="linkTo(item.path)">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [],
    };
  },
  created() {
    document.title = 'tfjs模型-首页'
    this.routes = this.$router.options.routes;
  },
  methods: {
    linkTo(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style scoped>
.routeItem {
  margin: 20px 0;
  cursor: pointer;
}

.routeItem:hover {
  color: #3eaf7c;
}
</style>
