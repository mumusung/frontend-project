import React, { useState, useEffect } from 'react'
import './Category.css'
import { GoPlus } from "react-icons/go";
import { initializeApp } from 'firebase/app';
import { collection, addDoc, setDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { list } from 'firebase/storage';

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

function Category() {
  const [addcategory, setAddcategory] = useState(false)
  const [currentUser, setCurrentUser] = useState(null);
  const [categoryname, setCategoryname] = useState('')
  const [listcategory, setListCategory] = useState([])
  const [addbrandtoggle, setaddbrandtoggle] = useState(false)
  const [categoryId, setcategoryId] = useState()
  const [brand, setBrand] = useState()
  const [onhovered, setOnhovered] = useState(false)
  const [brandId, setbrandId] = useState()


  useEffect(() => {
    const fetchCategory = async () => {
      const querySnapshot = await getDocs(collection(db, "Category"));
      const categories = []
      const categoriesId = []
      const brands = []
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`)
        categoriesId.push(doc.id)
        const branddata = `${JSON.stringify(doc.data())}`
        const toJSON = JSON.parse(branddata)
        const ProductData = toJSON
        console.log(ProductData)
        categories.push(ProductData)
        console.log(categoriesId)
      });
      setcategoryId(categoriesId)
      setListCategory(categories);
      setbrandId(brands);
    }; fetchCategory();
  }, [])
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
  const toggleCategory = () => {
    setAddcategory(!addcategory)
  }
  const togglebrand = (categoryId) => {
    console.log(categoryId)
    console.log(addbrandtoggle)
    setaddbrandtoggle(addbrandtoggle === categoryId ? false : categoryId)
  }
  const clickAdd = async () => {
    console.log(categoryname)
    try {
      const docRef = await addDoc(collection(db, "Category"),
        { Product: categoryname }
      );
      setCategoryname('');
      setAddcategory(!addcategory);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  const handleMouseEnter = (id) => {
    setOnhovered(true);
    setOnhovered(id)
  };

  const handleMouseLeave = (id) => {
    setOnhovered(false);
  };

  const Clicktest = () => {
    console.log(listcategory)
    // console.log(brandId)
  }
  const Closeaddproduct = () => {
      setaddbrandtoggle(false)
  }
  return (
    <div >
      <div className='category-row-brand'>
        <div className='category-column'>
          <div className='category-row'>
            <div className="category-list">
              <label>Category</label>
              <button onClick={Clicktest}>test</button>
            </div>
            {currentUser && <button className='category-button'><GoPlus size={20} onClick={toggleCategory} /></button>}
          </div>
          {listcategory.map((list, index) => {
            return <div className='category-row' key={index}>
              <a href={`${list.Product}`} className='category-list' onMouseEnter={() => handleMouseEnter(list)} onMouseLeave={() => handleMouseLeave()} onClick={Clicktest} >{list.Product}</a>
            </div>
          })}
        </div>
      </div>
      {addcategory &&
        <div class="box">
          <label>Add Category Name</label>
          <input className='category-input'
            type='text'
            value={categoryname}
            onChange={e => setCategoryname(e.target.value)}>
          </input>
          <button className='category-addbutton' onClick={clickAdd}> ADD</button>
        </div>}
    </div>
  )
}

export default Category