import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const AddTweetModal = () => {
    const refClose = useRef(null)
    const [tweet, setTweet] = useState("")
    const [buttext, setButtext] = useState("Post Tweet")
    const { islogin, fetchAllTweets, getAllUsers,alertMessage } = useContext(AppContext)
    const navigate = useNavigate()
    const handleInput = (e) => {
        setTweet(e.target.value)
    }
    const addTweet = async () => {
        if (!islogin) {
            navigate('/TwitterClone/login')
        }
        else {
            if (tweet === "") {
                alert("Tweet cannot be empty")
            }
            else {
                try {
                    setButtext("Posting...")
                    setTweet(tweet.trim())
                    const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/tweet/createTweet`, {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                            "auth-token": localStorage.getItem("authToken")
                        },
                        body: JSON.stringify({ tweet })
                    })
                    const data = await res.json()
                    console.log(data);
                    setButtext("Post Tweet")
                    setTweet("")
                    fetchAllTweets()
                    getAllUsers()
                    refClose.current.click()
                } catch (error) {
                    setButtext("Post Tweet")
                    console.log(error);
                    alertMessage(`Tweet cannot be Posted`)
                    refClose.current.click()
                }
            }
        }
    }


    return (
        <>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add a Tweet</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                <div className="mb-3">
                                    {/* <label htmlFor="tweet" className="form-label">Tweet</label> */}
                                    <textarea required={true} onChange={handleInput} value={tweet} placeholder='Enter Your Opinions...' type="text" className="form-control" id="tweet" aria-describedby="emailHelp" />
                                    <p className='text-end'> - User</p>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={addTweet} className="btn btn-primary">{buttext}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTweetModal