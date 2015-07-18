export default function preventEvent(callback) {
  return event => {
    event.preventDefault()
    callback()
  }
}
