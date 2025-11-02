import { GET } from '@/app/api/movies/route'
import axios from 'axios'
import mockMovies from '@/__mocks__/movies.json'

// axios 모킹
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('GET /api/movies', () => {
  beforeEach(() => {})

  test('title 파라미터로 OMDB API를 호출하고 응답을 반환한다', async () => {})

  test('API_KEY가 환경변수에서 올바르게 사용된다', async () => {})
})
