import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import ProfileTweets from './ProfileTweets';
import UpdateUserModal from './UpdateUserModal';


const Profile = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { alltweets, loginuser } = useContext(AppContext)
  const [thisuser, setThisuser] = useState({})
  const [thistweets, setThistweets] = useState([])
  const [profLoad, setProfLoad] = useState(true)
  const [tweetLoad, setTweetLoad] = useState(true)

  useEffect(() => {
    // console.log(alltweets);
    const slug = location.pathname.split('/').pop();

    if (localStorage.getItem('authToken')) {

      const settcurrUser = async () => {
        try { 

          const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/auth/getuser/${slug}`)
          const data = await res.json()
          setProfLoad(false)
          setThisuser(data)
        const res2 = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/tweet/getTweet/${data._id}`, {
          method: "GET",
          "Content-type": "application/json"
        })
        const data2 = await res2.json()
        setTweetLoad(false)
        setThistweets(data2)
      }catch(err){
        console.log(err);
      }
      }
      settcurrUser()
    }
    else {
      navigate('/TwitterClone/login')
    }
    // eslint-disable-next-line
  }, [location.pathname, alltweets])


  return (
    <>
      <UpdateUserModal func={setThisuser} />
      <>{profLoad ? <div className='container d-flex justify-content-center'><img src={process.env.PUBLIC_URL + '/loading.svg'} alt="" /></div> :
        <div className="rounded m-3 p-3 profile">
          <div className="row g-5">
            <div className="profimg col-md-3">
              <img src={thisuser.imageUrl} alt="" />
            </div>
            <div className="about col-md-6">
              <h1>{thisuser.name}</h1>
              <hr />
              <h5 className='d-flex align-items-center'>@{thisuser.username} {thisuser.username==="ShivaRK"?<img className='m-1' height='15px' src={process.env.PUBLIC_URL+'/verified.png'} alt="" />:""}</h5>
              <p> {thisuser.about}</p>
            </div>
            {loginuser._id === thisuser._id ?
              <div className='col-md-2 '>
                <button data-bs-toggle="modal" data-bs-target="#upd" className='btn btn-primary btn-sm'>Update User</button>
              </div>
              : ""}
          </div>
        </div>}
        <div className="p-2 m-1 rounded">
          <h2>Profile's Tweets: </h2>
          {/* {thistweets.map((e, ind) => {
          return <Tweet key={ind} tweetdata={e} />
        })} */}
          {tweetLoad ? <div className='container d-flex justify-content-center'><img width='150px' src={process.env.PUBLIC_URL + '/loading.svg'} alt="" /></div> : <ProfileTweets tweets={thistweets} />}
        </div>
      </>
    </>
  )
}

export default Profile