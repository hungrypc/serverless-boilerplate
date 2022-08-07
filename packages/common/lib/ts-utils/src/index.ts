export * from 'ts-essentials'
export * from './infer'

export type StrictReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never

export type AsyncFunction<T = any> = (...args: any) => Promise<T>

export type AsyncReturnType<T extends AsyncFunction> = T extends AsyncFunction<infer R> ? R : never

export type ObjectReturnType<T extends (...args: any) => any, K extends keyof StrictReturnType<T>> = T extends (
  ...args: any
) => any
  ? StrictReturnType<T>[K]
  : never

export type Unpacked<T> = T extends (infer U)[] ? U : T

export type Modify<T, R> = Omit<T, keyof R> & R

export type OmitNeverPropertyNames<T> = { [K in keyof T]: T[K] extends never ? never : K }[keyof T]
export type OmitNeverPick<T> = Pick<T, OmitNeverPropertyNames<T>>
export type StrictOmitNeverPick<T> = OmitNeverPropertyNames<T> extends never ? never : OmitNeverPick<T>
