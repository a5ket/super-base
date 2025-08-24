import { BrowserRouter, Route, Routes } from 'react-router'
import MainLayout from './components/layout/MainLayout'
import CreateSuperheroPage from './pages/CreateSuperheroPage'
import EditSuperheroPage from './pages/EditSuperheroPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import SuperheroDetailPage from './pages/SuperheroDetailPage'
import SuperheroesPage from './pages/SuperheroesPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/superheroes" element={<SuperheroesPage />} />
          <Route path="/superheroes/create" element={<CreateSuperheroPage />} />
          <Route path="/superheroes/:superheroId" element={<SuperheroDetailPage />} />
          <Route path="/superheroes/:superheroId/edit" element={<EditSuperheroPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
