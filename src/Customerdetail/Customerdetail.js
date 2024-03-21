import React from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { collection, query, where, getDocs, getDoc, updateDoc, getFirestore, doc } from "firebase/firestore";
import TextField from '@mui/material/TextField';
import './Customerdetail.css'


function Customerdetail() {
  const [currentUser, setCurrentUser] = useState(null)
  const [OrderId, setOrderId] = useState(null)
  const [Orderitem, setOrderItem] = useState('')
  const [productData, setProductData] = useState([])

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
  useEffect(() => {
    const fetchUserCart = async () => {
      if (!currentUser) return;
      const q = query(collection(db, "OrderId"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setOrderId(doc.id)
        setOrderItem(doc.data())
      });
    }; fetchUserCart();
  }, [currentUser])
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productFetch = await Promise.all(
          Orderitem.order.map(async (dataId) => {
            console.log(dataId)
            const productRef = doc(db, 'Product', `${dataId.productsId}`);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              return { ...productSnap.data(), quantity: dataId.quantity, id: dataId.productsId }
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
  }, [Orderitem, db]);

  const testClick = () => {
    console.log(Orderitem.order.map((item, index) => {
      return item.productsId
    }))
    console.log(productData)
  }
  const deleteData = async (id) => {
    try {
      const orderRef = doc(db, 'OrderId', OrderId);
      const orderSnapshot = await getDoc(orderRef);
      
      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.data();
        const updatedOrder = orderData.order.filter(item => item.productsId !== id);
        
        await updateDoc(orderRef, {
          order: updatedOrder
        });
        setProductData(prevProductData =>
          prevProductData.filter(product => product.id !== id)
        );
      } else {
        console.log("Order document not found");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return (<div className='Customer-display'>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '35ch', marginLeft: 2 },
        height: 'auto',
        width: '1000px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid black'
      }}
      noValidate
      autoComplete="off"
    >
      <div className='location-input'>
        <label style={{ marginLeft: 10, fontSize: 20, fontWeight: 'bold' }}>ที่อยู่สำหรับจัดส่ง</label>
        <br></br>
        <hr style={{ margin: 20 }}></hr>
        <TextField
          required
          id="firstname-required"
          label="ชื่อ"
        />
        <TextField
          required
          id="lastname-required"
          label="นามสกุล"
        />
        <TextField
          id="outlined-Email-input"
          label="Email"
          defaultValue="12345@hotmail.com"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          required
          id="outlined-Tel-number"
          label="Tel"
          type="text"
        />
        <TextField
          required
          id="province-required"
          label="จังหวัด"
        />
        <TextField
          required
          id="district-required"
          label="อำเภอ/เขต"
        />
        <TextField
          required
          id="subdistrict-required"
          label="ตำบล/แขวง"
        />
        <TextField
          required
          id="Village-required"
          label="บ้านเลขที่"
        />
        <TextField
          id="building"
          label="ชื่ออาคาร"
        />
        <TextField
          id="alley"
          label="ซอย"
        />
        <TextField
          id="Road"
          label="ถนน"
        />
      </div>
    </Box>
    <div className='order-summary'>
      <h1>สรุปรายการสั่งซื้อ</h1>
      <hr style={{ margin: 20 }}></hr>
      <h1>ข้อมูลลูกค้า</h1>
      <h1>Email:  <span style={{ margin: 30 }}>{currentUser ? currentUser.email : 'Not logged in'}</span></h1>
      <h1>tel:</h1>
      <h1>รายการสินค้า</h1>
      <h1>สินค้า <span style={{ marginLeft: 190 }}>ราคา</span></h1>
      {productData.map((data, index) => {
        return <div className='order-product'>
          <img src={`${data.image}`} width={50} height={50} ></img>
          <p>{data.name} <span style={{ margin: 20 }}>x{data.quantity}</span></p>
          <p style={{ margin: 20 }}>{data.price}</p>
          <button style={{ borderRadius: 10, fontSize: 12 }} onClick={() => deleteData(data.id)}>ลบสินค้า</button>
        </div>
      })}
      <button className='ordersubmit-button' onClick={testClick}>ชำระเงิน</button>
    </div>
  </div>
  )
}

export default Customerdetail