import { configure, defineRule } from 'vee-validate'

defineRule('required', (value) => {
  if (!value || !value.length) {
    return 'Trường này là bắt buộc'
  }
  return true
})

defineRule('email', (value) => {
  if (!value) {
    return true
  }
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  if (!regex.test(value)) {
    return 'Email không hợp lệ'
  }
  return true
})

defineRule('min', (value, [length]) => {
  if (!value) {
    return true
  }
  if (value.length < length) {
    return `Tối thiểu ${length} ký tự`
  }
  return true
})

defineRule('confirmed', (value, [target]) => {
  if (!value) {
    return true
  }
  if (value !== target) {
    return 'Mật khẩu xác nhận không khớp'
  }
  return true
})

configure({
  validateOnInput: true,
  validateOnChange: true,
  validateOnBlur: true,
  validateOnModelUpdate: true
}) 