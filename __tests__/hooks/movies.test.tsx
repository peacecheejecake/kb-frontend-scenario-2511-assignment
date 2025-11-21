import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import {
  useMovies,
  useMoviesStore,
  getInitialState,
  INITIAL_MESSAGE
} from '@/hooks/movies'
import mockMovies from '@/__mocks__/movies.json'
import type { SimpleMovie } from '@/hooks/movies'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        retryDelay: 0
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
  beforeEach(() => {
    useMoviesStore.setState(getInitialState())
  })

  test('setInputText가 inputText를 업데이트한다', () => {
    const { setInputText } = useMoviesStore.getState()

    expect(useMoviesStore.getState().inputText).toBe('')

    act(() => {
      setInputText('Matrix')
    })

    expect(useMoviesStore.getState().inputText).toBe('Matrix')
  })

  test('setSearchText가 searchText를 업데이트한다', () => {
    const { setSearchText } = useMoviesStore.getState()

    expect(useMoviesStore.getState().searchText).toBe('')

    act(() => {
      setSearchText('Inception')
    })

    expect(useMoviesStore.getState().searchText).toBe('Inception')
  })

  test('setMessage가 message를 업데이트한다', () => {
    const { setMessage } = useMoviesStore.getState()

    expect(useMoviesStore.getState().message).toBe(INITIAL_MESSAGE)

    act(() => {
      setMessage('검색 결과가 없습니다.')
    })

    expect(useMoviesStore.getState().message).toBe('검색 결과가 없습니다.')
  })

  test('resetMovies가 모든 상태를 초기화한다', () => {
    const { setInputText, setSearchText, setMessage, resetMovies } =
      useMoviesStore.getState()

    act(() => {
      setInputText('aaa')
      setSearchText('bbb')
      setMessage('ccc')
    })

    expect(useMoviesStore.getState().inputText).toBe('aaa')
    expect(useMoviesStore.getState().searchText).toBe('bbb')
    expect(useMoviesStore.getState().message).toBe('ccc')

    act(() => {
      resetMovies()
    })

    const state = useMoviesStore.getState()
    const initial = getInitialState()

    expect(state.inputText).toBe(initial.inputText)
    expect(state.searchText).toBe(initial.searchText)
    expect(state.message).toBe(initial.message)
  })
})

describe('useMovies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useMoviesStore.setState(getInitialState())
  })

  test('searchText가 비어있을 때 빈 배열을 반환하고 API를 호출하지 않는다', async () => {
    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(mockedAxios.get).not.toHaveBeenCalled()
  })

  test('searchText가 있을 때 API를 호출하고 영화 목록을 반환한다', async () => {
    act(() => {
      useMoviesStore.setState({ searchText: 'Matrix' })
    })

    const movies = mockMovies.Search as SimpleMovie[]
    mockedAxios.get.mockResolvedValue({
      data: {
        Response: 'True',
        Search: movies
      }
    })

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/movies?title=Matrix')
    expect(result.current.data).toEqual(movies)
  })

  test('API가 False Response를 반환할 때 에러를 던지고 message를 업데이트한다', async () => {
    act(() => {
      useMoviesStore.setState({ searchText: 'Unknown' })
    })

    mockedAxios.get.mockResolvedValue({
      data: {
        Response: 'False',
        Error: 'Movie not found!'
      }
    })

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    const error = result.current.error as Error
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('Movie not found!')

    expect(useMoviesStore.getState().message).toBe('Movie not found!')
  })

  test('공백만 있는 searchText는 빈 배열을 반환하고 API를 호출하지 않는다', async () => {
    act(() => {
      useMoviesStore.setState({ searchText: '   ' })
    })

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
    expect(mockedAxios.get).not.toHaveBeenCalled()
  })

  test('isFetching이 로딩 상태를 올바르게 반영한다', async () => {
    act(() => {
      useMoviesStore.setState({ searchText: 'Matrix' })
    })

    const movies = mockMovies.Search as SimpleMovie[]
    mockedAxios.get.mockResolvedValue({
      data: {
        Response: 'True',
        Search: movies
      }
    })

    const { result } = renderHook(() => useMovies(), {
      wrapper: createWrapper()
    })

    expect(result.current.isFetching).toBe(true)

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false)
    })
  })
})
