import { Seo } from '../lib/seo'
import { Button } from '../components/ui/Button'
import { CulturalPatternLayer } from '../components/visuals/CulturalPatternLayer'

export const NotFoundPage = () => (
  <>
    <Seo title="Page not found" description="The page you were looking for could not be found." noindex />
    <section className="pk relative flex min-h-[70vh] items-center overflow-hidden bg-indigo-950 text-cream-100">
      <CulturalPatternLayer variant="sirigu" color="text-cream-100" opacity={0.06} />
      <div className="container relative text-center">
        <p className="font-display text-fluid-5xl font-bold text-kente-400">404</p>
        <h1 className="mt-2 font-display text-fluid-2xl font-bold">
          This path has gone quiet.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-cream-200/80">
          The page you were looking for could not be found. Let’s get you back to
          the language.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/" variant="gold" size="lg">
            Back to home
          </Button>
          <Button
            to="/dictionary"
            variant="outline"
            size="lg"
            className="border-white/25 bg-white/5 text-cream-100 hover:bg-white/10"
          >
            Explore the dictionary
          </Button>
        </div>
      </div>
    </section>
  </>
)
