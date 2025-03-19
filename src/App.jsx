"use client"

import { useState } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email) {
      setError("Please provide both name and email")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/.netlify/functions/submit-waitlist", {
        method: "POST",
        body: JSON.stringify({ name, email }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setEmail("")
        setName("")
      } else {
        setError(data.message || "Something went wrong")
      }
    } catch (err) {
      setError("Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      <Header />
      <main>
        <Hero
          email={email}
          setEmail={setEmail}
          name={name}
          setName={setName}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          message={message}
          error={error}
        />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

export default App

