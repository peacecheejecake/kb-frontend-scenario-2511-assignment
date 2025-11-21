/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  ReactElement,
  ButtonHTMLAttributes,
  PropsWithChildren
} from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'
import { useMovies, useMoviesStore } from '@/hooks/movies'

jest.mock('@/hooks/movies', () => ({
  __esModule: true,
  useMovies: jest.fn(),
  useMoviesStore: jest.fn()
}))

jest.mock('@/components/Button', () => ({
  __esModule: true,
  default: ({
    children,
    loading,
    color,
    loadingColor,
    ...props
  }: PropsWithChildren<
    ButtonHTMLAttributes<HTMLButtonElement> & {
      loading?: boolean
      color?: string
      loadingColor?: string
    }
  >): ReactElement => (
    <button
      {...props}
      data-loading={loading ? 'true' : 'false'}>
      {children}
    </button>
  )
}))

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

const setInputTextMock = jest.fn()
const setSearchTextMock = jest.fn()
const resetMoviesMock = jest.fn()

const mockStoreState = (partial: Partial<MoviesStoreState> = {}) => {
  const defaultState: MoviesStoreState = {
    inputText: '',
    searchText: '',
    message: '',
    setInputText: setInputTextMock,
    setSearchText: setSearchTextMock,
    setMessage: jest.fn(),
    resetMovies: resetMoviesMock
  } as MoviesStoreState

  mockedUseMoviesStore.mockImplementation(selector =>
    selector({ ...defaultState, ...partial })
  )
}

const mockUseMoviesResult = (isFetching: boolean) => {
  mockedUseMovies.mockReturnValue({
    isFetching
  } as ReturnType<typeof useMovies>)
}

describe('<SearchBar>', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('검색 바가 정상적으로 렌더링된다', () => {
    mockStoreState()
    mockUseMoviesResult(false)

    render(<SearchBar />)

    expect(screen.getByTestId('input-text')).toBeInTheDocument()
    expect(screen.getByTestId('button-reset')).toBeInTheDocument()
    expect(screen.getByTestId('button-search')).toBeInTheDocument()
  })

  test('입력 필드에 텍스트를 입력하면 setInputText가 호출된다', async () => {
    const user = userEvent.setup()

    mockStoreState()
    mockUseMoviesResult(false)

    render(<SearchBar />)

    const input = screen.getByTestId('input-text') as HTMLInputElement

    await user.type(input, 'Matrix')

    expect(setInputTextMock).toHaveBeenCalled()
  })

  test('Reset 버튼을 클릭하면 resetMovies가 호출된다', async () => {
    const user = userEvent.setup()

    mockStoreState()
    mockUseMoviesResult(false)

    render(<SearchBar />)

    const resetButton = screen.getByTestId('button-reset')

    await user.click(resetButton)

    expect(resetMoviesMock).toHaveBeenCalled()
  })

  test('form 제출 시 setSearchText가 호출된다', async () => {
    const user = userEvent.setup()

    mockStoreState({ inputText: 'Inception' })
    mockUseMoviesResult(false)

    render(<SearchBar />)

    const searchButton = screen.getByTestId('button-search')

    await user.click(searchButton)

    expect(setSearchTextMock).toHaveBeenCalled()
  })

  test('isFetching이 true일 때 Search 버튼에 로딩 상태가 표시된다', () => {
    mockStoreState()
    mockUseMoviesResult(true)

    render(<SearchBar />)

    const searchButton = screen.getByTestId('button-search')

    expect(searchButton).toHaveAttribute('data-loading', 'true')
  })

  test('Search 버튼은 submit 타입이다', () => {
    mockStoreState()
    mockUseMoviesResult(false)

    render(<SearchBar />)

    const searchButton = screen.getByTestId('button-search')

    expect(searchButton).toHaveAttribute('type', 'submit')
  })
})
