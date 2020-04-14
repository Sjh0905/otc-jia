const root = {}
root.name = 'BaseRadio'
/*------------------------------ props -------------------------------*/
root.props = {}
root.props.pay_type = {
    type: String,
    default: 'radio'
}
root.props.value_arr = {
    type: Array,
    default: function () {
        return [];
    }
}
root.props.text_list = {
    type: Array,
    default: function () {
        return [];
    }
}

root.data = function () {
    return {
        model: 0,
    }
}


/*------------------------------ 方法 -------------------------------*/
root.methods = {}
root.methods.CHNAGE_RADIO = function () {
    this.$eventBus.notify({key: 'GET_RADIO_VALUE'}, this.model);
}


export default root
