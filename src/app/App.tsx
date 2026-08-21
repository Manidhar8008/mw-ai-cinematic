import { CinematicScene } from './components/CinematicScene'
import { LandingPage } from './LandingPage'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip cinematic intro</a>
      <CinematicScene />
      <LandingPage />
    </>
  )
}
