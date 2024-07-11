import {createClient, type RawQueryResponse} from '@sanity/client'
import {describe, expectTypeOf, test} from 'vitest'

type FooResult = {
  bar: number
}

// This would normally be generated by @sanity/codegen
declare module '@sanity/client' {
  export interface SanityQueries {
    "*[_type == 'foo']": FooResult
  }
}

describe('client.fetch', () => {
  const client = createClient({})

  describe('without params', () => {
    test('known query type', async () => {
      const resp = await client.fetch("*[_type == 'foo']")
      expectTypeOf(resp).toMatchTypeOf<FooResult>()
    })

    test('ad-hoc query type', async () => {
      const resp = await client.fetch("*[_type == 'bar']")
      expectTypeOf(resp).toMatchTypeOf<any>()
    })

    test('ad-hoc query with a custom type', async () => {
      type Result = {bar: string}
      const resp = await client.fetch<Result>("*[_type == 'bar']")
      expectTypeOf(resp).toMatchTypeOf<Result>()
    })

    test('known query type, but overriden with ad-hoc type', async () => {
      type Result = {bar: string}
      const resp = await client.fetch<Result>("*[_type == 'foo']")
      expectTypeOf(resp).toMatchTypeOf<Result>()
    })
  })

  describe('unfiltered response', () => {
    test('known query type', async () => {
      const resp = await client.fetch("*[_type == 'foo']", {}, {filterResponse: false})
      expectTypeOf(resp).toMatchTypeOf<RawQueryResponse<FooResult>>()
    })

    test('ad-hoc query type', async () => {
      const resp = await client.fetch("*[_type == 'bar']", {}, {filterResponse: false})
      expectTypeOf(resp).toMatchTypeOf<RawQueryResponse<any>>()
    })

    test('ad-hoc query with a custom type', async () => {
      type Result = {bar: string}
      const resp = await client.fetch<Result>("*[_type == 'bar']", {}, {filterResponse: false})
      expectTypeOf(resp).toMatchTypeOf<RawQueryResponse<Result>>()
    })

    test('known query type, but overriden with ad-hoc type', async () => {
      type Result = {bar: string}
      const resp = await client.fetch<Result>("*[_type == 'foo']", {}, {filterResponse: false})
      expectTypeOf(resp).toMatchTypeOf<RawQueryResponse<Result>>()
    })
  })
})