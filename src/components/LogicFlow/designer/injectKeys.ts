import { type ComputedRef, type InjectionKey } from 'vue'
import { type FlowNode } from '../types'
import useDesignerStore from './useDesignerStore'
export type DesignerStoreType = ReturnType<typeof useDesignerStore>
export const themeInjectKey = Symbol('theme') as InjectionKey<ComputedRef<string>>
export const modeInjectKey = Symbol('mode') as InjectionKey<ComputedRef<'edit' | 'preview'>>

export const designerStoreInjectKey = Symbol('designerStore') as InjectionKey<DesignerStoreType>

export const parentNodesInjectKey = Symbol('parentNodes') as InjectionKey<ComputedRef<FlowNode[]>>
