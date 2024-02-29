import { DirectiveBinding } from "vue"
import notFound from '@/assets/images/404.png'
import { useIntersectionObserver } from '@vueuse/core'

export const imgLazy = {
  mounted(el: HTMLImageElement, bindings: DirectiveBinding) {
    const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
      // true；进入可视区域，false：未进入可视区域
      if (isIntersecting) {
        // 1、给图片的src属性赋值图片的地址
        el.src = bindings.value
        // 2、停止监听
        stop()
        // 3、加载的图片失败了
        el.onerror = () => {
          el.src = notFound
        }
      }
    })
  }
}