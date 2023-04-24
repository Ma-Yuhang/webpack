import { chunk } from 'lodash-es'

export function add(a, b) {
  console.log('add');
  return a + b
}

export function sub(a, b) {
  console.log('sub');
  return a - b
}

export function myChunk(arr, n) {
  console.log('myChunk');
  return chunk(arr, n)
}