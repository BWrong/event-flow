import { fieldTypeMap } from './dict'

export interface RequestObjType {
  apiId?: any
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params: any[]
  bodyDto: {
    body: {
      'multipart/form-data'?: any
      'application/x-www-form-urlencoded'?: any
      'application/json'?: any
      binary?: any
      none?: null
    }
    bodyType: 'none' | 'multipart/form-data' | 'application/x-www-form-urlencoded' | 'application/json' | 'binary'
  }
  headers: any[]
  cookies: any[]
  authInfo?: any
  pathParam?: any
}

export type FieldType = keyof typeof fieldTypeMap
