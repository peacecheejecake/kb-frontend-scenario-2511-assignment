import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'
import { useMovies, useMoviesStore } from '@/hooks/movies'

jest.mock('@/hooks/movies', () => {})

describe('<SearchBar>', () => {
  beforeEach(() => {})

  test('검색 바가 정상적으로 렌더링된다', () => {})

  test('입력 필드에 텍스트를 입력하면 setInputText가 호출된다', () => {})

  test('Reset 버튼을 클릭하면 resetMovies가 호출된다', () => {})

  test('form 제출 시 setSearchText가 호출된다', () => {})

  test('isFetching이 true일 때 Search 버튼에 로딩 상태가 표시된다', () => {})

  test('Search 버튼은 submit 타입이다', () => {})
})
