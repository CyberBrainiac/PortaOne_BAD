export default async function throttling(delay) {
  return new Promise(resolve => setTimeout(() => resolve(true), delay));
}
