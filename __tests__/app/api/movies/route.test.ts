// __tests__/movies-route.test.ts
import { GET } from '@/app/api/movies/route'
import axios from 'axios'
import mockMovies from '@/__mocks__/movies.json'
import type { AxiosResponse } from 'axios'

// axios 모킹
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('GET /api/movies', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('title 파라미터로 OMDB API를 호출하고 응답을 반환한다', async () => {
    process.env.OMDB_API_KEY = 'TEST_KEY'

    const mockedResponse = {
      data: mockMovies
    } as unknown as AxiosResponse<typeof mockMovies>

    mockedAxios.get.mockResolvedValue(mockedResponse)

    const request = new Request('https://example.com/api/movies?title=Matrix')

    const response = await GET(request)

    // axios.get가 올바른 URL로 호출되었는지
    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://omdbapi.com/?apikey=TEST_KEY&s=Matrix'
    )

    // Response.json에 OMDB data가 그대로 실려 오는지
    const json = await response.json()
    expect(json).toEqual(mockMovies)
  })

  test('API_KEY가 환경변수에서 올바르게 사용된다', async () => {
    process.env.OMDB_API_KEY = 'ANOTHER_KEY'

    const mockedResponse = {
      data: mockMovies
    } as unknown as AxiosResponse<typeof mockMovies>

    mockedAxios.get.mockResolvedValue(mockedResponse)

    const request = new Request(
      'https://example.com/api/movies?title=Inception'
    )

    await GET(request)

    // 호출된 URL에 env 에서 읽어온 KEY가 들어갔는지 확인
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://omdbapi.com/?apikey=ANOTHER_KEY&s=Inception'
    )
  })
})
