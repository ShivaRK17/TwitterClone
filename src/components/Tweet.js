import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Tweet = (props) => {
    const navigate = useNavigate()
    const { loginuser, fetchAllTweets, allUsers } = useContext(AppContext)
    const [likecount, setLikecount] = useState(props.tweetdata.likeCount)
    const [buttext, setButtext] = useState("Like")
    const refClose = useRef(null)
    const deleteTweet = async (deleteid) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/tweet/deleteTweet/${deleteid}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    "auth-token": localStorage.getItem("authToken")
                }
            })
            refClose.current.click()
            const data = await res.json()
            fetchAllTweets()
            console.log(data);
        }
        catch (err) {
            console.log(err);
        }
    }
    const handleLike = async (id) => {
        if (!localStorage.getItem('authToken')) {
            navigate('/TwitterClone/login')
        }
        else {
            if (likecount.includes(loginuser._id)) {
                //Dislike Here
                setButtext('Disliking..')
                const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/tweet/unlikeTweet/${id}`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                        "auth-token": localStorage.getItem("authToken")
                    }
                })
                const data = await res.json()
                console.log(data);
                const temp = likecount.filter((e) => e !== loginuser._id)
                setLikecount(temp)
                setButtext('Like')
                // setLiked(likecount.includes(loginuser._id))
                fetchAllTweets()
            }
            else {
                //Like here
                setButtext('Liking..')
                const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/tweet/likeTweet/${id}`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                        "auth-token": localStorage.getItem("authToken")
                    }
                })
                const data = await res.json()
                console.log(data);
                setLikecount([...likecount, loginuser._id])
                setButtext('Liked')
                // setLiked(likecount.includes(loginuser._id))
                fetchAllTweets()
            }
        }
    }

    useEffect(() => {
        setLikecount(props.tweetdata.likeCount)
        setButtext(`Like${likecount.includes(loginuser._id) ? "d" : ""}`)
        // setLiked(likecount.includes(loginuser._id))
        // eslint-disable-next-line
    }, [])


    return (
        <>
            <div className="modal fade" id={`likec${props.tweetdata._id}`} tabIndex="-1" aria-labelledby={`likec${props.tweetdata._id}`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={`likec${props.tweetdata._id}`}>{likecount.length} Likes</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {allUsers.filter((e) => {
                                return likecount.includes(e._id)
                            }).map((e, ind) => {
                                return <Link key={ind} className='text-white' style={{textDecoration:'none'}} target='_blank' onClick={() => { refClose.current.click() }} to={`/TwitterClone/profile/${e._id}`}>
                                    <div key={ind} className='likescount container rounded my-1 p-3 d-flex justify-content-between align-items-center'>
                                        <img src={e.imageUrl} alt="ProfPic" />
                                        <p className='m-0'>{e.name.toUpperCase()}</p>
                                    </div></Link>
                            })}
                            {/* {likecount.map((e,ind) => {
                                return <h1 key={ind}>{
                                    <Link onClick={()=>{refClose.current.click()}} to={`/profile/${e}`}>{}</Link>
                                }</h1>
                            })} */}
                        </div>
                    </div>
                </div>
            </div>

            {/*Delete Tweet */}
            <div className="modal fade" id={`hola${props.tweetdata._id}`} tabIndex="-1" aria-labelledby={`hola${props.tweetdata._id}`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={`hola${props.tweetdata._id}`}>Delete Tweet</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="">
                                Are you sure you want to delete your tweet?
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={() => { deleteTweet(props.tweetdata._id) }} className="btn btn-danger">Delete Tweet</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tweet */}
            <div className="tweetbody rounded p-3 m-3">
                <div className="headtweet">
                    <Link to={`/TwitterClone/profile/${props.tweetdata.author}`}>
                        <img className='profpic' src={allUsers.filter((e) => {
                            return e._id === props.tweetdata.author
                        }).map((e) => {
                            if (e.imageUrl) {
                                return e.imageUrl
                            }
                            else {
                                return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1S0dbT6_X45YWOdDKArI9NqDp3je9-1FUGhITp9jLK0svOyhYYJGL1HLV2wXQd2TcyM&usqp=CAU"
                            }
                        })} alt="" />
                    </Link>
                    {/* <img src={allUsers.filter((e)=>e._id===props.tweetdata.author)[0].imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1S0dbT6_X45YWOdDKArI9NqDp3je9-1FUGhITp9jLK0svOyhYYJGL1HLV2wXQd2TcyM&usqp=CAU"} alt="Pic" /> */}
                    {allUsers.filter((e) => {
                        return props.tweetdata.author === e._id
                    }).map((e, ind) => {
                        return <div key={ind} className='d-flex flex-column mx-3'>
                            <p className='lead m-0'>{e.name}</p>
                            <p className='m-0 d-flex align-items-center' style={{ fontSize: '0.8rem' }}><Link to={`/TwitterClone/profile/${props.tweetdata.author}`}>@{e.username}</Link>{e.username==="ShivaRK"?<img className='verified m-1' src={process.env.PUBLIC_URL+'/verified.png'} alt="" />:""}</p>
                        </div>
                    })
                    }
                </div>
                <div className="maintweet">
                    <p className='p-3'>{props.tweetdata.tweet}</p>
                </div>
                <hr />
                <div className="inttweet">
                    <div className="likes btn-group" role="group">
                        <button className={`btn btn-${likecount.includes(loginuser._id) ? "danger" : "primary"} btn-sm`} onClick={() => { handleLike(props.tweetdata._id) }}>
                            {/* Like{likecount.includes(loginuser._id) ? "d" : ""} ♡ */}
                            {buttext} ♡
                        </button>
                        <button data-bs-toggle="modal" data-bs-target={`#likec${props.tweetdata._id}`} className={`btn btn-primary btn-sm`}>
                            <b>{likecount.length}</b> {likecount.length === 1 ? "Like" : "Likes"}
                        </button>

                        {/* <button className={`btn btn-${props.tweetdata.likeCount.includes(currUser._id) ? "danger" : "primary"} btn-sm m-1`} onClick={() => { if (props.tweetdata.likeCount.includes(currUser._id)) { unlikeKottu(props.tweetdata._id) } else { likeKottu(props.tweetdata._id) } }}>Like{props.tweetdata.likeCount.includes(currUser._id) ? "d" : ""} ♡</button> */}
                        {props.tweetdata.author === loginuser._id ?
                            <button data-bs-toggle="modal" data-bs-target={`#hola${props.tweetdata._id}`} className='btn btn-danger btn-sm'>Delete</button> : ""
                        }
                        {/* <span className='px-3'>{props.tweetdata.likeCount.length} {props.tweetdata.likeCount.length === 1 ? "Like" : "Likes"}</span> */}
                    </div>
                    <div className="datetweet d-flex align-items-center">
                        <p style={{fontSize:'0.7rem'}}>Posted on <b>{props.tweetdata.date.substr(0, 10)}</b></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tweet