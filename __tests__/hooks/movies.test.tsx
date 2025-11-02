import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMovies, useMoviesStore, getInitialState } from '@/hooks/movies'
import mockMovies from '@/__mocks__/movies.json'
import axios from 'axios'

// axios 모킹
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// QueryClient Provider 래퍼
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false // 기본적으로 지수 백오프로 3회를 재시도하므로, 테스트를 위해 비활성화
      }
    }
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useMoviesStore', () => {
  beforeEach(() => {})

  test('setInputText가 inputText를 업데이트한다', () => {})

  test('setSearchText가 searchText를 업데이트한다', () => {})

  test('setMessage가 message를 업데이트한다', () => {})

  test('resetMovies가 모든 상태를 초기화한다', () => {})
})

describe('useMovies', () => {
  beforeEach(() => {})

  test('searchText가 비어있을 때 빈 배열을 반환한다', () => {})

  test('searchText가 있을 때 API를 호출하고 영화 목록을 반환한다', () => {})

  test('API가 False Response를 반환할 때 에러를 던진다', () => {})

  test('공백만 있는 searchText는 빈 배열을 반환한다', () => {})

  test('isFetching이 로딩 상태를 올바르게 반영한다', () => {})
})
