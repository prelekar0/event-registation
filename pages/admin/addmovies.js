import { useState, useEffect } from 'react';
import ImageInput from '../../components/imageInput';
import { upload } from '../../components/uploadFiles';
import { addDoc, collection } from 'firebase/firestore/lite'
import { db } from '../../utils/firebaseConfig';
import { toast } from "react-toastify";
import Loading from '../../components/loading';
import styles from "../../styles/adding.module.scss";
import close from "../../public/cancel.svg";
import Image from "next/image"


import { getDoc, doc } from "firebase/firestore/lite";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from "next/router"

const AddMovies = () => {
    const state = {
        name: '',
        tag: [],
        description: '',
        director: [],
        writers: [],
        stars: [],
        rating: '',
        poster: [],
        images: [],
        trailer: '',
        duration: '',
        release: Date,
        limit: '',
        active: false
    }

    const [movie, setMovie] = useState(state)
    const [files, setFiles] = useState([])
    const [poster, setPoster] = useState([])
    const [err, setErr] = useState('')
    const [isUploaded, setIsUploaded] = useState(false)
    const [loading, setLoading] = useState(false)

    const auth = getAuth()

    useEffect(() => {
        try {
            onAuthStateChanged(auth, async (u) => {
                if(u){
                const us = await getDoc(doc(db, 'users', `${u.uid}`))
                const data = us.data()
                const last = Router.pathname.split("/")
                if(data.role == "user" && last[1] == "admin")
                    Router.push("/");
                }
            })
        } catch (error) {
            return toast.error(error.message)
        }
    }, [])

    const handleInputChange = e => {
        const { name, value } = e.target
        setMovie({...movie, [name]: value})
    }

    const addTag = event => {
        if(event.target.value != ""){
            setMovie({...movie, tag: [...movie.tag, event.target.value] })
            event.target.value = ""
        }
    }

    const removeTag = indexToRemove => {
        const t = movie.tag.filter((_, index) => index != indexToRemove)
        setMovie({...movie, tag: t})
    }

    const addDirector = event => {
        if(event.target.value != ""){
            setMovie({...movie, director: [...movie.director, event.target.value] })
            event.target.value = ""
        }
    }

    const removeDirector = indexToRemove => {
        const dir = movie.director.filter((_, index) => index != indexToRemove)
        setMovie({...movie, director: dir})
    }

    const addWriters = event => {
        if(event.target.value != ""){
            setMovie({...movie, writers: [...movie.writers, event.target.value] })
            event.target.value = ""
        }
    }

    const removeWriters = indexToRemove => {
        const writer = movie.writers.filter((_, index) => index != indexToRemove)
        setMovie({...movie, writers: writer})
    }

    const addStars = event => {
        if(event.target.value != ""){
            setMovie({...movie, stars: [...movie.stars, event.target.value] })
            event.target.value = ""
        }
    }

    const removeStars = indexToRemove => {
        const star = movie.stars.filter((_, index) => index != indexToRemove)
        setMovie({...movie, stars: star})
    }   

    const handleUpload = async () => {
        try {
            setLoading(true)
            const res_images = await upload(`images/${auth.currentUser.uid}`, (files))
            // setMovie({...movie, images: res_images})
            const res_poster = await upload(`images/${auth.currentUser.uid}`, (poster))
            // const trailer = movie.trailer.substring(movie.trailer.lastIndexOf("/") + 1)
            setMovie({...movie, poster: res_poster, images: res_images})
            setIsUploaded(true)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            return toast.error(error.message)
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, "movies"), movie)
            setIsUploaded(false)
            setLoading(false)
            toast.success("The movie has been added successfully.")
            Router.push("/admin");
        } catch (error) {
            setLoading(false)
            return toast.error(error.message)
        }
    }

    return (
        <div className={styles.contain}>
            <div className={styles.add_form}>
            {
                loading && <Loading />
            }
                <div className={styles.add_simple}>
                    <div className={styles.add_main}>
                        <label htmlFor="name" className={styles.add_label}>name</label>
                        <input className={styles.add_input} type="text" id="name" placeholder="name" name="name" value={movie.name} onChange={handleInputChange} autoFocus/>
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="description" className={styles.add_label}>description</label>
                        <input className={styles.add_input} type="text" id="description" placeholder="description" name="description" value={movie.description} onChange={handleInputChange} />
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="trailer" className={styles.add_label}>trailer</label>
                        <input className={styles.add_input} type="text" id="trailer" placeholder="trailer" name="trailer" value={movie.trailer} onChange={handleInputChange} />
                        <small className={styles.add_small}>Add only code</small>
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="duration" className={styles.add_label}>duration</label>
                        <input className={styles.add_input} type="text" id="duration" placeholder="duration" name="duration" value={movie.duration} onChange={handleInputChange} />
                    </div>
                </div>
                <div className={styles.add_simple}>
                    <div className={styles.add_main}>
                        <label htmlFor="release" className={styles.add_label}>release</label>
                        <input className={styles.add_input} type="date" id="release" placeholder="release" name="release" value={movie.release} onChange={handleInputChange} />
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="limit" className={styles.add_label}>limit</label>
                        <input className={styles.add_input} type="text" id="limit" placeholder="limit" name="limit" value={movie.limit} onChange={handleInputChange} />
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="rating" className={styles.add_label}>rating</label>
                        <input className={styles.add_input} type="text" id="rating" placeholder="rating" name="rating" value={movie.rating} onChange={handleInputChange} />
                    </div>
                </div>
                <small className={styles.add_small}>Separate keywords with enter key</small>
                <div className={styles.add_tag}>
                    <div className={styles.add_main}>
                        <label htmlFor="tag" className={styles.add_label}>Goals</label>
                        <input className={styles.add_input} type="text" id="tag" placeholder="goals" name="tag" onKeyUp={e => (e.key == "Enter" ? addTag(e): null)}/>
                        <ul className={styles.add_ul}>
                        { 
                            movie.tag.map((tag, index) => (
                                <li key={index} className={styles.add_li}>
                                    <span>{tag}</span>
                                    <div className={styles.cont_add_icon}>
                                        <Image className={styles.close} width="15px" height="15px" src={close} alt="cancel" onClick={() => removeTag(index)} />
                                    </div>
                                </li>
                            ))
                        }
                        </ul>
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="director" className={styles.add_label}>Speaker</label>
                        <input className={styles.add_input} type="text" id="director" placeholder="speaker" name="director" onKeyUp={e => (e.key == "Enter" ? addDirector(e): null)} />
                        <ul className={styles.add_ul}>
                            {
                                movie.director.map((director, index) => (
                                    <li key={index} className={styles.add_li}>
                                        <span>{director}</span>
                                        <div className={styles.cont_add_icon}>
                                            <Image className={styles.close} width="15px" height="15px" src={close} alt="cancel" onClick={() => removeDirector(index)} />
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="writers" className={styles.add_label}>faculty co-ordinator</label>
                        <input className={styles.add_input} type="text" id="writers" placeholder="faculty co-ordinator" name="writers" onKeyUp={e => (e.key == "Enter" ? addWriters(e): null)} />
                        <ul className={styles.add_ul}>
                            {
                                movie.writers.map((writers, index) => (
                                    <li key={index} className={styles.add_li}>
                                        <span>{writers}</span>
                                        <div className={styles.cont_add_icon}>
                                            <Image className={styles.close} width="15px" height="15px" src={close} alt="cancel" onClick={() => removeWriters(index)} />
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="stars" className={styles.add_label}>Outcomes</label>
                        <input className={styles.add_input} type="text" id="stars" placeholder="outcomes" name="stars" onKeyUp={e => (e.key == "Enter" ? addStars(e): null)}/>
                        <ul className={styles.add_ul}>
                            {
                                movie.stars.map((stars, index) => (
                                    <li key={index} className={styles.add_li}>
                                        <span>{stars}</span>
                                        <div className={styles.cont_add_icon}>
                                            <Image className={styles.close} width="15px" height="15px" src={close} alt="cancel" onClick={() => removeStars(index)} />
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className={styles.add_image_input}>
                    <div className={styles.add_main}>
                        <label htmlFor="image" className={styles.add_label}>image</label>
                        <ImageInput multiple files={files} setFiles={setFiles} />
                    </div>
                    <div className={styles.add_main}>
                        <label htmlFor="poster" className={styles.add_label}>poster</label>
                        <ImageInput files={poster} setFiles={setPoster} />
                    </div>
                </div>
                <div className={styles.add_cont_button}>
                    {
                        isUploaded 
                        ? <button className={styles.add_button} onClick={handleSubmit}>Submit</button>
                        : <button className={styles.add_button} onClick={handleUpload}>Upload</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default AddMovies;