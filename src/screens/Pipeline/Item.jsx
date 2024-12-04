import React from 'react';
import { Box , Typography} from "@mui/material";

import ClearIcon from '@mui/icons-material/Clear';
import CommentIcon from '@mui/icons-material/CommentOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFileOutlined';
import AddIcon from '@mui/icons-material/Add';
import pic from './avatar.jpg';

export function Item({ item }) {
  const { title, priority, id, status,type, comments ,attach,avatar, owner,} = item;


  const handleDelete = () => {
      
  };



  return (
    <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '260px',
          height: 'auto',
          marginBottom: '10px',
          gap: '1rem',
          border: '1px dashed var(--colorWhite)',
          borderRadius: '0.375rem',
          cursor: 'grab',
          backgroundColor: 'white', // Uncomment if needed
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
    >

          <Box  display='flex'
                justifyContent= 'space-between'
          >
            {/* Prioity */}
            <Box    borderRadius='3px'
                    borderColor="black"
                    boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)'
                    color="white"
                    height='20px'
                    width='80px'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    margin='10px 0 15px 10px'

                    sx={{
                        backgroundColor: 
                          priority >= 60 ? "red" :
                          priority <= 30 ? "green" : "orange"
                      }}
                      
            >
              <Typography  color='var(--colorWhite)'
                    fontSize='12px'
                    fontWeight='400'
              >
                {priority + " days"}
              </Typography>
            </Box>
          </Box>

        {/* Title */}
        <Typography  color='var(--colorName)'
                fontSize='16px'
                fontWeight='400'
                margin='0 10px'
                wordwrap='break-word'
        >
              {title}
        </Typography>

        <Box  display='flex'
                justifyContent='space-between'
                margin='15px 0 10px 10px'
          >
            {/* Card menu Left */}
            <Box    width='65px'
                    display='flex'
                    justify-content='space-between'
            >
                {/* Comments wrapper */}
              <Box  display='flex'
                    alignItems='center'
              >
                <CommentIcon sx={{ color:'var(--colorBarW)' ,  
                            fontSize: '13px',
                }}/>
                <Typography     color='var(--colorBarW)'
                                fontSize= '13px'
                                display='flex'
                                alignItems='center'
                                marginLeft='5px'
                >
                    {comments}
                </Typography>
              </Box>

            {/* AttachFIle wrapper */}
              <Box  display='flex' 
                    alignItems='center'
              >
                <AttachFileIcon sx={{ color:'var(--colorBarW)',  fontSize: '13px' }}/>
                <Typography     color='var(--colorBarW)'
                                fontSize= '14px'
                                display='flex'
                                alignItems='center'
                                marginLeft='5px'
                >
                    {attach }
                </Typography>
              </Box>
            </Box>
            {/* Card Menu Right */}
            <Box    display='flex'
                    alignItems='center'
            >
                {/* Add People */}
              <Box  color='var(--colorBarW)'
                    width='28px'
                    height='28px'
                    border='1px dashed var(--colorBarW)'
                    borderRadius='50px'
                    position='relative'
                    fontSize='20px'
                    cursor='pointer'
              >
                <AddIcon/>
                
              </Box>
                {/* Avatar */}
              <Box style={{ width: '30px', height: '30px', margin: '0 10px 0 5px' }} 
              >
                  <img
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '30px'
                    }}
                    src={pic}
                    alt='owner'
                  />
              </Box>
            </Box>
          </Box>

          

    </div>
  );
}


export default Item;