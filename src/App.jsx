import Home from './_root/pages/Home'
import AuthLayout from './auth/AuthLayout'
import './index.css'
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from './auth/Signup'
import Signin from './auth/Signin'
import RootLayout from './_root/RootLayout'
import Quiz from './_root/pages/Quiz'
import CreateQuiz from './components/forms/CreateQuiz'
import UserDashboard from './_root/pages/UserDashboard'
import CreateSet from './_root/pages/CreateSet'
import Flashcard from './_root/pages/Flashcard'

function App() {
  return (
    <>
      <main className='flex h-screen'>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path='/sign-up' element={<Signup />}/>
            <Route path='/sign-in' element={<Signin />}/>
          </Route>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path='/sets/quiz/:id' element={<Quiz />} />
            <Route path='/sets/flashcard/:id' element={<Flashcard />} />
            <Route path='/create-set' element={<CreateSet />} />
            <Route path='/users/:id' element={<UserDashboard />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App
