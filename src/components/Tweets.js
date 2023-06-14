import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import Tweet from './Tweet';

const Tweets = () => {
  const {fetchAllTweets,alltweets,loading,getAllComments} = useContext(AppContext)
  useEffect(() => {
    fetchAllTweets()
    getAllComments()
    // eslint-disable-next-line
  }, [])
  
  return (
    <>
    {/* <h1>All tweets</h1> */}
    {loading?<div className='container d-flex justify-content-center'><img width='100px' src={process.env.PUBLIC_URL + '/loading.gif'} alt="Loading" /></div>:alltweets.map((e,ind)=>{
      return <Tweet key={e._id} tweetdata={e}/>
    })}
    </>
  )
}

export default Tweets