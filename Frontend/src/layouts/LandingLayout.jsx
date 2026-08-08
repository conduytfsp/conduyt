import React, { Component } from 'react'
import Navbar from '../components/Navbar.jsx'
import Button from "../components/ui/Button"
import { NavLink } from 'react-router'
import Footer from '../components/layout/Footer'

function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <section className="w-full py-20">
          <div className="bg-gray-200 w-40 max-w-7xl mx-auto rounded-full text-center">
            AI Powered
          </div>
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1
              className="
                text-4xl
                md:text-5xl
                lg:text-6xl
                font-extrabold
                leading-tight
                tracking-tight
              "
            >
              Find the Perfect
              <br />
              <span
                className="
                  bg-gradient-to-r
                  from-freelancer-primary
                  to-freelancer-secondary
                  bg-clip-text
                  text-transparent
                "
              >
                Freelancer
              </span>{" "}
              or{" "}
              <span
                className="
                  bg-gradient-to-r
                  from-client-primary
                  to-client-secondary
                  bg-clip-text
                  text-transparent
                "
              >
                Client
              </span>{" "}
              with AI
            </h1>

            <p className="mt-8 text-lg text-gray-600 max-w-3xl mx-auto">
              Stop sifting through endless profiles. Our intelligent algorithms
              analyze skills, work styles, and project needs to predict highly
              successful collaborations.
            </p>
            
            <div className="flex gap-3 justify-center m-6">
              <Button as={NavLink} to="/Register">
                I'm Looking for Work
              </Button>
              <Button as={NavLink} to="/Register" variant="client">
                I need to hire
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER INCLUDED HERE */}
      <Footer />
    </div>
  );
}

export default LandingLayout;