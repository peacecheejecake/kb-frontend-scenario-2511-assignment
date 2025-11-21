/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import type {
  PropsWithChildren,
  AnchorHTMLAttributes,
  ImgHTMLAttributes
} from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MovieItem from '@/components/MovieItem'
import type { SimpleMovie } from '@/hooks/movies'
import mockMovieJson from '@/__mocks__/movie.json'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    prefetch,
    ...rest
  }: PropsWithChildren<
    AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string
      prefetch?: boolean
    }
  >) => {
    return (
      <a
        href={href}
        {...rest}>
        {children}
      </a>
    )
  }
}))

/* eslint-disable @next/next/no-img-element */
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />
  }
}))

describe('<MovieItem>', () => {
  const movie: SimpleMovie = mockMovieJson as SimpleMovie

  beforeEach(() => {
    pushMock.mockClear()
  })

  test('영화 아이템이 정상적으로 렌더링된다', () => {
    render(<MovieItem movie={movie} />)

    expect(screen.getByText(movie.Title)).toBeInTheDocument()
  })

  test('영화 제목과 연도가 올바르게 표시된다', () => {
    render(<MovieItem movie={movie} />)

    const titleElement = screen.getByText(movie.Title)
    const yearElement = screen.getByText(movie.Year)

    expect(titleElement).toBeInTheDocument()
    expect(yearElement).toBeInTheDocument()
  })

  test('영화 포스터 이미지가 올바른 속성으로 렌더링된다', () => {
    render(<MovieItem movie={movie} />)

    const image = screen.getByAltText(movie.Title) as HTMLImageElement

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', movie.Poster)
    expect(image).toHaveAttribute('width', '200')
    expect(image).toHaveAttribute('height', '300')
  })

  test('영화 상세 페이지로 이동하는 링크가 올바른 href를 가진다', () => {
    render(<MovieItem movie={movie} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/movies/${movie.imdbID}`)
  })

  test('포스터 보기 버튼을 클릭하면 포스터 페이지로 이동한다', async () => {
    const user = userEvent.setup()
    render(<MovieItem movie={movie} />)

    const button = screen.getByRole('button', {
      name: '👀'
    }) as HTMLButtonElement

    await user.click(button)

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith(`/poster/${movie.imdbID}`)
  })
})
