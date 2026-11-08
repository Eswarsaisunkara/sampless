const Planets = () =>{
    const planets = [
        {name:"Mars",isGasPlanet:false},
        {name:"Earth",isGasPlanet:false},
        {name:"Jupiter",isGasPlanet:true},
        {name:"Venus",isGasPlanet:false},
        {name:"Neptune",isGasPlanet:true},
        {name:"Uranus",isGasPlanet:true}
    ];

    return(
        <>
        <div className="planet-container">
            {planets.map((planet,key)=>{
                return(
                <div key={planet.name}>
                    <h1>{key + 1}. Planet Name: {planet.name}</h1>
                    <h1>Gas Planet: {planet.isGasPlanet ? "Yes" : "No"}</h1>
                </div>
                )
            })}
        </div>
        </>
    );

};

export default Planets