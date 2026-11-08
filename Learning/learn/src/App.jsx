import './App.css';
import { Users } from './Users';
import Planets from './Planets';
import { useEffect, useState } from 'react';
import { Todo } from './Todo';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Text from './Text';
import CatFact from './CatFact';

function App() {
  const name = <h1>Eswar Sai</h1>;
  const age = <h1>21</h1>;
  const email = <h1>Eswarsunkara2004@gmail.com</h1>;
  const voterAge = 21;
  const names = ["Eswar", "Sai", "Ravi", "Chandu", "Sunkara"]
  const users = [
    { name: "Eswar", age: 21, mail: "Eswar@gmail.com" },
    { name: "Sai", age: 21, mail: "Sai@gmail.com" },
    { name: "Ravi", age: 21, mail: "Ravi@gmail.com" },
    { name: "Chandu", age: 21, mail: "Chandu@gmail.com" },
  ]
  const user = (
    <div>
      {name}
      {age}
      {email}
    </div>
  );

  // UseState Hook
  const [count, setCount] = useState(0);
  const increaseCount = () => {
    setCount(count + 1);
  };
  const decreaseCount = () => {
    setCount(count - 1);
  };
  const resetCount = () => {
    setCount(0);
  };

  // Input handler with useState and useEffect
  const [inputValue, setInputValue] = useState("");
  const [prevLength, setPrevLength] = useState(0);
  const [color, setColor] = useState("black");

  const handleInputValue = () => {
    setInputValue(event.target.value);
  };

  // useEffect for input handler to change color based on the length of the input value
  useEffect(() => {
    if (inputValue.length > prevLength)
      { setColor("green"); }
    else if (inputValue.length < prevLength) 
      { setColor("red"); }
    setPrevLength(inputValue.length);

    const timer = setTimeout(() => { setColor("black"); }, 1000)
    return () => clearTimeout(timer);
    
  }, [inputValue]);


  // Hide and Show Text 
  const [showText, setShowText] = useState(true);
  const [textColor, setTextColor] = useState("#082435");


  // Without Props means in place of {props.var} it will be values of the User
  const User = (details) => {
    return (
      <>
        <div>
          <h1>{details.name}</h1>
          <h1>{details.age}</h1>
          <h1>{details.mail}</h1>
        </div>
      </>
    );
  };

  const Job = (props) => {
    return (
      <>
        <div>
          <h1>Salary: {props.salary}</h1>
          <h1>Position: {props.position}</h1>
          <h1>Company: {props.company}</h1>
        </div>
      </>
    );
  };

  return (
    <>
      {/* 1. Direct HTML Tags in React */}
      <div className='container'>
        <h1>Eswar Sai</h1>
        <h1>21</h1>
        <h1>Eswarsunkara2004@gmail.com</h1>
        <h2>We are Tags</h2>
      </div>

      {/* 2. Using Const in Js for the User details */}
      <div className='container' >
        {name}
        {age}
        {email}
        <h2>We are Constants</h2>
      </div>

      {/* 3. User Details directly from a Const  */}
      <div className="container">
        {user}
        <h2>I am User Details</h2>
      </div>

      {/* 4. User Component without input  */}
      <div className="container">
        <User />
        <h2>I am Component with Predefined Data without props so no data will be visibled. </h2>
      </div>

      {/* 5. Using Components with Props */}
      <div className="container">
        <User name="Eswar Sai" age={21} mail="Eswarsunkara2004@gmail.com" />
        <h2>I am Component with Props</h2>
      </div>

      {/* 6. Task for Job Component with Props */}
      <div className='job-container'>
        <Job
          salary={90000}
          position="SDE"
          company="Amazon"
        />
        <Job
          salary={100000}
          position="Senior Developer"
          company="Google"
        />
        <Job
          salary={250000}
          position="System Developer"
          company="Apple"
        />
      </div>


      {/* 7. If - Else Statements Used for Info and Login */}
      <div>
        {(voterAge >= 18) ? <h1>Eligible to vote</h1> : <h1>Ineligible to vote</h1>}
      </div>

      {/* 8. If - Else without duplicates */}
      <div className='container'>
        <h1 style={{ color: voterAge >= 18 ? "#024c26" : "#a71212" }}>
          {voterAge >= 18 ? "Eligible to vote " : "Ineligible to vote"}
        </h1>
      </div>

      {/* 9.Working with Lists */}
      <div className='list-container'>
        {names.map((name, key) => {
          return (<h1 key={key}>{key + 1}. {name}</h1>)
        })}
      </div>

      {/* 10. Components with Lists */}
      <div className='user-container'>
        {users.map((u, key) => { return (<Users key={key} index={key + 1} name={u.name} age={u.age} mail={u.mail} />) })}
      </div>

      {/* 11. Planets Task */}
      <Planets />

      {/* 12. Count Increment and Decrement Tool */}
      <div className='container'>
        <h1>1. Count Increment Decrement and Reset Tool</h1>
        <h1 style={{ color: count >= 0 ? count > 0 ? "green" : "black" : "red" }}>{count}</h1>
        <div>
          <button className="btn inc-btn" onClick={increaseCount}>Increase Count</button>
          <button className="btn res-btn" onClick={resetCount}>Reset Count</button>
          <button className="btn dec-btn" onClick={decreaseCount}>Decrease Count</button>
        </div>
      </div>

      {/* 13. Input Use Case for Usestate Hook */}
      <div className='list-container'>
        <h1>2. Input Handler</h1>
        <input className="input" type="text" onChange={handleInputValue} />
        <br />
        <h1 style={{ color }}>{inputValue}</h1>
      </div>

      {/* 14. Hide and Seek Button */}
      <div className='planet-container text-center'>
        <h1>3. Hide and Seek Game</h1>
        <button className="btn res-btn" onClick={() => { setShowText(!showText); }}>Show Or Hide</button>
        <button className="btn dec-btn" onClick={() => { setTextColor(textColor === "#17ac53" ? "#f31414" : "#17ac53"); }}>Change Color</button>
        {showText && <h1 style={{ color: textColor }}>Hide and Seek</h1>}
      </div>

      {/* 15. Todo-List App with useState and useEffect Hooks */}
      <Todo />

      {/* 16. useEffect for Text.jsx*/}
      <div className='container'>
        <button className="btn res-btn"onClick={() => { setShowText(!showText) }}>Show Text</button>
        {showText && <Text />}
      </div>

      {/* 17. API Fetching*/}
      <CatFact/>

      {/* React Router Dom */}
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link> | {""}
          <Link to="/about">About</Link> | {""}
          <Link to="/contact">Contact</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
