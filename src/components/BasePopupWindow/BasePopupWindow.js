const root = {}

root.name = 'BasePopupWindow'

/*---------------------- 属性 ---------------------*/
root.props = {}

root.props.open = {
  type: Boolean,
  default: false
}
root.props.close = {
  type: Function
}

root.props.showClose = {
  type: Boolean,
  default: true
}

root.props.pop_width = {
  type: Boolean,
  default: false
}

root.props.headerBorder = {
  type: Boolean,
  default: true
}


/*---------------------- data ---------------------*/

root.data = function () {
  return {}
}

root.computed = {}
root.computed.show = function () {
  return this.open
}

/*---------------------- 方法 ---------------------*/

root.methods = {}

root.methods.closeClick = function () {
  this.close && this.close()
}


export default root


