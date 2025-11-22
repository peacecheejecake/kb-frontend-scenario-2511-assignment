/// <reference types="cypress" />

import type { SimpleMovie } from '@/hooks/movies'

const API_PATH = '/api/movies'

describe('영화 검색 App - E2E', () => {
  const visitHome = () => {
    cy.visit('/')
  }

  it('초기 검색 화면이 올바르게 렌더링된다', () => {
    visitHome()

    cy.get('[data-testid="headline"]').should('exist')

    cy.get('[data-testid="input-text"]')
      .should('exist')
      .and('have.attr', 'placeholder', 'Search for a movie')

    cy.get('[data-testid="button-reset"]').should('exist')
    cy.get('[data-testid="button-search"]').should('exist')

    cy.contains('Search for the movie title!').should('be.visible')
  })

  it('영화 제목을 검색하면 영화 목록을 렌더링한다', () => {
    visitHome()

    cy.fixture('movies.json').then((movies: { Search: SimpleMovie[] }) => {
      cy.intercept('GET', `${API_PATH}*`, req => {
        const url = new URL(req.url)
        const title = url.searchParams.get('title')

        expect(title).to.eq('Frozen')

        req.reply({
          statusCode: 200,
          body: {
            Response: 'True',
            Search: movies.Search
          }
        })
      }).as('searchMovies')

      cy.get('[data-testid="input-text"]').type('Frozen')
      cy.get('[data-testid="button-search"]').click()

      cy.wait('@searchMovies')

      cy.contains('li', movies.Search[0].Title).should('be.visible')
      cy.contains('li', movies.Search[1].Title).should('be.visible')

      cy.contains('Search for the movie title!').should('not.exist')
    })
  })

  it('API가 실패 응답(Response=False)을 반환하면 에러 메시지를 보여준다', () => {
    visitHome()

    cy.intercept('GET', `${API_PATH}*`, {
      statusCode: 200,
      body: {
        Response: 'False',
        Error: 'Movie not found!'
      }
    }).as('searchMoviesError')

    cy.get('[data-testid="input-text"]').type('some-unknown-title')
    cy.get('[data-testid="button-search"]').click()

    cy.wait('@searchMoviesError')

    cy.contains('Movie not found!').should('be.visible')
  })

  it('Reset 버튼을 누르면 검색어와 결과가 초기화된다', () => {
    visitHome()

    cy.fixture('movies.json').then((movies: { Search: SimpleMovie[] }) => {
      cy.intercept('GET', `${API_PATH}*`, {
        statusCode: 200,
        body: {
          Response: 'True',
          Search: movies.Search
        }
      }).as('searchMovies')

      cy.get('[data-testid="input-text"]').type('Frozen')
      cy.get('[data-testid="button-search"]').click()
      cy.wait('@searchMovies')

      const firstTitle = movies.Search[0].Title
      cy.contains('li', firstTitle).should('be.visible')

      cy.get('[data-testid="button-reset"]').click()

      cy.get('[data-testid="input-text"]').should('have.value', '')

      cy.contains('Search for the movie title!').should('be.visible')

      cy.contains('li', firstTitle).should('not.exist')
    })
  })

  it('검색 중에는 Search 버튼에 로딩 스피너가 보이고, 완료 후에는 사라진다', () => {
    visitHome()

    cy.fixture('movies.json').then((movies: { Search: SimpleMovie[] }) => {
      cy.intercept('GET', `${API_PATH}*`, {
        statusCode: 200,
        delay: 800,
        body: {
          Response: 'True',
          Search: movies.Search
        }
      }).as('searchMoviesSlow')

      cy.get('[data-testid="input-text"]').type('Frozen')
      cy.get('[data-testid="button-search"]').click()

      cy.get('[data-testid="button-search"]').within(() => {
        cy.get('[data-testid="loader"]').should('exist')
      })

      cy.wait('@searchMoviesSlow')

      cy.get('[data-testid="button-search"]').within(() => {
        cy.get('[data-testid="loader"]').should('not.exist')
      })
    })
  })

  it('영화 카드를 클릭하면 상세 페이지(/movies/[id])로 이동한다', () => {
    visitHome()

    cy.fixture('movies.json').then((movies: { Search: SimpleMovie[] }) => {
      cy.intercept('GET', `${API_PATH}*`, {
        statusCode: 200,
        body: {
          Response: 'True',
          Search: movies.Search
        }
      }).as('searchMovies')

      cy.get('[data-testid="input-text"]').type('Frozen')
      cy.get('[data-testid="button-search"]').click()
      cy.wait('@searchMovies')

      const firstMovie = movies.Search[0]

      cy.contains('li', firstMovie.Title).find('a').click()

      cy.url().should('include', `/movies/${firstMovie.imdbID}`)
    })
  })

  it('👀 버튼을 클릭하면 포스터 페이지(/poster/[id])로 이동한다', () => {
    visitHome()

    cy.fixture('movies.json').then((movies: { Search: SimpleMovie[] }) => {
      cy.intercept('GET', `${API_PATH}*`, {
        statusCode: 200,
        body: {
          Response: 'True',
          Search: movies.Search
        }
      }).as('searchMovies')

      cy.get('[data-testid="input-text"]').type('Frozen')
      cy.get('[data-testid="button-search"]').click()
      cy.wait('@searchMovies')

      const firstMovie = movies.Search[0]

      cy.contains('li', firstMovie.Title).find('button').contains('👀').click()

      cy.url().should('include', `/poster/${firstMovie.imdbID}`)
    })
  })
})
