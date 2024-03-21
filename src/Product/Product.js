import React, { useEffect, useState } from 'react';
import './Product.css';
import { initializeApp } from 'firebase/app';
import { collection, addDoc, setDoc, doc, getDocs, updateDoc, where, query, arrayUnion } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { v4 } from 'uuid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

function Product() {
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

    const [currentUser, setCurrentUser] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [addproducttoggle, setAddproductToggle] = useState(false);
    const [price, setPrice] = useState('');
    const [productDetail, setProductDetail] = useState('');
    const [productName, setProductName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedProduct, setSelectedProduct] = useState();
    const [ProductData, setProductData] = useState([]);
    const [ProductId, setProductId] = useState([]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log(user)
            if (user){const fetchUser = async () => {
                const userRef = await setDoc(doc(collection(db, "Users"), `${user.uid}`), {
                    id: user.uid,
                    email: user.email,
                });
            }
            fetchUser();}
            console.log(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            const querySnapshot = await getDocs(collection(db, "Category"));
            const product = []
            const brands = []
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`)
                const branddata = `${JSON.stringify(doc.data())}`
                const toJSON = JSON.parse(branddata)
                const categoryData = toJSON
                product.push(categoryData)
            });
            setCategoryName(product)
        }; fetchCategory();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            const querySnapshot = await getDocs(collection(db, "Product"));
            const fetchproductdata = []
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`)
                console.log(doc.id, " => ", doc.data());
                fetchproductdata.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setProductData(fetchproductdata);
            console.log(ProductData);
        }; fetchProduct();
    }, [currentUser]);

    const Clickaddproduct = () => {
        setAddproductToggle(true);
    }

    const Closeaddproduct = () => {
        setAddproductToggle(false);
    }

    const testClick = () => {
        console.log(currentUser.email);
    }

    const submitProduct = async (e) => {
        try {
            const docRef = await addDoc(collection(db, "Product"), {
                category: selectedProduct,
                image: imageUrl,
                name: productName,
                detail: productDetail,
                price: price
            });
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const addtoCart = async (e) => {
        console.log(e);
        try {
            const querySnapshot = await getDocs(query(collection(db, "UserCart"), where("userId", "==", currentUser.uid)));
    
            if (!querySnapshot.empty) {
                const cartDoc = querySnapshot.docs[0];
                await updateDoc(cartDoc.ref, {
                    productsId: arrayUnion(e.id)
                });
            } else {
                await addDoc(collection(db, "UserCart"), {
                    userId: currentUser.uid,
                    productsId: [e.id],
                });
            }
        } catch (err) {
            console.log("Error add Cart :", err);
        }
    };

    return (
        <div className='product-display'>
            {currentUser && 
                <div className='product-card-container'>
                    <button onClick={testClick}>TEST</button>
                    <button className='addproduct' onClick={Clickaddproduct}> Add Product</button>
                    {addproducttoggle && 
                        <div>
                            <form onSubmit={submitProduct} className="box">
                                <button className='close-button' onClick={Closeaddproduct}>X</button>
                                <label>Product</label>
                                <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                                    {categoryName.map((product, index) => (
                                        <option key={index}>{product.Product}</option>
                                    ))}
                                </select>
                                <label>Product name</label>
                                <input type='text' value={productName} onChange={(e) => setProductName(e.target.value)} />
                                <label>img (url)</label>
                                <input type='text' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                <labe>Product detail</labe>
                                <input type='text' value={productDetail} onChange={(e) => setProductDetail(e.target.value)} />
                                <label>Price</label>
                                <input type='text' value={price} onChange={(e) => setPrice(e.target.value)} />
                                <button type="submit" className='category-addbutton'> ADD</button>
                            </form>
                        </div>
                    }
                </div>
            }
            <div className='product-cards'>
                {ProductData.map((detail, index) => (
                    <Card key={index} sx={{ maxWidth: 200, height: 600,}}>
                    <CardActionArea>
                        <CardMedia
                            sx={{marginTop:3,width:'auto',height:'auto'}}
                            component="img"
                            image={detail.data.image}
                            alt="Product Image"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {detail.data.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxHeight: 200 }}>
                                {detail.data.detail}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions
                        sx={{
                            display: 'flex',
                            alignItems: 'end',
                            justifyContent: 'end',
                        }}
                    >
                        <Button size="small" color="primary">
                            {detail.data.price}฿
                        </Button>
                        <Button sx={{ fontSize: 13 }} onClick={() => addtoCart(detail)}>ADD TO CART</Button>
                    </CardActions>
                </Card>
                ))}
            </div>
        </div>
    );
}

export default Product;
