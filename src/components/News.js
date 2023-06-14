import React, { useState ,useEffect} from 'react'
import New from './New'



const News = () => {
  const [isLoading, setIsLoading] = useState(true)
    const [news, setNews] = useState([])
    
    const getNews = ()=>{
        // fetch("https://inshorts.deta.dev/news?category=all")
        // fetch("https://inshorts-news.vercel.app/all")
        fetch("https://inshortsapi.vercel.app/news?category=all")
        .then((res)=>{
            return res.json();
        }).then((res)=>{
          setIsLoading(false)
            setNews(res.data)
        })
        .catch((err)=>{
          console.log(err);
        })
    }
    
    useEffect(() => {
      getNews()
    }, [])
    return (
    <>
    {isLoading ?<div className='container d-flex justify-content-center'><img width='150px' src={process.env.PUBLIC_URL + '/loading.svg'} alt="" /></div>: news.map((e,ind)=>{
        return <New key={ind} title={e.title} content={e.content} imgurl={e.imageUrl} url={e.readMoreUrl}/>
    })}
    </>
  )
}

export default News