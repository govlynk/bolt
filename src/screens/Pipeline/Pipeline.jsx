import React, { useState } from "react";
import { Box } from "@mui/material";

import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Container from "./Container";
import Header from "../../components/Header";

import { Opportunities } from '../../data/demo';
import { pipelineColumns } from '../../data/kanban';

//  ***** Data *****
const tasksInMemory = Opportunities || [];

//create fake data
function createData(status, initializer) {
   const tasks = tasksInMemory.filter((task) => task.status === status);

   return tasks.map((task, index) => {
     return {
         id: task.id,
         title: task.title,
         status: task.status,
         priority: task.priority,
         type: task.type,
         comments: task.comments,
         attach: task.attach,
         avatar: task.avatar,
         owner: task.owner,
     };
   });
 }

//  ***** Main Function *****
 export default function Pipeline() {
   const [items, setItems] = useState(
     pipelineColumns.reduce((acc, column) => {
       acc[column.status] = createData(column.status);
       return acc;
     }, {})
   );

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );


//  ****** Find Container ******
  function findContainer(id) {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) => {
      return items[key].some((item) => item.id === id);
    });
  }


//   ****** Drag and Drop Functions ******
//   ****** Drag Start******
  function handleDragStart(event) {
   const activeId = event.active.id;
   setActiveId(activeId);
 }

 //   ****** Drag Over******
  function handleDragOver(event) {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((items) => {
      const activeItems = items[activeContainer];
      const overItems = items[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems?.findIndex(
        (item) => item.id === activeId
      );
      const overIndex = overItems?.findIndex((item) => item.id === overId);
      let newIndex;
      if (overId in items) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }
      return {
        ...items,
        [activeContainer]: items[activeContainer].filter(
          (item) => item.id !== active.id
        ),
        [overContainer]: [
          ...items[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...items[overContainer].slice(newIndex, items[overContainer].length)
        ]
      };
    });
  }


  //   ****** Drag End ******
  function handleDragEnd(event) {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over.id;
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer]?.findIndex(
      (item) => item.id === activeId
    );
    const overIndex = items[overContainer].findIndex(
      (item) => item.id === overId
    );

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex)
      }));
    }
    setActiveId(null);
  }


  //   ****** Return ******
  return (
      <Box  margin="20px"
            height="85vh"  
      >
         <Header title="Pipeline" subtitle="Kanban of Target Opportunities" />
         <Box              
                     display="flex"
                     height='75vh'
                     width='80vw'
                     justifyContent="space-between"
                     fontSize="1.875rem"
                     lineHeight="2.25rem"
                     padding="0.5rem"
                     fontWeight="700"
                     color="black"
                  >
         <DndContext
               sensors={sensors}
               collisionDetection={closestCorners}
               onDragStart={handleDragStart}
               onDragOver={handleDragOver}
               onDragEnd={handleDragEnd}
         >
               {Object.keys(items).map((key) => (

                        <Container key={key} containerId={key} items={items[key]} />
 
               ))}

         </DndContext>
         </Box>  
    </Box>
  );
}
