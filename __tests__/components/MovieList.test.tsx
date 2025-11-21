import type { ReactElement } from 'react'
import { render, screen } from '@testing-library/react'
import type { UseQueryResult } from '@tanstack/react-query'
import MovieList from '@/components/MovieList'
import { useMovies, useMoviesStore } from '@/hooks/movies'
import type { SimpleMovie } from '@/hooks/movies'
import mockMoviesJson from '@/__mocks__/movies.json'

jest.mock('@/hooks/movies', () => ({
  __esModule: true,
  useMovies: jest.fn(),
  useMoviesStore: jest.fn()
}))

jest.mock('@/components/MovieItem', () => ({
  __esModule: true,
  default: ({ movie }: { movie: SimpleMovie }): ReactElement => (
    <li data-testid="movie-item">{movie.Title}</li>
  )
}))

const mockMovies = mockMoviesJson.Search as SimpleMovie[]

type StoreStateFromHook<T> = T extends (
  selector: (state: infer S) => unknown
) => unknown
  ? S
  : never
type MoviesStoreState = StoreStateFromHook<typeof useMoviesStore>

const mockedUseMovies = useMovies as jest.MockedFunction<typeof useMovies>
const mockedUseMoviesStore = useMoviesStore as jest.MockedFunction<
  typeof useMoviesStore
>

const mockUseMoviesResult = (data: SimpleMovie[] | undefined) => {
  const partialResult: Partial<UseQueryResult<SimpleMovie[], Error>> = {
    data: data as SimpleMovie[],
    isLoading: false,
    isSuccess: true,
    error: null,
    status: 'success',
    fetchStatus: 'idle'
  }

  mockedUseMovies.mockReturnValue(
    partialResult as unknown as UseQueryResult<SimpleMovie[], Error>
  )
}

const mockStoreMessage = (message: string) => {
  mockedUseMoviesStore.mockImplementation(selector =>
    selector({ message } as MoviesStoreState)
  )
}

describe('<MovieList>', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('영화 목록이 정상적으로 렌더링된다', () => {
    mockStoreMessage('')
    mockUseMoviesResult(mockMovies)

    render(<MovieList />)

    const items = screen.getAllByTestId('movie-item')
    expect(items).toHaveLength(mockMovies.length)

    mockMovies.forEach(movie => {
      expect(screen.queryAllByText(movie.Title)[0]).toBeInTheDocument()
    })
  })

  test('영화 목록이 비어있고 메시지가 있을 때 메시지가 표시된다', () => {
    const message = 'Some Message'
    mockStoreMessage(message)
    mockUseMoviesResult([])

    render(<MovieList />)

    expect(screen.getByText(message)).toBeInTheDocument()
  })

  test('영화 목록이 있을 때는 메시지가 표시되지 않는다', () => {
    const message = '🏠Some🗞️Message🌵'
    mockStoreMessage(message)

    mockUseMoviesResult(mockMovies)

    render(<MovieList />)

    expect(screen.queryByText(message)).not.toBeInTheDocument()
  })

  test('영화 목록이 undefined일 때 메시지가 표시된다', () => {
    const message = '🏠Some🗞️Message🌵'
    mockStoreMessage(message)

    mockUseMoviesResult(undefined)

    render(<MovieList />)

    // const messageElement = screen.getByText((content, element) => {
    //   return element?.tagName === 'P' && Boolean(content)
    // })
    // expect(messageElement).toBeInTheDocument()
    expect(screen.getByText(message)).toBeInTheDocument()
  })
})
