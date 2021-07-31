//import { useState, useEffect, } from 'react';
import { useState, useCallback } from 'react';
import axios from 'axios';

const useFetch = () => {
  //const [data, setData] = useState(initState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (requestCfg, packageData) => {
      setLoading(true);
      setError(null);
      const [url1, url2] = requestCfg.urls;
      const options = {
        method: requestCfg.method ? requestCfg.method : 'GET',
        headers: requestCfg.headers ? requestCfg.headers : {},
        body: requestCfg.body ? JSON.stringify(requestCfg.body) : null
      }
      try{
        const result = await axios.all([
            axios.get(url1, options),
            axios.get(url2, options)
          ]);
        packageData({
            inProgress: result[0].data['Results'],
            released:   result[1].data['Results']
        });
      }catch (err) {
        setError(err.message || 'Something went wrong!');
    }
    setLoading(false)
  }, [])
  return {
      loading,
      error,
      makeRequest
  }
}

export default useFetch;