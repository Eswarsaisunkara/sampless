import Axios  from "axios";
import { useEffect } from "react";
import { useState } from "react";
const CatFact = () => {
    const [catFact, setCatFact] = useState("");
    const fetchCatFact = () =>{
        Axios.get("https://catfact.ninja/fact").then((res)=>{
            setCatFact(res.data.fact);
        });
    }

    useEffect(()=>{
        fetchCatFact();
    },[]);

    return (
        <div className="user-container">
            <button onClick={fetchCatFact} className="btn btn-lg res-btn">Generate Cat Fact</button>
            <p>{catFact}</p>
        </div>
    );
}

export default CatFact;