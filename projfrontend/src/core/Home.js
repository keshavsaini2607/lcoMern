import React, {useState, useEffect} from 'react'
import '../styles.css'
import {API} from '../backend'
import Base from './Base'
import ProductCard from './ProductCard'
import { getProducts } from './helper/coreapicalls'

export default function Home(){

    const [products,setProducts] = useState([])
    const [error,setError] = useState(false)

    const loadAllProducts = () => {
        getProducts()
            .then(data => {
                if(data.error){
                    setError(data.error)
                }else{
                    setProducts(data)
                }
            })
    }

    useEffect(() => {
        loadAllProducts()
    }, [])
    
    return(
        <Base title="Home Page" description="Welcome to the T-shirt store">
            <div className="row text-center">
                <h1 className="text-white">All the tshirts</h1>
                <div className="row">
                    {products.map((product,index) => {
                        return (
                            <div key={index} className="col-4 row-4">
                                <ProductCard product={product}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Base>
    )
  
}