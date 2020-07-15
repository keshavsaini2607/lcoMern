import React, {useState} from 'react'
import Base from '../core/Base'
import {isAuthenticated} from '../auth/helper'
import {Link} from 'react-router-dom'
import {createCategory} from './helper/adminapicall'

const AddCategory = () => {

    const [name,setName] = useState("")
    const [error, setError] = useState(false)
    const [success,setSuccess] = useState(false)

    const {user, token} = isAuthenticated()


    const goBack = () => (
            <div className="mt-5">
                <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
            </div>
    )

    const handleChange = event => {
        setError("")
        setName(event.target.value)
    }

    const onSubmit = event => {
        event.preventDefault()
        setError("")
        setSuccess(false)

        //Backend request fired
        createCategory(user._id, token, {name} )
            .then(data => {
                if(data.error){
                    setError(true)
                    console.log(data.error)
                }else{
                    setError("")
                    setSuccess(true)
                    setName("")
                }
            })

    }

    const successMessage = () => {
        if(success){
            return (
                <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-success"
                    style={{display: success? "" : "none"}}
                    >
                       Category created successfully... 
                    </div>
                </div>
            </div>
            )
        }
    }

    const warningMessage = () => {
        return (
            <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
                <div className="alert alert-danger"
                style={{display: error? "" : "none"}}
                >
                Category not created
                </div>
            </div>
        </div>
        )
    }

    const myCategoryForm = () => (
        <form>
            <div className="form-group">
                <p className="lead">Enter the category</p>
                <input type="text"
                className="form-control my-3"
                onChange={handleChange}
                autoFocus
                value={name}
                required
                placeholder="For eg. Summer"
                />

                <button onClick={onSubmit} className="btn btn-outline-info">Create Category</button>
            </div>
        </form>
    )

    return (
        <Base title="Create a new Category" 
        description="Add categories for new tshirts"
        className="container bg-info p-4"
        >
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default AddCategory