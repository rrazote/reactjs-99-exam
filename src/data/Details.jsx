import { useEffect, useState } from 'react';
import '../App.css';
import Axios from 'axios'; 

const Details = (sPageNo,textFilter) => {   
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [hasMore,setHasMore] = useState(true);

    useEffect( () => {
      setLoading(true)
      Axios({
        method: 'GET',
        url: 'https://api.spacexdata.com/v3/launches',
        params: {
          limit: 5,
          offset: sPageNo,
          filter: 'flight_number,mission_name,details,launch_year,launch_success,links/(mission_patch_small,article_link,video_link)'
        }
      })
      .then(res => {  
        setHasMore(res.headers['spacex-api-count'] > sPageNo);
        setData( prevData => {
          return [...new Set([...prevData, ...res.data])];
        });

        setLoading(false);
      }) 
          
    },[sPageNo])

    return {data,loading,hasMore};
}

export default Details;