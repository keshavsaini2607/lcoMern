import React,{ useState, useEffect } from 'react'
import { loadCart, cartEmpty } from './helper/cartHelper'
import { Link } from 'react-router-dom'
import { getmeToken, processPayment } from './helper/paymentHelper'
import {createOrder} from './helper/orderHelper'
import { isAuthenticated } from '../auth/helper'

import DropIn from "braintree-web-drop-in-react"

const Paymentb = (products,setReload = f => f , reload = undefined) => {

    const [info,setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    })


    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId,token) => {
        getmeToken(userId,token).then(info => {
            console.log("INFORMAtiON",info)
            if(info.error){
                setInfo({...info, error: info.error})
            }else{
                const clientToken = info.clientToken
                setInfo({clientToken})
            }
        })
    }

    const showBtDropIn = () => {
        return(
            <div>
                {info.clientToken != null ? (
                    <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={(instance) => (info.instance = instance)}
                        />
                        <button className="btn btn-success btn-block" onClick={onPurchase}>Buy</button>
                    </div>
                ) : (<h3>Please login to continue or add something to cart</h3>)}
            </div>
        )
    }

    useEffect(() => {
        getToken(userId,token)
    }, [])

    const onPurchase = () => {
        setInfo({loading: true})
        let nonce
        let getNonce = info.instance
            .requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getAmount()
                }
                processPayment(userId,token,paymentData)
                    .then(response => {
                        console.log("Payment Successfull")
                        setInfo({...info, success: response.success,loading: false})
                        
                        cartEmpty(() => {
                            console.log('Order is completed')
                        })
                        //TODO : forced reload
                    })
                    .catch(error => {
                        console.log("Payment Failed")

                        setInfo({loading: false, success: false})
                    })
            })
            
    }


    
    const getAmount = () => {
        let amount = 0
        products.map(p => {
            amount = amount + p.price
        })
        return amount
    }

    return (
        <div>
            <h3>Your cart total is  Rs</h3>
            {showBtDropIn()}
        </div>
    )
}

export default Paymentb
