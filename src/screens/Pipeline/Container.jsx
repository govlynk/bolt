import React from "react";
import { Box, Typography } from "@mui/material";

import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";

import Item from "./Item";

function SortableItem({id, item }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${Math.round(
          transform.y
        )}px, 0) scaleX(${transform.scaleX})`
      : "",
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Item item={item} />
    </div>
  );
}


// const Column = ({ title, color, tasks }) => {

const Container = ({ containerId, items, setNodeRef }) => {
   return (
     <SortableContext
       id={containerId}
       items={items}
       strategy={verticalListSortingStrategy}
     >
        <Box
            ref={setNodeRef}
            // borderTop={`4px solid ${color}`}       
            borderTop={`4px solid red`}    
            padding='10px'
            maxWidth='100%'
            maxHeight='100%'
            overflow='scroll'
            borderRadius='0.5rem'
            margin='5px'
            width='25%'
            boxShadow='2px -2px 8px 0px rgba(0, 0, 0, 0.1)'

            sx={{
                backgroundColor: theme =>
                    theme.palette.mode === 'dark' ? '#efefef' : '#efefef'
            }}
        >
            {/* Column Title */}
            <Typography
                fontSize='20px'
                fontWeight='400'
                sx={{
                    color: theme =>
                        theme.palette.mode === 'dark' ? '#707090' : '#777'
                }}
            >
                {containerId}
            </Typography>
            {/* Render Tasks */}
            
            {items.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))
            }


        </Box>

     </SortableContext>
   );
 };
 
 export default Container;