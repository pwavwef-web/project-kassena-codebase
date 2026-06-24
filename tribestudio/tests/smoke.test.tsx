import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardPage } from '../src/pages/DashboardPage'

describe('TribeStudio — starter smoke test', () => {
  it('renders the placeholder dashboard heading', () => {
    render(<DashboardPage />)
    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument()
  })
})
