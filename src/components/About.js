import React from 'react'

const About = () => {
  return (
    <div className='d-flex justify-content-center'>
      <div className="about-container m-2 w-100 p-4">
        <h1 className="about-title text-center">About Us</h1>
        <p className="about-description">
         I am Shiva Rama Krishna. Welcome to my website! Our platform is a Twitter clone built using the MERN stack (MongoDB, Express.js, React, Node.js). Here, you can experience the essence of social media by sharing your thoughts, Show your appreciation for interesting and engaging content by liking tweets from other users, and Discover what's happening around the world.
        </p>
        <div className="about-description">
          Tech Stacks used
          <ul>
            <li>React Js</li>
            <li>Node Js</li>
            <li>Express Js</li>
            <li>MongoDB</li>
            <li>JWT</li>
            <li>Bcrypt js</li>
            <li>Bootstrap</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About