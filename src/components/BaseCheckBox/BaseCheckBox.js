const root = {}
root.name = 'BaseCheckBox'


root.props = {}

root.props.changeAgreement = {
  type: Function,
}

root.props.agreement = {
  type: Boolean,
}

root.props.bgColor = {
  type: String,
  default:'light'
}

root.methods = {}


export default root
