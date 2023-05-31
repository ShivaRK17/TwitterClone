import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const Login = () => {
    const navigate = useNavigate()
    const { setIslogin, setLoginuser, alertMessage,alertmess,showAlert } = useContext(AppContext)
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    const [buttext, setButtext] = useState("Submit")
    const handleInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setButtext("Logging In...")
        try {
            const { username, password } = user
            const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ password, username })
            });
            const data = await res.json()
            // console.log(data);
            if (!data || res.status === 400) {
                window.alert("Invalid Creds")
                setButtext('Submit')
            }
            else {
                // window.alert('Success')
                localStorage.setItem('authToken', data.authToken)
                setIslogin(true)
                const res2 = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/auth/getuser`, {
                    "method": "POST",
                    "headers": {
                        "Content-type": "application/json",
                        "auth-token": localStorage.getItem('authToken')
                    }
                })
                const data2 = await res2.json()
                setLoginuser(data2)
                navigate('/')
                alertMessage(`Logged In Successfully as ${data2.username}`)
                setButtext('Submit')
            }
        } catch (err) {
            console.log(err);
            setButtext('Submit')
            alertMessage('Cannot Log in')
        }
    }
    return (
        <>
            {showAlert ? <div className="alert alert-info m-2 sticky-top" role="alert">
                {alertmess}
            </div> : ""}
            <div className="container p-2">

                <h3 className='text-center'>LOGIN</h3>
                <div className="container g-5">

                    <form method='POST' onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                            <div className="col-sm-10">
                                <input type="text" required className="form-control" value={user.username} onChange={handleInput} name='username' id="username" aria-describedby="emailHelp" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="exampleInputPassword1" className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">

                                <input type="password" name='password' value={user.password} onChange={handleInput} required className="form-control" id="exampleInputPassword1" />
                            </div>
                        </div>
                        <div>
                            <p>Haven't Registered Yet? <Link className='text-info' to="/signup">Signup</Link></p>
                        </div>
                        <button type="submit" className="btn btn-primary">{buttext}</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login