import React from 'react'
import './cart.css'
import { collection, query, where, getDocs, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, setDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';



function Cart() {
  const [quantityChanged, setQuantityChanged] = useState(false)
  const [currentUser, setCurrentUser] = useState(null);
  const [Cartdata, setCartdata] = useState(null)
  const [summaryPrice, setsummaryPrice] = useState(0)
  const [checkprice, setCheckprice] = useState(false)
  const [productData, setProductData] = useState([])
  const [productId, setProductId] = useState([])
  const [quantity, setQuantity] = useState(1)
  const firebaseConfig = {
    apiKey: "AIzaSyARxzjctp9xGO4GlHD_CBdrf116YI5Ci6c",
    authDomain: "frontend-project-user-database.firebaseapp.com",
    projectId: "frontend-project-user-database",
    storageBucket: "frontend-project-user-database.appspot.com",
    messagingSenderId: "879037419636",
    appId: "1:879037419636:web:c51dc57220852d7d504121",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  console.log(currentUser)
  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return;

      const q = query(collection(db, "UserCart"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        // Usercartdata.push({
        //   id: doc.id,
        //   data: doc.data(),
        //   selected: false
        // })
        setCartdata({ id: doc.id, data: doc.data() })
      });
    };
    fetchCart();
  }, [currentUser, db]);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productFetch = await Promise.all(
          Cartdata.data.productsId.map(async (dataId) => {
            const productRef = doc(db, 'Product', `${dataId}`);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              return { ...productSnap.data(), id: productSnap.id, quantity: 1 }
            }
            return null;
          })
        );
        const filteredProductFetch = productFetch.filter(product => product !== null);
        setProductData(filteredProductFetch);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProductData();
  }, [Cartdata, db]);

  useEffect(() => {
    console.log(Cartdata)
    console.log(productData)
  }, [productData])
  const handleTest = () => {
    console.log(productData)
    console.log(Cartdata.id)
    console.log(Cartdata)
  }

  useEffect(() => {
    if (quantityChanged) {
      window.location.reload();
      setQuantityChanged(false);
    }
  }, [quantityChanged]);

  const calculatePrice = (checked, name, quantity, id) => {
    setCheckprice(checked);
    const product = productData.find(item => item.name === name);
    if (!product) return;
    const price = parseFloat(product.price);
    if (checked) {
      const totalPrice = price * quantity;
      setsummaryPrice(price => price + totalPrice);
      const UserOrder = async () => {
        try {
          const querySnapshot = await getDocs(query(collection(db, "OrderId"), where("userId", "==", currentUser.uid)));
          if (!querySnapshot.empty) {
            const OrderRef = querySnapshot.docs[0];
            const orderData = OrderRef.data().order || [];
            const updatedOrder = [...orderData, { productsId: id, quantity: quantity }];
            await updateDoc(OrderRef.ref, { order: updatedOrder });
          } else {
            await addDoc(collection(db, "OrderId"), {
              userId: currentUser.uid,
              order: [{ productsId: id, quantity: quantity ,}]
            });
          }
        } catch (err) {
          console.error("Error adding order:", err);
        }
      };
      UserOrder();
    } else {
      const deleteOrder = async () => {
        try {
          const querySnapshot = await getDocs(query(collection(db, "OrderId"), where("userId", "==", currentUser.uid)));
          querySnapshot.forEach(async (doc) => {
            const orderData = doc.data().order || [];
            const updatedOrder = orderData.filter(item => item.productsId !== id);
            await updateDoc(doc.ref, { order: updatedOrder });
          });
        } catch (err) {
          console.error("Error delete order:", err);
        }
      };

      deleteOrder();
      const totalPrice = price * quantity;
      setsummaryPrice(price => price - totalPrice);
    }
  }
  const incrementOnClick = (name, price, isChecked, id) => {
    const toNumber = parseFloat(price)
    const updatedProductData = productData.map(item => {
      if (item.name === name) {
        return { ...item, quantity: item.quantity + 1, };
      }
      return item;
    })
    setProductData(updatedProductData);
    ; if (checkprice == true) {
      setsummaryPrice(prev => prev += toNumber)
      const updatequantityData = async () => {
        try {
          const querySnapshot = await getDocs(query(collection(db, "OrderId"), where("userId", "==", currentUser.uid)));
          querySnapshot.forEach(async (doc) => {
            const orderData = doc.data().order || [];
            console.log(orderData)
            const updatedOrder = orderData.map(item => {
              if (item.productsId === id) {
                return { ...item, quantity: item.quantity + 1 };
              }
              return item;
            });
            await updateDoc(doc.ref, { order: updatedOrder });
          });
        } catch (err) {
          console.error("Error add quantity", err)
        }
      }
      updatequantityData();
    }
  }
  const decrementOnClick = (name, price, isChecked, id) => {
    console.log(id)
    const toNumber = parseFloat(price)
    const updatedProductData = productData.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity - 1;
        if (newQuantity > 0) {
          return { ...item, quantity: newQuantity };
        } else {
          console.log("data")
          const deleteData = async () => {
            try {
              const userCartRef = doc(db, 'UserCart', `${Cartdata.id}`);
              await updateDoc(userCartRef, {
                productsId: arrayRemove(item.id)
              });
              setQuantityChanged(true);
            }
            catch (err) {
              console.log("Error delete", err)
            }
          }
          deleteData();
        }
      }
      return item;
    }); if (checkprice === true) {
      if (summaryPrice - toNumber > 0) {
        setsummaryPrice(prev => prev -= toNumber);
      } else {
        setsummaryPrice(prev => prev)
      }
    }
    setProductData(updatedProductData);
    const updatequantityData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "OrderId"), where("userId", "==", currentUser.uid)));
        querySnapshot.forEach(async (doc) => {
          const orderData = doc.data().order || [];
          console.log(orderData)
          const updatedOrder = orderData.map(item => {
            if(item.productsId === id){
              return {...item,quantity:item.quantity -1};
            }
            return item;
          });
          await updateDoc(doc.ref, { order: updatedOrder });
        });
      } catch (err) {
        console.error("Error add quantity",err)
      }
    }
    updatequantityData();
  }

  const submitOrder = async () => {
    if (checkprice) {
      try {
        // Iterate over the productData and remove each product from the cart
        productData.forEach(async (product) => {
          const userCartRef = doc(db, 'UserCart', Cartdata.id);
          await updateDoc(userCartRef, {
            productsId: arrayRemove(product.id)
          });
        });
        // Redirect the user to the next step (e.g., customer detail page)
        window.location.href = '/customerdetail';
      } catch (error) {
        console.error("Error deleting products from the cart:", error);
      }
    } else {
      alert("กรุณาเลือกสินค้าที่ต้องการ");
    }
  };
  return (
    <div className='cart-display'>
      <h1 className='Cart-header-text'>ตะกร้าสินค้า</h1> <div className='Cart-header-display'>
        <button onClick={handleTest}>Click Test</button>
      </div>
      <div className='Cart-display-row'>
        <div className='Cart-content-display'>
          {productData.map((data, index) => {
            return <div className='Cart-content' key={index}>
              <input type='checkbox' style={{ marginLeft: 40, transform: 'scale(2)' }} onChange={(e) => calculatePrice(e.target.checked, data.name, data.quantity, data.id)} ></input>
              <div className='Cart-content-margin'>
                <img src={data.image} width={150} height={150}></img>
                <h1>{data.name}</h1>
              </div>
              <div className='Cart-quantity'>
                <button onClick={() => incrementOnClick(data.name, data.price, true, data.id)} style={{ width: 30, height: 30 }}>+</button>
                <h1 style={{ border: "1px solid black", padding: 1, textAlign: "center" }}>{data.quantity}</h1>
                <button onClick={() => decrementOnClick(data.name, data.price, true, data.id)} style={{ width: 30, height: 30 }}> - </button>
              </div>
              <div className='Cart-end'>{data.price}฿.-</div>
            </div>
          })}</div>
        <div className='Cart-summary'>
          <div className='Cart-summary-text'>
            <h1 style={{ fontSize: 20, fontWeight: 'bolder', marginBottom: 30 }}>สรุปคำสั่งซื้อ</h1>
            <p > ราคา <span style={{ margin: 30, display: 'inline' }}>{summaryPrice} ฿.-</span></p>
            <br />
            <hr></hr>
            <button className='Cart-submit' onClick={()=>submitOrder()}>ดำเนินการต่อ</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart