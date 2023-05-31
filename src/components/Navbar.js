import React, { useContext, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'


const Navbar = () => {
    const navigate = useNavigate()
    const { islogin, setIslogin, setLoginuser, loginuser, getAllUsers, alertMessage } = useContext(AppContext)


    const logout = () => {
        if (islogin) {
            localStorage.removeItem('authToken')
            setIslogin(false)
            setLoginuser({})
            alertMessage("Logged Out Successfully")
            navigate('/')
        }
    }


    useEffect(() => {
        getAllUsers()
        const getLogUser = async () => {
            try {

                const res2 = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/auth/getuser`, {
                    "method": "POST",
                    "headers": {
                        "Content-type": "application/json",
                        "auth-token": localStorage.getItem('authToken')
                    }
                })
                const data2 = await res2.json()
                setLoginuser(data2)
            }
            catch(err){
                console.log(err);
            }
        }
        if (localStorage.getItem('authToken')) {
            setIslogin(true)
            // console.log(loginuser);
            getLogUser()
        }
        else {
            setIslogin(false)
        }
        //eslint-disable-next-line
    }, [])

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">🐦 Twitter</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/about">About</NavLink>
                            </li>
                            {islogin ? <>
                                <li className="nav-item">
                                    <NavLink className="btn btn-sm btn-primary" aria-current="page" to={`/profile/${loginuser._id}`}>My Profile</NavLink>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-sm btn-danger m-1" aria-current="page" onClick={logout}>Logout</button>
                                </li>
                            </> : <>
                                <li className="nav-item">
                                    <NavLink className="btn btn-sm btn-primary m-1" aria-current="page" to="/signup">Signup</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="btn btn-sm btn-primary m-1" aria-current="page" to="/login">Login</NavLink>
                                </li>
                            </>}
                            {/* <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">Home</a>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar