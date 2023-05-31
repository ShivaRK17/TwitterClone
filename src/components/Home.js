import React, { useContext } from 'react'
import Tweets from './Tweets'
import News from './News'
import { AppContext } from '../context/AppContext'
import AddTweetModal from './AddTweetModal'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    const { islogin,showAlert,alertmess } = useContext(AppContext)


    return (
        <>
            
            {showAlert?<div className="alert alert-info m-2" role="alert">
                {alertmess}
            </div>:""}
            <div className="row mainrow">
                <AddTweetModal />
                <div className="col-md-8">
                    <article className='py-3'>
                        <div className="container d-flex flex-row-reverse">
                            {islogin ?
                                <button className='btn btn-outline-info' data-bs-toggle="modal" data-bs-target="#exampleModal">Add a Tweet ✉️</button>
                                :
                                <button className='btn btn-outline-info' onClick={() => { navigate('/TwitterClone/login') }}  >Add a Tweet ✉️</button>
                            }
                        </div>
                        <Tweets />
                    </article>
                </div>

                <div className="col-md-4 py-3">
                    <article>
                        <h2>Top News</h2>
                        <hr className='mx-3' />
                        <News />
                    </article>
                </div>
            </div>
        </>
    )
}

export default Home