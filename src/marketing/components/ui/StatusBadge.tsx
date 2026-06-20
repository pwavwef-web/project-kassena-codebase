import {
  metricKindLabels,
  productStatusLabels,
  type MetricKind,
  type ProductStatus,
} from '../../../content/site'

const statusStyles: Record<ProductStatus, string> = {
  available: 'bg-savannah-100 text-savannah-700 ring-savannah-200',
  'in-development': 'bg-kente-100 text-kente-800 ring-kente-200',
  planned: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  research: 'bg-terracotta-100 text-terracotta-700 ring-terracotta-200',
}

const statusDot: Record<ProductStatus, string> = {
  available: 'bg-savannah-500',
  'in-development': 'bg-kente-500',
  planned: 'bg-indigo-500',
  research: 'bg-terracotta-500',
}

/**
 * Honest product-status badge. The only allowed states are Available,
 * In development, Planned and Research phase — planned/future capability is
 * never presented as operational.
 */
export const ProductStatusBadge = ({
  status,
  className = '',
}: {
  status: ProductStatus
  className?: string
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]} ${className}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} />
    {productStatusLabels[status]}
  </span>
)

/**
 * Honest metric label, e.g. "Project target" / "Current verified count".
 * Targets are always visually distinguished from achieved figures.
 */
export const MetricLabel = ({
  kind,
  className = '',
}: {
  kind: MetricKind
  className?: string
}) => (
  <span
    className={`text-[0.7rem] font-semibold uppercase tracking-wider ${
      kind === 'current'
        ? 'text-savannah-600'
        : kind === 'in-progress'
          ? 'text-kente-700'
          : 'text-charcoal-muted'
    } ${className}`}
  >
    {metricKindLabels[kind]}
  </span>
)
