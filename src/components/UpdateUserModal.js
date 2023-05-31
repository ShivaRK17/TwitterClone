import React, { useContext, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'

const UpdateUserModal = (props) => {
    const setThisuser = props.func
    const refClose = useRef(null)
    const { setLoginuser, loginuser, alertMessage, showAlert, alertmess, getAllUsers } = useContext(AppContext)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [about, setAbout] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    // const [upduser, setUpduser] = useState({})
    const updateUser = async (e, query) => {
        let proceed = true;
        e.preventDefault()
        if ('name' in query && query.name === "") {
            proceed = false
            alertMessage("Name cannot be empty")
        }
        if ('username' in query && query.username === "") {
            proceed = false
            alertMessage("Username cannot be empty")
        }
        if ('email' in query && query.email === "") {
            proceed = false
            alertMessage("Email cannot be empty")
        }
        if ('about' in query && query.about === "") {
            proceed = false
            alertMessage("About cannot be empty")
        }
        if ('imageUrl' in query) {
            if (query.imageUrl === "") {
                proceed = false
                alertMessage("Profile Link cannot be empty")
            }
            else {
                let image = new Image();
                image.onload = function () {
                    if (this.width > 0) {
                        alertMessage(`Success`)
                    }
                }
                image.onerror = function () {
                    alertMessage(`Image doesnt exist`)
                    setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ1S0dbT6_X45YWOdDKArI9NqDp3je9-1FUGhITp9jLK0svOyhYYJGL1HLV2wXQd2TcyM&usqp=CAU")
                }
                image.src = imageUrl;
            }
        }
        if (proceed) {
            // console.log(query);
            const res = await fetch(`${process.env.REACT_APP_BACKENDURL}/api/auth/updateUser`, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    "auth-token": localStorage.getItem('authToken')
                },
                body: JSON.stringify(query)
            })
            if (res.status !== 200) {
                alertMessage(`Email or username already exists`)
            }
            else {
                const data = await res.json()
                // console.log(data);
                setLoginuser(data)
                setThisuser(data)
                getAllUsers()
                refClose.current.click()
            }
        }
    }
    return (
        <>
            <div className="modal fade" id="upd" tabIndex="-1" aria-labelledby="upd" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="upd">Update User</h1>
                            <button ref={refClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {showAlert ? <div className="alert alert-info m-2" role="alert">
                                {alertmess}
                            </div> : ""}
                            <form method='POST'>
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" value={name} onChange={(e) => { setName(e.target.value) }} />
                                    </div>
                                    <div className='col-sm-3 my-1'>
                                        <button disabled={loginuser.name === name} onClick={(e) => { updateUser(e, { name }) }} className='btn btn-primary btn-sm'>Update</button>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="username" name='username' aria-describedby="emailHelp" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                                    </div>
                                    <div className='col-sm-3 my-1'>
                                        <button disabled={loginuser.username === username} onClick={(e) => { updateUser(e, { username }) }} className='btn btn-primary btn-sm'>Update</button>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="exampleInputEmail1" className="col-sm-2 col-form-label">Email address</label>
                                    <div className="col-sm-7">
                                        <input type="email" className="form-control" id="exampleInputEmail1" name='email' aria-describedby="emailHelp" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                    </div>
                                    <div className='col-sm-3 my-1'>
                                        <button disabled={loginuser.email === email} onClick={(e) => { updateUser(e, { email }) }} className='btn btn-primary btn-sm'>Update</button>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="imageUrl" className="col-sm-2 col-form-label">Profile Pic Link</label>
                                    <div className="col-sm-7">
                                        <input type="text" className="form-control" id="imageUrl" name='imageUrl' value={imageUrl} onChange={(e) => { setImageUrl(e.target.value) }} />
                                    </div>
                                    <div className='col-sm-3 my-1'>
                                        <button disabled={loginuser.imageUrl === imageUrl} onClick={(e) => { updateUser(e, { imageUrl }) }} className='btn btn-primary btn-sm'>Update</button>
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <label htmlFor="about" className="col-sm-2 col-form-label">About</label>
                                    <div className="col-sm-7">
                                        <textarea type="text" className="form-control" id="about" name='about' aria-describedby="emailHelp" value={about} onChange={(e) => { setAbout(e.target.value) }} />
                                    </div>
                                    <div className='col-sm-3 my-1'>
                                        <button disabled={loginuser.about === about} onClick={(e) => { updateUser(e, { about }) }} className='btn btn-primary btn-sm'>Update</button>
                                    </div>
                                </div>
                                <div className="container">
                                    <img style={{ maxWidth: '50vw' }} src={imageUrl} alt="" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateUserModal