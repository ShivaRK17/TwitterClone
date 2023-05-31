import React from 'react'
// import { AppContext } from '../context/AppContext'
import Tweet from './Tweet'



const ProfileTweets = (props) => {

    return (
        <>
            {props.tweets.map((e,ind) => {
                return <Tweet key={ind} tweetdata={e} />
            })}

        </>
    )
}

export default ProfileTweets