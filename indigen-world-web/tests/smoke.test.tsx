import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from '../src/pages/PublicPages'

describe('Indigen World web MVP', () => {
  it('renders the public home experience and flagship programme', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /^indigen world$/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/project kasena is the flagship/i)).toBeInTheDocument()
    expect(screen.getByText(/production ai calls/i)).toBeInTheDocument()
  })
})
