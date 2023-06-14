import { createContext, useState } from "react";

const AppContext = createContext()

const AppProvider = ({ children }) => {
    const [islogin, setIslogin] = useState(false)
    const [loginuser, setLoginuser] = useState({})
    const [alltweets, setAlltweets] = useState([])
    const [allComments, setallComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [usertweets, setUsertweets] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    const [alertmess, setAlertmess] = useState("")

    const alertMessage = (mess) => {
        setShowAlert(true)
        setAlertmess(mess)
        setTimeout(() => {
            setShowAlert(false)
        }, 3000);
    }
    const fetchAllTweets = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/tweet/getTweets`)
            const data = await res.json()
            setLoading(false)
            setAlltweets(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    const fetchUserTweets = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/tweet/getTweet/${id}`)
            const data = await res.json()
            setUsertweets(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    const getAllUsers = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/auth/getusers`)
            const data = await res.json()
            setAllUsers(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    const getAllComments = async()=>{
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/comment/getComments`)
            const data = await res.json()
            // console.log(data);
            setallComments(data)
        } catch (err) {
            console.log(err);
        }
    }
    return <AppContext.Provider value={{ islogin, setIslogin, loginuser, setLoginuser, fetchAllTweets, alltweets, usertweets, fetchUserTweets, getAllUsers, allUsers, loading, showAlert, alertMessage, alertmess,allComments,getAllComments }}>
        {children}
    </AppContext.Provider>
}
export { AppContext, AppProvider }