"use client"

import "./Hero.css"

const Hero = ({ email, setEmail, name, setName, handleSubmit, isSubmitting, message, error }) => {
  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">
          World's first <span className="green">Green</span> AI
        </h1>

        <form className="waitlist-form" onSubmit={handleSubmit}>
          <div className="form-inputs">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
            <input
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="waitlist-button" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join the waitlist"}
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </section>
  )
}

export default Hero

