import Head from 'next/head'
import { connectToDatabase } from '../util/mongodb'

export default function Home({ properties}) {


const book = async (property) => {

  const data = await fetch(`http://localhost:3000/api/book?property_id=${property._id}&guest=Bob`);

   const res = await data.json();
console.log(res);

}


  console.log(properties);
  return (
    <div>
          <Head>
          <title>Mongo DB Testing</title>
          <link href = "https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel = "stylesheet"></link>

          </Head>

      <div className = "container mx-auto">
<div className = "row w-full text-center my-4">
  <h1 className = "text-4x1 font-bold mb-5">TestingMongoDB</h1>
  
  </div>
      <div className = "flex flex-row flex-wrap">
      {properties && properties.map(property => (
      <div className = "flex-auto w-1/4 rounded overflow-hidden shadow-lg m-2">
      <img className = "w-full" src = {property.image}></img>
      <div className = "px-6 py-4">
        <div className = "font-bold text-x1 mb-2">{property.name} (Up to {property.guests} guests)</div>
          <p>{property.address.street}</p>
          <p className = "text-gray-700 text-base">
            {property.summary}
          </p>
          </div>

          <div className = "text-center py-2 my-2 font-bold">

            <span className = "text-green-500">${property.price}</span>/night
       </div>

       <div className = "text-center py-2 my-2">

         <button className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-5 rounded" onClick = {() => book(property)}>book</button>
       </div>
       </div>
      ))}
      </div>
      </div>
      </div>

 
  )
  }

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase()
  const data = await db.collection("listingsAndReviews").find().limit(20).toArray();

  const properties = JSON.parse(JSON.stringify(data));

const filtered = properties.map(property => {


  const price = JSON.parse(JSON.stringify(property.price));
  return{
      _id:property._id,
      name:property.name,
      image:property.images.picture_url,
      address: property.address,
      summary:property.summary,
      guests:property.accommodates,
      price:price.$numberDecimal,
  }

})

  return {
    props: { properties:filtered},
  }
}
