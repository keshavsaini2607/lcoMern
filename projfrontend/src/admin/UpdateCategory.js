import React,{useState,useEffect} from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { getACategory, updateCategory } from './helper/adminapicall'
import { isAuthenticated } from '../auth/helper'


const UpdateCategory = ({match}) => {

    const [name,setName] = useState("")
    const [error,setError] = useState(false)
    const [success,setSuccess] = useState(false)

    const {user,token} = isAuthenticated()

    const preload = (categoryId) => {
        getACategory(categoryId).then(data => {
            if(data.error){
                setError(data.error)
            }else{
                setName(data.name)
            }
        })
    }

    useEffect(() => {
        preload(match.params.categoryId)
    }, [])


    const goBack = () => (
        <div>
            <Link className="btn btn-success btn-sm mb-3" to="/admin/dashboard">Admin Home</Link>
        </div>
    )

    const handleChange = event => {
        setError("")
        setName(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault()
        setError("")
        setSuccess(false)

        //Backend request
        updateCategory(match.params.categoryId,user._id,token,{name})
            .then(data => {
                if(data.error){
                    setError(data.error)
                }else{
                    alert("Category updated successfully")
                }
            })
    }

   const UpdateCategoryForm = () => (
    <form>
            <div className="form-group">
                <p className="lead text-info">Enter the new category</p>
                <p>Current name of category:</p>
                <p className="lead text-success">{name}</p>
                <input type="text"
                className="form-control my-3"
                onChange={handleChange}
                autoFocus
                value={name}
                required
                placeholder="Updated Category Name"
                />

                <button onClick={onSubmit} className="btn btn-outline-info">Update Category</button>
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
                    {UpdateCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateCategory