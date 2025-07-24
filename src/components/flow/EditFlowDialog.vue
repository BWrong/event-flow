<template>
  <DialogBox :visible="dialogVisible" title="编辑事件属性" width="500" :append-to-body="true" @close="closeDialog">
    <div class="dialog-content">
      <tiny-form
      label-position="top" >
        <tiny-form-item label="名称">
          <tiny-input v-model="createData.displayName"  maxlength="50"> </tiny-input>
        </tiny-form-item>
        <tiny-form-item label="唯一标识">
          <tiny-input v-model="createData.id"  disabled> </tiny-input>
        </tiny-form-item>
        <tiny-form-item label="触发事件类型">
          <tiny-input :value="createData.props?.eventLabel"  disabled> </tiny-input>
        </tiny-form-item>
      </tiny-form>
    </div>
    <template #footer>
      <div class="bind-dialog-footer">
        <Button type="info" @click="confirm">确 定</Button>
        <Button @click="closeDialog">取 消</Button>
      </div>
    </template>
  </DialogBox>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Button, DialogBox, Form as TinyForm, FormItem as TinyFormItem,Input as TinyInput} from '@opentiny/vue'
import { EventFlow } from './apis';

const emit = defineEmits(['confirm'])
const dialogVisible = ref(false)
const createData = ref({} as EventFlow)
function closeDialog() {
  dialogVisible.value = false
  createData.value = {} as EventFlow
}

function confirm() {
  emit('confirm', createData.value);
  nextTick(() => {
    closeDialog()
  })
}
defineExpose({
  openDialog(data: EventFlow) {
    createData.value = { ...data }
    dialogVisible.value = true
  },
  closeDialog
})
</script>

<style lang="less" scoped></style>
