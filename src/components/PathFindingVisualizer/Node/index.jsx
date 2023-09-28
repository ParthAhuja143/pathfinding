import React, { useState } from 'react'
import './style.css';
import NearMeIcon from '@mui/icons-material/NearMe';
import PlaceIcon from '@mui/icons-material/Place';
const Node = ({node, handleClick, additionalClassName}) => {

    const [currNode, setCurrNode] = useState(node);

    if(!node){
      return <td className={`node ${additionalClassName}`}>
        {
          additionalClassName === 'start-node circle' ? 
          <NearMeIcon sx={{
            fontSize: 16,
            color: 'white',
           }} />
           :
           additionalClassName === 'finish-node circle' ?
           <PlaceIcon sx={{
            fontSize: 16,
            color: 'white',
           }} /> 
           :
           ""
        }
      </td>
    }

    const {
      isFinish, 
      isStart, 
      row, 
      col, 
      isWall, 
      isVisited,
      isEnemy,
      isWeighted,
    } = node;

    const extraClassName = isFinish ? 'finish-node' : isStart ? 'start-node' : isWall ? 'wall-node' : isWeighted ? 'weight-node' : isEnemy ? 'enemy-node' : '';

  return (
    <td 
    id={`node-${row}-${col}`} 
    className={`node ${extraClassName} ${additionalClassName}`} 
    onClick={handleClick}
    >
     {isFinish ? <PlaceIcon sx={{
      fontSize: 20,
      color: 'white',
     }} /> : 
     isStart ? 
     <NearMeIcon sx={{
      fontSize: 20,
      color: 'white',
     }} /> 
     : 
     ""
     } 
    </td>
  )
}

export default Node;