const root = {};
root.name = "SignPageLogin";
root.data = function () {
	return{

	}
};

root.created = function () {

};
root.mounted = function () {
	let userId = !!this.$store.state.authMessage ? this.$store.state.authState.userId : '';
	// console.log("userId======="+userId);
	if (!!userId) return;
	// window.location.replace(this.$store.state.domain_url + 'index/sign/login');
}
export default root;
