import React, {useState, useEffect} from 'react'
import '../styles.css'
import {API} from '../backend'
import Base from './Base'
import ProductCard from './ProductCard'
import { loadCart } from './helper/cartHelper'
import Paymentb from './Paymentb'

const Cart = () =>{

    const [products,setProducts] = useState([])
    const [reload, setReload] = useState(false)

    //if anything in the cart page gets updated then only the [reload] is used
    useEffect (() => {
        setProducts(loadCart())
    }, [reload])
    
    const loadAllProducts = products => {
        return (
            <div>
                <h2>This section is to load products</h2>
                {products.map((product,index) => (
                    <ProductCard
                    key={index}
                    product = {product}
                    removeFromCart = {true}
                    addToCart = {false}
                    setReload={setReload}
                    reload={reload}
                    />
                ))}
            </div>
        )
    }
   
    const loadAllCheckout = () => {
        return (
            <div>
                <h2>Let's use braintree for the payments</h2>
            </div>
        )
    }

    return(
        <Base title="Cart Page" description="Ready to checkout">
            <div className="row text-center">
                <div className="col-6">
                    {products.length > 0 ?loadAllProducts(products) : (<h3>There are no products in the cart</h3>)}
                </div>

                <div className="col-6">
                   <Paymentb products={products} setReload= {setReload} />
                </div>
            </div>
        </Base>
    )
  
}

export default Cart