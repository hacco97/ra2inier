import { ref } from "vue"


export const statusText = ref('暂无status')

let changing = false
export function setStatus(status: string) {
   statusText.value = status
   changing = true
}
