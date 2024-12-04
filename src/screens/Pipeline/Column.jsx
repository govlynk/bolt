import React from 'react';
import { Box, Typography } from "@mui/material";
import Task from './Task';

const Column = ({ title, color, tasks }) => {
    const generateTasks = () => {
        return tasks.map((task, index) => (
            <Task key={index} item={task} />
        ));
    };

    // Return
    return (
        // Column Container
        <Box
            borderTop={`4px solid ${color}`}
            padding='10px'
            minWidth='300px'
            minHeight='600px'
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
                {title}
            </Typography>
            {/* Render Tasks */}
            {generateTasks()}
        </Box>
    );
};

export default Column;