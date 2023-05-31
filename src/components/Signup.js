import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const Signup = () => {
    const { setIslogin, setLoginuser, alertMessage, showAlert, alertmess,fetchAllTweets,getAllUsers } = useContext(AppContext)
    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        cpassword: "",
        about: "",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1S0dbT6_X45YWOdDKArI9NqDp3je9-1FUGhITp9jLK0svOyhYYJGL1HLV2wXQd2TcyM&usqp=CAU"
    })
    const [buttext, setButtext] = useState("Submit")
    const navigate = useNavigate()
     function checkImage(url) {
        var image = new Image();
        image.onload = function () {
            if (this.width > 0) {
                console.log("image exists");
            }
        }
        image.onerror = function () {
            console.log("image doesn't exist");
            setUser({ ...user, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1S0dbT6_X45YWOdDKArI9NqDp3je9-1FUGhITp9jLK0svOyhYYJGL1HLV2wXQd2TcyM&usqp=CAU" })
        }
        image.src = url;
    }
    const handleInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setButtext('Creating Account...')
        try {
            const { name, email, username, about, password, cpassword, imageUrl } = user;
            if (password !== cpassword) {
                // alert(`Passwords dont match`)
                setButtext('Submit')
                alertMessage(`Passwords don't match`)
                // setUser({ ...user, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1S0dbT6_X45YWOdDKArI9NqDp3je9-1FUGhITp9jLK0svOyhYYJGL1HLV2wXQd2TcyM&usqp=CAU" })
            }
            else {
                checkImage(imageUrl)
                const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/auth/createUser`, {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ name, email, password, cpassword, username, about, imageUrl })
                })
                const data = await res.json()
                if (res.status === 422) {
                    alertMessage(`Username or Email already exists`)
                    setButtext('Submit')
                }
                // console.log(data);
                // if (res.status === 422 || !data) {
                // window.alert('Invalid Registration')
                // }
                else {
                    localStorage.setItem('authToken', data.authToken)
                    fetchAllTweets()
                    getAllUsers()
                    setLoginuser(data)
                    setIslogin(true)
                    navigate('/TwitterClone')
                    setButtext('Submit')
                    alertMessage(`Profile Created Successfully`)
                }
            }
        } catch (error) {
            alertMessage(`User Cannot be Created`)
            setButtext(`Submit`)
            console.log(error);
        }
    }



    return (
        <>
            {showAlert ? <div className="alert alert-info m-2 sticky-top" role="alert">
                {alertmess}
            </div> : ""}
            <div className="container p-2">
                <div className="alert alert-success d-none" role="alert">
                    A simple success alert—check it out!
                </div>

                <h3 className='text-center'>SIGN UP</h3>
                <div className="container g-5">

                    <form method='POST' onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" required className="form-control" id="name" name='name' aria-describedby="emailHelp" value={user.name} onChange={handleInput} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                            <div className="col-sm-10">
                                <input type="text" required className="form-control" id="username" name='username' aria-describedby="emailHelp" onChange={handleInput} value={user.username} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="exampleInputEmail1" className="col-sm-2 col-form-label">Email address</label>
                            <div className="col-sm-10">

                                <input type="email" required className="form-control" id="exampleInputEmail1" name='email' aria-describedby="emailHelp" onChange={handleInput} value={user.email} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="imageUrl" className="col-sm-2 col-form-label">Profile Pic Link</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="imageUrl" name='imageUrl' onChange={handleInput} value={user.imageUrl} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="exampleInputPassword1" className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">

                                <input type="password" required className="form-control" id="exampleInputPassword1" name='password' onChange={handleInput} value={user.password} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="cpassword" className="col-sm-2 col-form-label">Confirm Password</label>
                            <div className="col-sm-10">
                                <input type="password" required className="form-control" id="cpassword" name='cpassword' onChange={handleInput} value={user.cpassword} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="about" className="col-sm-2 col-form-label">About</label>
                            <div className="col-sm-10">
                                <textarea type="text" required className="form-control" id="about" name='about' aria-describedby="emailHelp" onChange={handleInput} value={user.about} />
                            </div>
                        </div>
                        <div className="container">
                            <img style={{ maxWidth: '50vw' }} src={user.imageUrl} alt="" />
                        </div>
                        <div>
                            <p>Have an account? <Link className='text-info' to="/TwitterClone/login">Login</Link></p>
                        </div>
                        <button type="submit" className="btn btn-primary">{buttext}</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup