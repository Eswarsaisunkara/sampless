export const Users = (props) =>{
    return(
      <>
      <div>
        <h1>{props.index}. Name: {props.name}</h1>
        <h1>Age: {props.age}</h1>
        <h1>Mail: {props.mail}</h1>
      </div>
      </>
    );
  };
