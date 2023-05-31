import React from 'react'

const New = (props) => {
  return (
    <>
    <div className="newsbody rounded p-3 m-3">
        <img src={props.imgurl} alt="" />
        <h6>{props.title}</h6>
        <p>{props.content.substr(0,200)}...</p>
        <a className='btn btn-primary btn-sm' href={props.url}>Read More</a>
    </div>
    </>
  )
}

// https://newsdata.io/api/1/news?apikey=pub_2288992703247d77864fb211cc7645cbadd02&country=in&language=en

export default New