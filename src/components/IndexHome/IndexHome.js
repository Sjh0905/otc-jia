const root = {};
root.name = "IndexHome";
root.data = function () {
	return{
    screenWidth:''
	}
};
root.components = {
	'Header': resolve => require(['../Header/Header.vue'], resolve),
	'Footer': resolve => require(['../Footer/Footer.vue'], resolve),
}
root.created = function () {
   this.screenWidth = document.body.clientWidth
  this.$store.commit('changeIsMobile', this.screenWidth <= 768)

};
root.mounted = function () {
  const that = this
  window.onresize = () => {
    return (() => {
      window.screenWidth = document.body.clientWidth
      that.screenWidth = window.screenWidth
    })()
  }
}
/*------------------------------ 观察 -------------------------------*/

root.watch = {}
root.watch.screenWidth = function (oldVal, newVal) {
  if (oldVal <= 768) {
    this.$store.commit('changeIsMobile', true)
  } else {
    this.$store.commit('changeIsMobile', false)
  }
}
export default root;
