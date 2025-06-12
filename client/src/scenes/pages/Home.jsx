import Homeheader from 'components/homepage/Homeheader'
import React from 'react'
import { FaPlay } from "react-icons/fa";
import "./Home.css"
const Home = () => {
  return (
    <section>
        <section className='main-section'>
            <Homeheader/>
            <section className="hero">
              
                 <div className="hero-left">
                      <div className="sub-tit">
                        <img src="https://www.creativeitinstitute.com/assets/images/home/Check.png" alt="" />
                         <h1>Best Pament Get Way System</h1>
                      </div>
                      <h1>
                        Become an IT Pro & Rule the Digital World
                      </h1>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, ipsum? Molestiae doloribus mollitia sit, cupiditate laudantium, asperiores laboriosam, nihil odit impedit deleniti quas obcaecati molestias neque labore cumque dolorum? Anim.</p>
                      <button>Create Merchant Account</button>
                 </div>
                 <div className="hero-right">
                           <div className="hero-banner">
                              <img src="https://www.creativeitinstitute.com/images/featured/02_default.jpg" alt="" />
                                  <div className="hero-button">
                                         <div>
                                              <FaPlay/>    
                                         </div>
                                  </div>
                          </div>
                 </div>
            </section>
        </section>
    </section>
  )
}

export default Home