import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  // 1. Initialize State Variables
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  // 2. Setup URLs and ID
  let { id } = useParams();
  let root_url = window.location.origin;
  let dealer_url = root_url + "/djangoapp/dealer/" + id;
  let review_url = root_url + "/djangoapp/add_review";
  let carmodels_url = root_url + "/djangoapp/get_cars";

  // 3. Post Review Function (Includes parseInt and duplicate fetch fixes)
  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    
    if (!model || review === "" || date === "" || year === "" || model === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split[1];

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": parseInt(id), // Forces the ID to be a number
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": year,
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsoninput,
      });

      const json = await res.json();
      console.log("Server Response:", json);
      
      // Force the redirect
      window.location.href = window.location.origin + "/dealer/" + id;
      
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error occurred while posting.");
    }
  }

  // 4. Get Dealer Details (Includes null bypass fix)
  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();
      
      if (retobj.status === 200) {
        let dealerobjs = Array.from(retobj.dealer || []);
        if (dealerobjs.length > 0) {
          setDealer(dealerobjs[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  }

  // 5. Get Car Models
  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url, { method: "GET" });
      const retobj = await res.json();
      
      let carmodelsarr = Array.from(retobj.CarModels || []);
      setCarmodels(carmodelsarr);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }

  // 6. Run on Component Load
  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  // 7. Render UI
  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer?.full_name}</h1>
        <textarea id='review' cols='50' rows='7' onChange={(e) => setReview(e.target.value)}></textarea>
        
        <div className='input_field'>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        
        <div className='input_field'>
          Car Make 
          <select name="cars" id="cars" onChange={(e) => setModel(e.target.value)}>
            <option value="" selected disabled hidden>Choose Car Make and Model</option>
            {carmodels.map(carmodel => (
              <option key={carmodel.CarMake + carmodel.CarModel} value={carmodel.CarMake + " " + carmodel.CarModel}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>        
        </div>

        <div className='input_field'>
          Car Year <input type="number" onChange={(e) => setYear(e.target.value)} max={2023} min={2015} />
        </div>

        <div>
          <button className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  )
}

export default PostReview;