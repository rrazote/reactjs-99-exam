import React, { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';
import Spinner from './components/Spinner/Spinner'; 
import Details from './data/Details'; 

const DivDetails = ({item}) => {

  const [view,setView] = useState(false);

  const onButtonClick = () => {
    setView(!view); 
  }
  let launchDate = item.launch_year; 
  let years = new Date().getFullYear() - parseInt(launchDate) ; 
  let text = (years > 1) ? years + ' years ago' : 'In a year';
  return(
  <>
    {
      view && <div className="Div-column">
        <div className="Div-row Div-upper-body">
          <span className="Date-span">{text}</span>|
          <a href={item.links.article_link} target='_blank' className='Div-upper-body-link'>Article</a>|
          <a href={item.links.video_link} target='_blank' className='Div-upper-body-link'>Video</a>
        </div>
        <div className="Div-row">
          <img className="Div-image" src={item.links.mission_patch_small}/>
          <div className="Div-details" >{item.details}</div>
        </div>
      </div> 
    } 
    <div>
      <button type="button" onClick={onButtonClick}>{(view) ? 'Hide' : 'View'}</button>
    </div>
      
    
  </>
  )
};

const App = () => {  
  const [sPageNo, setSPageNo] = useState(0);
  const [textFilter,setTextFilter] = useState('');
  const { 
    data, 
    loading,
    hasMore
  } = Details(sPageNo,textFilter);   
  const [currentData,setCurrentData] = useState([]);

  useEffect(() => {
    setCurrentData(data);
  },[data])

  const observer = useRef();
  const lastItemRef = useCallback( node => {
    if(loading) return;
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && textFilter.length === 0) {
        setSPageNo(prevPageNumber => prevPageNumber + 5)
      }
    })
    if (node) observer.current.observe(node)
  })

  const onChangeInput = (e) => { 
    setTextFilter(e.target.value);
    let newArr = [...data]
      .filter((item) => { 
        let mission_name = item.mission_name;
        console.log(mission_name); 
        return mission_name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1; 
      }); 
    setCurrentData(newArr);
  }

  

  return (
  <div className="App"> 
    <div className="Div-input">
      <input className="Search-text" type="text" placeholder="Search Mission Name" onChange={onChangeInput} value={textFilter}></input>
    </div> 
    <div className="List-space-x">
      {currentData.map((item,index) => (
        <div className="Div-space-x" key={item.mission_name} ref={(currentData.length === index + 1) ? lastItemRef : null}>
          <div className="Div-row Div-Header">
            <div className='Div-Title'>{item.mission_name}</div>
            {(item.launch_success !== null && <div className={(item.launch_success) ? 'Div-status-success' : 'Div-status-fail'}>{item.launch_success ? 'success' : 'failed'}</div>)}
            {(item.launch_success === null && <div className='Div-upcoming'>upcoming</div>)}
          </div> 
          <DivDetails item={item}/>
        </div>
      ))}
      <div className='Div-spinner'> 
      { loading && <Spinner/>}
      </div>
      { (!hasMore && textFilter.length === 0) && <div>end of list</div>}
    </div>    
    
  </div>
  );
}

export default App;
