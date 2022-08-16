
import { useState, useEffect } from 'react';
import './App.css';



function App() {
  // Initiate variables
  
  const [barcode, setBarcode] = useState('n/a');
  const [title, setTitle] = useState('n/a');
  const [image, setImage] = useState('');
  const [isRecyclable, setIsRecyclable] = useState([]);
  const [data, setData] = useState(false);
  const [id, setId] = useState(0);
  // const [findItem, setFindItem] = useState('');
  const [contribution, setContribution] = useState();
  
  // Users search for item
  const handleGetData = (e) => {
    e.preventDefault();
    const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '51b32748f3msh07d3784cff8ad81p1046f7jsn6a0721dbdce1',
          'X-RapidAPI-Host': 'barcodes1.p.rapidapi.com'
        }
    };
      // example: 049000067316
    fetch('https://barcodes1.p.rapidapi.com/?query=' + parseInt(barcode), options)
        .then(response => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          setTitle(responseJson['product']['title'])
          setImage(responseJson['product']['images'][0])
        })
        .catch(err => console.error(err));
  }

  // Users check for item in database
  const handleCheckData = (e) => {
    e.preventDefault();
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'd5a9107caamsh123572a81b3a3b1p1f68a9jsn59b2f9b4d19e',
        'X-RapidAPI-Host': 'recycling.p.rapidapi.com'
      }
    };
    // Test example: 839020008617
    fetch('https://recycling.p.rapidapi.com/', options)
      .then(response => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        let theId = responseJson[responseJson.length-1].id;
        console.log(theId);
        setId(prevId => prevId = theId);
        console.log(`The id is: ${id}`)
        const result = responseJson.find((item) => {
          return title === item['title'];
        })
        if (result === undefined) {
          setIsRecyclable(['Item not found']);
        } else {
          setIsRecyclable([result['isRecyclable']]);
        }
        console.log(result);
      })
      .catch(err => console.error(err));
  }


  // Users update the database with new item

  const handlePostData = (e) => {
    e.preventDefault();
    console.log(data);

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'd5a9107caamsh123572a81b3a3b1p1f68a9jsn59b2f9b4d19e',
        'X-RapidAPI-Host': 'recycling.p.rapidapi.com'
      },
      body: JSON.stringify({
        id: id+1,
        title: title,
        isRecyclable: data
      })
    };
    
    fetch('https://recycling.p.rapidapi.com/', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  } 

  const handleYes = (e) => {
    e.preventDefault();
    setContribution(true);
  }

  const handleNo = (e) => {
    e.preventDefault();
    setContribution(false);
  }
  

  return (
    <div className="App">
      <h1>Let use Axios with React js</h1>

      {/* Search for products*/}
      <form>
        <label>Enter your barcode</label><br/>
        <input type='number' value={barcode} onChange={(e) => setBarcode(e.target.value)}/><br/>
        <button onClick={handleGetData}>Search</button>
      </form>

      {/* Showing products */}
      
      <table border='1px'>
        <tbody>
          <tr>
            <th>Barcode</th>
            <th>Title</th>
            <th>Image</th>
          </tr>
          <tr>
            <th>{barcode}</th>
            <th>{title}</th>
            <th><img src={image} width='100' height='100' alt='Product'></img></th>
          </tr>
        </tbody>
      </table>
      
      <br/><br/>
      {/* Check product at api */}
      <form>
        <label>Title received</label><br/>
        <input type='text' value={title} /><br/>
        <button onClick={handleCheckData}>Search</button>
      </form>
      <h1>Result checking:</h1>
      {isRecyclable[0] === undefined ? (
        <div>...Loading</div>
      ) : (
        <div>{isRecyclable[0].toString()}</div>
      )}
      

      
      {
        isRecyclable[0] === 'Item not found' ? (
        <div>
          <h1>Would you like to help us in the development of our database</h1><br/>
          <p>Your contribution will help making the environment better</p><br/>
          <button onClick={handleYes}>Yes</button> <br/>
          <button onClick={handleNo}>No</button> <br/> <br/>
        </div>
      ) : (
        <div></div>
      )
      }
      {
        contribution === true ? (
          <div>
            {title}
            <br/>
            <br/>
            <form>
              <input type="radio" value={true} onChange={(e) => setData(e.target.value)}/>
              <label>Recyclable</label><br/>
              <input type="radio" value={false} onChange={(e) => setData(e.target.value)}/>
              <label>General waste</label><br/><br/>
              
              <button onClick={handlePostData}>Submit</button>
            </form>
          </div>
        ) : (
          <div></div>
        )
      }
    </div>
  );
}

export default App;
