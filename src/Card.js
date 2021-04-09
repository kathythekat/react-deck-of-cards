function Card({ img, alt, randomRot }) {
  
  return <img className="Card" src={img} alt={alt} style={{
    transform:  randomRot 
  }}/>
}

export default Card;