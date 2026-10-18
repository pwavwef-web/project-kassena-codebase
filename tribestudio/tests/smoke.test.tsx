import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardPage } from '../src/pages/StudioPages'

describe('TribeStudio MVP', () => {
  it('renders the contribution command center', () => {
    render(<DashboardPage />)

    expect(
      screen.getByRole('heading', { name: /contribution command center/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/pending review/i)).toBeInTheDocument()
    expect(screen.getByText(/google sign-in required/i)).toBeInTheDocument()
    expect(screen.getByText(/ai calls are feature-flagged off/i)).toBeInTheDocument()
  })
})
