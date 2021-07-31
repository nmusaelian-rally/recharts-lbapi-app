import { useState, useEffect, } from 'react';
import axios from 'axios';

const useFetch = (url1, url2, headers, initState) => {
  const [data, setData] = useState(initState);
  const [loading, setLoading] = useState(false);
  useEffect(()=>{
    const fetchData = async () => {
      try{
        setLoading(true);
        const result = await axios.all([
          axios.get(url1, {headers: headers}),
          axios.get(url2, {headers: headers})
        ]);
        console.log(result);
        setData({
          inProgress: result[0].data['Results'],
          released:   result[1].data['Results']
        });
      } catch(error){
        throw(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    },[url1, url2] //adding headers creates infinite loading
  )  
  return { loading, data }
}

export default useFetch;