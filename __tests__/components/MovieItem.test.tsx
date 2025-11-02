import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MovieItem from '@/components/MovieItem'
import mockMovie from '@/__mocks__/movie.json'

jest.mock('next/navigation', () => {})
jest.mock('next/link', () => {})
/* eslint-disable @next/next/no-img-element */
jest.mock('next/image', () => {})

describe('<MovieItem>', () => {
  beforeEach(() => {})

  test('영화 아이템이 정상적으로 렌더링된다', () => {})

  test('영화 제목과 연도가 올바르게 표시된다', () => {})

  test('영화 포스터 이미지가 올바른 속성으로 렌더링된다', () => {})

  test('영화 상세 페이지로 이동하는 링크가 올바른 href를 가진다', () => {})

  test('포스터 보기 버튼을 클릭하면 포스터 페이지로 이동한다', async () => {})
})
