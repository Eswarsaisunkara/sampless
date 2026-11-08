import { useEffect, useState } from "react";

const Text = () => {
    const [text, setText] = useState("");

    const handleTextChange = (event) => {
        setText(event.target.value);
    }

    useEffect(()=>{
        console.log("Text component mounted");
    });


    return (
        <div className="container">
            <input
                type="text"
                className="input"
                placeholder="Type something..."
                value={text}
                onChange={handleTextChange}
            />
            <h1>{text}</h1>
        </div>
    );
}

export default Text;