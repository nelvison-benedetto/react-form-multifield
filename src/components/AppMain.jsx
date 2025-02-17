//AppMain.jsx
import { useState, useEffect } from 'react'
import ManhuaCard from './ManhuaCard/ManhuaCard'
import { v4 as uuidv4 } from 'uuid';  //npm install uuid, but better use it in backend(still not using Autoincrement with sql)

export default function AppMain() {

  const availableTags = ['Isekai', 'Mecha', 'Slice of Life', 'Romantic Comedy', 'Fantasy'];
  const initialFormData = {  //the key names (i.e. "title") must be exactly the same in the html (i.e. <...name="title">) to link!
    slug: '',
    title: '',
    content: '',
    price: 0,
    file: null,
    category: '',
    tags: [],
    visibility: '',
  }

  const [searchedText, setSearchedText] = useState('');
  const [formData, setFormData] = useState(initialFormData)
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileURL, setSelectedFileURL] = useState(null);  //use this x preview img before submit on the browser
  const [mangas, setMangas] = useState([]);
  const [filteredMangas, setFilteredMangas] = useState(mangas);
  const [successMessage, setSuccessMessage] = useState('');  //x green mex after submit


  function fetchData(){
    fetch('http://localhost:3001/posts/')  //URL of RUNNING BACKEND APP repo 'express-api-crud'
      .then(res=>res.json())
      .then(response=>{
        setMangas(response.data);  //response data contains all obj posts in the backend 
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }
  function fetchDataPOST(formDataToSend) {
    fetch('http://localhost:3001/posts/', {
      method: 'POST',
      body: formDataToSend, // type form-data(x send also file type) not json (i.e. JSON.stringify(newManga))
    })
    .then(res => res.json())  
    .then(response => {
      console.log('Success', response);
      setMangas(response.data);  //set mangas with new uploaded list of mangas of the db
    })
    .catch(err => console.error('The Error:', err));
  }

  useEffect(() => {
    fetchData();
  },[]);   // [] means run only 1 time at the initial assembly

  useEffect(()=>{
    const xfilteredMangas=mangas.filter((item,index) =>item.title.toLowerCase().replace(/\s+/g,"").includes(searchedText.toLowerCase().replace(/\s+/g,"")));
    setFilteredMangas(xfilteredMangas);
  }, [mangas, searchedText]);  //executed each time mangas or searchedText change
  


  function handleSearchForm(e){e.preventDefault();}  //prevent default behaviour


  function handleFormField(e) {
    const{ name, type, value, checked, files } = e.target;  //extract top properties from the input!
    if(name==="file"&& e.target.files.length > 0) {
      const xfileSelected = e.target.files[0];
      if (xfileSelected instanceof File) {   //CHECK IF ITS A FILE AND NOT A STR!!
        const xfileSelectedURL = URL.createObjectURL(xfileSelected);  //create an obl image only x preview in the same browser
        
        setFormData((prev) => ({
          ...prev,
          file: xfileSelected,   
        }));
        setSelectedFileURL(xfileSelectedURL);
        setSelectedFile(xfileSelected);
      }
    }
    else if(name==='tags'){
      const newTags = value.includes(',') ? value.split(',').map(item => item.trim()) : [value];
      console.log("Newtags: "+newTags);
      const updatedTags = checked ? [...formData.tags, ...newTags] : formData.tags.filter(item => !newTags.includes(item));
      console.log("Updatedtags: "+updatedTags);
      setFormData(prev=>({
        ...prev,
        tags: updatedTags
      }));
    }
    else if(type==='checkbox'||type==='radio'){
      setFormData(prev=>({
        ...prev,
        [name]: checked ? value : ''  //[name] is the 'name=' in html! must be EXACTLY like the property in dataForm
      }));
    }
    else{
      setFormData(prev=>({ 
        ...prev,
        [name]: value  //[name] is the 'name=' in html! must be EXACTLY like the property in dataForm
      }))
    }
  }

  function handleTrashManga(mangaId) { 
    const updatesMangas = mangas.filter((item, index) => item.id!== mangaId);
    setMangas(updatesMangas);
  }

  function generateSlug(theformData) {
    if (!theformData.title){return '';}
    else{
      const generatedSlug = theformData.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g, '-').trim();
      return generatedSlug;
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('slug', generateSlug(formData));
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('content', formData.content.trim());
    formDataToSend.append('price', formData.price);
    if (formData.file && formData.file instanceof File){
      formDataToSend.append('file', formData.file);
    }
    else { console.log("no obj file found."); }
    formDataToSend.append('category', formData.category);
    formDataToSend.append('visibility', formData.visibility);
    formDataToSend.append("tags", JSON.stringify(formData.tags));  //altrimenti converte automatically array in str

    for (let pair of formDataToSend.entries()){
      console.log(`${pair[0]}:`, pair[1]);
    }

    fetchDataPOST(formDataToSend);

    setFormData(initialFormData)  //reset
    setSelectedFile(null);  //reset
    setSelectedFileURL(null);  //reset
    const fileInput = document.getElementById("formFile");
    if(fileInput){fileInput.value = "";}  //reset also the file value(che altrimenti rimane come testo nell'input file)

    setSuccessMessage("Added new Manhua successfully! 🥳");  //mex success
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  }

////////HTML////////


  return (
    <main id='debug'>

      {successMessage && (
        
        <div className="alert alert-success fixed-top text-center mt-4 mx-auto col-4" style={{zIndex: 10,backgroundColor:"green", borderRadius:"0.7rem"}}>
          <h4 style={{color:"white", paddingTop:"0.1rem"}}>{successMessage}</h4>
        </div>
      )}

      <div className='container' style={{paddingBottom:"4rem"}}>

        <div className='d-flex justify-content-end my-3'>
          <form onSubmit={handleSearchForm} className='' style={{ backgroundColor: "#262626" }}>
            <label htmlFor="searchtext" class="form-label">Search your favourite manhua</label>
            <input
              type="search"
              className='form-control'
              name='searchtext'
              id='searchtext'
              //aria-describedby='searchelper' to link to a elem <small> down here, x screenreaders
              placeholder='🍜 Search ...'
              value={searchedText}
              onChange={e => setSearchedText(e.target.value)}
            />
          </form>
        </div>


        <form className="container rounded p-4 mb-3"  onSubmit={handleFormSubmit}>
          <div className="row">
            {/*first column*/}
            <div className="col-md-8">

              {/*title, 1stcol-1strow*/}
              <div className="mb-3">
                <label htmlFor="formTitle" className="form-label">Manhua Title</label>
                <input
                  className="form-control"
                  required type="text"
                  id="formTitle"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleFormField}
                />  {/* required value= */}
              </div>

              {/*file+category, 1stcol-2ndrow*/}
              <div className="row ">  {/*>=768px i due figli si dispongono orizzontalmente(altrimenti rimangono in block)*/}
                <div className="col-md-6 mb-3">
                  <label htmlFor="formFile" className="form-label">Picture:</label>
                  {/* <label className="btn btn-DarkRose" htmlFor="formFile">Choose File</label>*/}  {/*CUSTOM BUTTON,simulate button,type="file" needs a <label>! */}
                  <input
                    className="form-control"
                    required type="file"
                    id="formFile"
                    name="file"
                    accept="image/*"
                    onChange={handleFormField}
                  />  {/* accept="image/*" ACCEPT ONLY IMG!*/}
                  {selectedFile && <img src={selectedFileURL} alt="cover image" className="img-fluid rounded mt-2" />}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="formCategory" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="formCategory"
                    name="category"
                    value={formData.category}
                    onChange={handleFormField}
                  >
                    <option value="None">None</option>
                    <option value="Shonen">Shonen</option>
                    <option value="Shojo">Shojo</option>
                    <option value="Seinen">Seinen</option>
                    <option value="Josei">Josei</option>
                    <option value="Kodomo">Kodomo</option>
                  </select>
                </div>
              </div>

              {/*tags+ postarchive+price, 1stcol-3rdrow*/}
              <div className="row ">

                {/*tags*/}
                <div className="col-md-6 mb-3">
                  <div className="row">  {/*row useful x tags a capo*/}
                    <span className=''>Tags:</span>
                    {availableTags.map((item, index) => (
                      <div key={index} className='form-check col-md-6' style={{paddingLeft:"2.15rem"}}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={item}
                          id={`formTag${item.replace(/\s+/g,'')}`}
                          name="tags"
                          onChange={handleFormField}
                          checked={formData.tags.includes(item)}
                        />
                        <label className='form-check-label' htmlFor={`formTag${item.replace(/\s+/g,'')}`}>
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-6 ">
                  <div className="mb-3 d-flex justify-content-center align-items-center gap-5" role="group" aria-label="Visibility">
                    <input
                      type="radio"
                      className="btn-check"  //quando use btn-check USARE SEMPRE <label> DOPO <input>!
                      name="visibility"
                      id="formVisibilityPost"
                      value="post"
                      autoComplete="off"
                      onChange={handleFormField}
                      checked={formData.visibility === 'post'}
                    />  {/*btn-check disable default radiobutton style, autoComplete disable autocompletamento(i.e. x logins ectect)*/}
                    <label className="btn btn-outline-DarkRose" htmlFor="formVisibilityPost">Post</label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="visibility"
                      id="formVisibilityArchive"
                      value="archive"
                      autoComplete="off"
                      onChange={handleFormField}
                      checked={formData.visibility === 'archive'}
                    />
                    <label className="btn btn-outline-DarkRose" htmlFor="formVisibilityArchive">Archive</label>
                  </div>
                  <div className='mb-3'>
                    <label htmlFor="formPrice" className='form-label'>Price</label>
                    <div className='input-group'>  
                      <span className="input-group-text">$</span>
                      <input className='form-control' type="number" min="0" step={0.1} id='formPrice' name='price' placeholder='100.00' aria-describedby="pricehelper" value={formData.price} onChange={handleFormField} />
                    </div>
                    <small id="pricehelper" className="form-text text-white">Type the price of your manhua</small>
                  </div>
                </div>
              </div>
            </div>

            {/*second column*/}
            <div className="col-md-4">
              <label htmlFor="formContent">Content</label>
              <textarea
                className="form-control mb-3"
                rows="7"
                id="formContent"
                name="content"
                placeholder="Content"
                value={formData.content}
                onChange={handleFormField}
              />
              <button className="btn btn-DarkRose w-100" type="submit">
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span>SAVE</span>
                  <i className="bi bi-cloud-arrow-up" />
                </span>
              </button>
            </div>
          </div>
        </form>        

        <section className='row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-3 mb-3'>
          {filteredMangas.map((item, index) => <ManhuaCard key={item.id} data={item} onTrashManga={handleTrashManga} />)}  {/*la key serve a map for track*/}
        </section>
        
      </div>
    </main>
  );

}

