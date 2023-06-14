import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Tweet = (props) => {
    const navigate = useNavigate()
    const { loginuser, fetchAllTweets, allUsers, allComments, getAllComments,alertMessage } = useContext(AppContext)
    const [likecount, setLikecount] = useState(props.tweetdata.likeCount)
    const [commentsCount, setCommentsCount] = useState(allComments.filter((e) => { return e.tweet === props.tweetdata._id }))
    const [buttext, setButtext] = useState("Like")
    const [deltext, setDeltext] = useState("Delete Tweet")
    const [comment, setComment] = useState("")
    const [commnum, setCommnum] = useState(props.tweetdata.comments.length)
    const [comsendimg, setComsendimg] = useState('send.png')
    const refClose = useRef(null)

    const handleInput = (e) => {
        setComment(e.target.value)
    }

    const deleteTweet = async (deleteid) => {
        try {
            setDeltext("Deleting...")
            const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/tweet/deleteTweet/${deleteid}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    "auth-token": localStorage.getItem("authToken")
                }
            })
            setDeltext("Delete Tweet")
            refClose.current.click()
            const data = await res.json()
            fetchAllTweets()
            console.log(data);
        }
        catch (err) {
            setDeltext("Delete Tweet")
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
                setButtext('Liking')
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
                setButtext('Liking')
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

    const addComment = async (tweetid) => {
        try {
            setComment(comment.trim())
            if (!localStorage.getItem('authToken')) {
                refClose.current.click()
                navigate('/TwitterClone/login')
            }
            else if (comment === "") {
                setComsendimg('send.png')
                refClose.current.click()
                alertMessage('Comment cannot be empty')
            }
            else {
                setComsendimg('loadcomm.gif')
                const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/comment/createComment/${tweetid}`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                        "auth-token": localStorage.getItem("authToken")
                    },
                    body: JSON.stringify({ comment })
                })
                const data = await res.json();
                getAllComments()
                setCommentsCount(commentsCount.concat(data))
                setComment("")
                setComsendimg('send.png')
                setCommnum(commnum + 1)
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        setLikecount(props.tweetdata.likeCount)
        setCommentsCount(allComments.filter((e) => { return e.tweet === props.tweetdata._id }))
        setCommnum(props.tweetdata.comments.length)
        // setCommentsCount((props.tweetdata.comments) ? props.tweetdata.comments : [])
        setButtext(`Like${likecount.includes(loginuser._id) ? "d" : ""}`)
        // setLiked(likecount.includes(loginuser._id))
        // eslint-disable-next-line
    }, [])


    return (
        <>
            <div className="modal fade" id={`commec${props.tweetdata._id}`} tabIndex="-1" aria-labelledby={`commec${props.tweetdata._id}`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div>
                                <div ref={refClose} data-bs-dismiss="modal"></div>
                                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target={`#home${props.tweetdata._id}`} type="button" role="tab" aria-controls="home" aria-selected="true">{` ${commnum} Comments`}</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target={`#profile${props.tweetdata._id}`} type="button" role="tab" aria-controls="profile" aria-selected="false">{`${likecount.length} Likes`}</button>
                                    </li>
                                </ul>
                            </div>
                            {/* <h1 className="modal-title fs-5" id={`commec${props.tweetdata._id}`}>{commnum} Comments</h1> */}
                        </div>


                        <div className="modal-body">
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id={`home${props.tweetdata._id}`} role="tabpanel" aria-labelledby="home-tab">
                                    {/* <div className="modal-header d-flex px-0">
                                    </div> */}
                                    <div className="chat-container">{localStorage.getItem('authToken')?
                                        <div className='d-flex my-2'>
                                            <textarea required={true} onChange={handleInput} value={comment} placeholder='Add Comment' type="text" className="form-control" id="tweet" />
                                            <button onClick={() => { addComment(props.tweetdata._id) }} type="button" className="mx-2 likebtn"><img style={{ width: '20px', }} src={process.env.PUBLIC_URL + `/${comsendimg}`} alt="" /></button>
                                        </div>:<Link data-bs-dismiss="modal" onClick={()=>navigate("/TwitterClone/login")}>Sign in to Comment</Link>}
                                        <hr />
                                        {allComments.filter((e) => {
                                            return e.tweet === props.tweetdata._id
                                        }).map((e, ind) => {
                                            return <div key={ind} className={`chat-message ${e.author === loginuser._id ? "ongoing" : "incoming"}`}>
                                                <img role='button' data-bs-dismiss="modal" onClick={() => navigate(`/TwitterClone/profile/${e.author}`)} src={e.authorImage} alt="User" className="chat-image " />
                                                <div className={`chat-bubble ${e.author === loginuser._id ? "ongoing" : "incoming"}`}>
                                                    <h6 className='link' data-bs-dismiss="modal" onClick={() => navigate(`/TwitterClone/profile/${e.author}`)} style={{ fontSize: '0.9rem', margin: '0' }}><Link style={{ textDecoration: 'none' }}>@{e.authorName}</Link></h6>
                                                    <div style={{ whiteSpace: "pre-line" }} className='my-1'>{e.comment}</div>
                                                    <div className="chat-time" style={{ fontSize: '0.7rem' }}>{new Date(e.date).toDateString().substring(4)} {new Date(e.date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div className="tab-pane fade" id={`profile${props.tweetdata._id}`} role="tabpanel" aria-labelledby="profile-tab">
                                    {allUsers.filter((e) => {
                                        return likecount.includes(e._id)
                                    }).map((e, ind) => {
                                        return <div key={ind} role='button' className='text-white' data-bs-dismiss="modal" style={{ textDecoration: 'none' }} onClick={() => { navigate(`/TwitterClone/profile/${e._id}`) }}>
                                            <div className='likescount container rounded my-1 p-3 d-flex justify-content-between align-items-center'>
                                                <img src={e.imageUrl} alt="ProfPic" />
                                                <p className='m-0'>{e.name.toUpperCase()}</p>
                                            </div></div>
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
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
                                return <div key={ind} role='button' className='text-white' data-bs-dismiss="modal" style={{ textDecoration: 'none' }} onClick={() => { navigate(`/TwitterClone/profile/${e._id}`) }}>
                                    <div className='likescount container rounded my-1 p-3 d-flex justify-content-between align-items-center'>
                                        <img src={e.imageUrl} alt="ProfPic" />
                                        <p className='m-0'>{e.name.toUpperCase()}</p>
                                    </div></div>
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
                            <form className='my-2' action="">
                                Are you sure you want to delete your tweet?
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={() => { deleteTweet(props.tweetdata._id) }} className="btn btn-danger">{deltext}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tweet */}
            <div className="tweetbody rounded p-3 mx-1 my-3">
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
                            <p className='m-0 d-flex align-items-center' style={{ fontSize: '0.8rem' }}><Link to={`/TwitterClone/profile/${props.tweetdata.author}`}>@{e.username}</Link>{e.username === "ShivaRK" ? <img className='verified m-1' src={process.env.PUBLIC_URL + '/verified.png'} alt="" /> : ""}</p>
                        </div>
                    })
                    }
                </div>
                <div className="maintweet">
                    <p className='p-3 m-0' style={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>{props.tweetdata.tweet.trim()}</p>
                    <div className="d-flex px-3">
                        {/* <button className='btn btn-danger btn-sm'>Comments</button> */}
                        <p className='m-0 p-0 ' style={{ fontSize: '0.7rem' }}>{new Date(props.tweetdata.date).toDateString().substring(4)}</p> &nbsp;
                        <p className='m-0 p-0 ' style={{ fontSize: '0.7rem' }}>{new Date(props.tweetdata.date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                    </div>
                </div>
                <hr />
                <div className="inttweet">
                    <div className="likes btn-group" role="group">
                        <button className='likebtn' onClick={() => { handleLike(props.tweetdata._id) }}>
                            <img style={{ width: '25px', height: '25px' }} src={process.env.PUBLIC_URL + `/${buttext === "Liking" ? "Liking" : likecount.includes(loginuser._id) ? "Liked" : "Like"}.png`} alt="" />
                            <p className='m-0 p-0' style={{ fontSize: '0.7rem' }}>{likecount.length} {likecount.length === 1 ? "Like" : "Likes"}</p>
                        </button>
                        {/* <button className={`btn btn-${likecount.includes(loginuser._id) ? "danger" : "primary"} btn-sm d-flex flex-column align-items-center`} onClick={() => { handleLike(props.tweetdata._id) }}>
                            <p className='m-0 p-0' style={{fontSize:'0.8rem'}}>{buttext} ♡</p>
                            <p className='m-0 p-0' style={{fontSize:'0.5rem'}}>{likecount.length} {likecount.length === 1 ? "Like" : "Likes"}</p>
                        </button> */}

                        {/* <button data-bs-toggle="modal" data-bs-target={`#likec${props.tweetdata._id}`} className={`btn btn-primary btn-sm`}>
                            <b>{likecount.length}</b> {likecount.length === 1 ? "Like" : "Likes"}
                        </button> */}

                        {/* <button className={`btn btn-${props.tweetdata.likeCount.includes(currUser._id) ? "danger" : "primary"} btn-sm m-1`} onClick={() => { if (props.tweetdata.likeCount.includes(currUser._id)) { unlikeKottu(props.tweetdata._id) } else { likeKottu(props.tweetdata._id) } }}>Like{props.tweetdata.likeCount.includes(currUser._id) ? "d" : ""} ♡</button> */}
                        {props.tweetdata.author === loginuser._id ?
                            <button data-bs-toggle="modal" data-bs-target={`#hola${props.tweetdata._id}`} className='likebtn'>
                                <img style={{ width: '25px', height: '25px' }} src={process.env.PUBLIC_URL + `/delete.png`} alt="" />
                                <p className='m-0 p-0' style={{ fontSize: '0.7rem' }}>Delete</p>
                            </button> : ""
                        }
                        {/* <span className='px-3'>{props.tweetdata.likeCount.length} {props.tweetdata.likeCount.length === 1 ? "Like" : "Likes"}</span> */}
                    </div>
                    <div className="d-flex align-items-center btn-group" role="group">
                        <button onClick={()=>{alertMessage("ReTweet Feature Coming Soon...")}} className="likebtn">
                            <img style={{ width: '25px', height: '25px' }} src={process.env.PUBLIC_URL + `/retweet.png`} alt="" />
                            <p className='m-0 p-0' style={{ fontSize: '0.7rem' }}>Retweet</p>
                        </button>
                        <button className="likebtn" data-bs-toggle="modal" data-bs-target={`#commec${props.tweetdata._id}`}>
                            <img style={{ width: '25px', height: '25px' }} src={process.env.PUBLIC_URL + `/comments.png`} alt="" />
                            <p className='m-0 p-0' style={{ fontSize: '0.7rem' }}>{commnum} Comments</p>
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Tweet