export default function sum(...args) {
  return args.reduce((p, r) => p + r,0)
}