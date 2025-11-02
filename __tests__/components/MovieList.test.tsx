import { render, screen } from '@testing-library/react'
import MovieList from '@/components/MovieList'
import { useMovies, useMoviesStore } from '@/hooks/movies'
import mockMovies from '@/__mocks__/movies.json'

// hooks 모킹
jest.mock('@/hooks/movies', () => {})
jest.mock('next/navigation', () => {})

describe('<MovieList>', () => {
  beforeEach(() => {})

  test('영화 목록이 정상적으로 렌더링된다', () => {})

  test('영화 목록이 비어있고 메시지가 있을 때 메시지가 표시된다', () => {})

  test('영화 목록이 있을 때는 메시지가 표시되지 않는다', () => {})

  test('영화 목록이 undefined일 때 메시지가 표시된다', () => {})
})
