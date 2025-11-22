export default async function ErrorTest() {
  if (process.env.NODE_ENV === 'development') {
    throw new Error('This is a test error from ErrorTest page.')
  }
}
