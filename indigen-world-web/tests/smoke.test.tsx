import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from '../src/pages/HomePage'

describe('Indigen World web — starter smoke test', () => {
  it('renders the placeholder home headline', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', {
        name: /preserving indigenous languages/i,
      }),
    ).toBeInTheDocument()
  })
})
